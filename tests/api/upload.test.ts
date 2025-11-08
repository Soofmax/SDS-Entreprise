import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('/api/upload (magic bytes)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('rejette un fichier avec MIME déclaré image mais magic bytes invalides', async () => {
    // Mock session auth
    vi.doMock('next-auth', () => ({
      getServerSession: vi.fn().mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } }),
    }));

    const { POST } = await import('@/app/api/upload/route');

    // Créer un faux fichier texte déguisé en image/jpeg
    const content = 'not-an-image';
    const blob = new Blob([content], { type: 'image/jpeg' });
    const file = new File([blob], 'fake.jpg', { type: 'image/jpeg' });

    const form = new FormData();
    form.set('file', file);
    form.set('category', 'test');

    const req: any = {
      method: 'POST',
      headers: new Headers({ origin: 'http://localhost:3000' }),
      formData: async () => form,
    };

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('magic bytes mismatch');
  });
});