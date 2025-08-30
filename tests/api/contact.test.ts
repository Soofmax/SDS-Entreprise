import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/contact/route';
import { createMockRequest, createMockContact } from '../setup';

// Mock des services
vi.mock('@/lib/db/client', () => ({
  prisma: {
    contact: {
      create: vi.fn(),
      count: vi.fn(),
    },
    analyticsEvent: {
      create: vi.fn(),
    },
    errorLog: {
      create: vi.fn(),
    },
  },
  connectWithRetry: vi.fn((fn) => fn()),
}));

vi.mock('@/lib/utils/rateLimit', () => ({
  rateLimit: vi.fn(),
}));

vi.mock('@/lib/services/email', () => ({
  sendContactEmail: vi.fn(),
}));

vi.mock('@/lib/services/analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/contact', () => {
    it('crée un contact avec des données valides', async () => {
      const { prisma } = await import('@/lib/db/client');
      const { rateLimit } = await import('@/lib/utils/rateLimit');
      const { sendContactEmail } = await import('@/lib/services/email');
      const { trackEvent } = await import('@/lib/services/analytics');

      // Mock des retours
      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const mockContact = createMockContact();
      (prisma.contact.create as any).mockResolvedValue(mockContact);
      (sendContactEmail as any).mockResolvedValue(undefined);
      (trackEvent as any).mockResolvedValue(undefined);

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33123456789',
        company: 'Test Company',
        projectType: 'vitrine',
        budget: '3000-5000',
        timeline: '1-2 mois',
        message: 'Je souhaite créer un site vitrine pour mon entreprise.',
      };

      const request = createMockRequest({
        method: 'POST',
        body: validData,
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0 Test Browser',
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toContain('succès');
      
      // Vérifier que les services ont été appelés
      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: validData.name,
          email: validData.email,
          projectType: validData.projectType,
          status: 'NEW',
          priority: 'MEDIUM',
        }),
      });

      expect(sendContactEmail).toHaveBeenCalledTimes(2); // Admin + client
      expect(trackEvent).toHaveBeenCalled();
    });

    it('rejette les données invalides', async () => {
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const invalidData = {
        name: 'J', // Trop court
        email: 'invalid-email', // Format invalide
        projectType: 'invalid-type', // Type invalide
        budget: '', // Manquant
        timeline: '', // Manquant
        message: 'Court', // Trop court
      };

      const request = createMockRequest({
        method: 'POST',
        body: invalidData,
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe('VALIDATION_ERROR');
      expect(responseData.error.details).toBeDefined();
    });

    it('applique le rate limiting', async () => {
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 900000,
      });

      const request = createMockRequest({
        method: 'POST',
        body: { name: 'Test' },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(429);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('détecte les bots avec le honeypot', async () => {
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const botData = {
        name: 'Bot',
        email: 'bot@example.com',
        projectType: 'vitrine',
        budget: '1000-3000',
        timeline: '1 mois',
        message: 'Bot message',
        website: 'http://spam.com', // Champ honeypot rempli
      };

      const request = createMockRequest({
        method: 'POST',
        body: botData,
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      
      // Vérifier qu'aucun contact n'a été créé
      const { prisma } = await import('@/lib/db/client');
      expect(prisma.contact.create).not.toHaveBeenCalled();
    });

    it('gère les erreurs de base de données', async () => {
      const { prisma } = await import('@/lib/db/client');
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      (prisma.contact.create as any).mockRejectedValue(new Error('Database error'));

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        projectType: 'vitrine',
        budget: '3000-5000',
        timeline: '1-2 mois',
        message: 'Test message',
      };

      const request = createMockRequest({
        method: 'POST',
        body: validData,
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe('INTERNAL_ERROR');
      
      // Vérifier que l'erreur a été loggée
      expect(prisma.errorLog.create).toHaveBeenCalled();
    });

    it('sanitise les données d\'entrée', async () => {
      const { prisma } = await import('@/lib/db/client');
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const mockContact = createMockContact();
      (prisma.contact.create as any).mockResolvedValue(mockContact);

      const dataWithXSS = {
        name: '  John <script>alert("xss")</script> Doe  ',
        email: 'john@example.com',
        projectType: 'vitrine',
        budget: '3000-5000',
        timeline: '1-2 mois',
        message: 'Message with   multiple   spaces',
      };

      const request = createMockRequest({
        method: 'POST',
        body: dataWithXSS,
      });

      await POST(request);

      // Vérifier que les données ont été sanitisées
      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'John  Doe', // Espaces normalisés, script supprimé
          message: 'Message with multiple spaces', // Espaces multiples normalisés
        }),
      });
    });

    it('valide le format du téléphone français', async () => {
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const invalidPhoneData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456', // Format invalide
        projectType: 'vitrine',
        budget: '3000-5000',
        timeline: '1-2 mois',
        message: 'Test message',
      };

      const request = createMockRequest({
        method: 'POST',
        body: invalidPhoneData,
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error.details.phone).toBeDefined();
    });
  });

  describe('GET /api/contact', () => {
    it('retourne les statistiques de contact', async () => {
      const { prisma } = await import('@/lib/db/client');

      // Mock des statistiques
      (prisma.contact.count as any)
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(5)   // today
        .mockResolvedValueOnce(25)  // thisWeek
        .mockResolvedValueOnce(80); // thisMonth

      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual({
        total: 100,
        today: 5,
        thisWeek: 25,
        thisMonth: 80,
      });
    });

    it('gère les erreurs lors de la récupération des stats', async () => {
      const { prisma } = await import('@/lib/db/client');

      (prisma.contact.count as any).mockRejectedValue(new Error('Database error'));

      const request = createMockRequest({
        method: 'GET',
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe('STATS_ERROR');
    });
  });

  describe('Validation des champs', () => {
    it('valide les types de projet autorisés', async () => {
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const validProjectTypes = ['vitrine', 'ecommerce', 'application', 'refonte', 'seo', 'maintenance'];

      for (const projectType of validProjectTypes) {
        const data = {
          name: 'John Doe',
          email: 'john@example.com',
          projectType,
          budget: '3000-5000',
          timeline: '1-2 mois',
          message: 'Test message',
        };

        const request = createMockRequest({
          method: 'POST',
          body: data,
        });

        const response = await POST(request);
        expect(response.status).not.toBe(400);
      }
    });

    it('rejette les caractères spéciaux dans le nom', async () => {
      const { rateLimit } = await import('@/lib/utils/rateLimit');

      (rateLimit as any).mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 900000,
      });

      const invalidNameData = {
        name: 'John123@#$',
        email: 'john@example.com',
        projectType: 'vitrine',
        budget: '3000-5000',
        timeline: '1-2 mois',
        message: 'Test message',
      };

      const request = createMockRequest({
        method: 'POST',
        body: invalidNameData,
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error.details.name).toBeDefined();
    });
  });
});

