import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Next.js
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    searchParams: new URLSearchParams(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock de NextAuth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}));

// Mock de Prisma
vi.mock('@/lib/db/client', () => ({
  prisma: {
    contact: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    analyticsEvent: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    errorLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

// Mock de Stripe
vi.mock('stripe', () => ({
  default: vi.fn(() => ({
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
    paymentIntents: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
    },
    webhooks: {
      constructEvent: vi.fn(),
    },
  })),
}));

// Mock de Resend
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

// Mock des variables d'environnement
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  NEXTAUTH_SECRET: 'test-secret',
  NEXTAUTH_URL: 'http://localhost:3000',
  STRIPE_SECRET_KEY: 'sk_test_123',
  RESEND_API_KEY: 'test-key',
};

// Mock de fetch global
global.fetch = vi.fn();

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock de console pour les tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Nettoyage après chaque test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Configuration globale pour les tests
beforeAll(() => {
  // Configuration des timeouts
  vi.setConfig({ testTimeout: 10000 });
});

// Utilitaires de test personnalisés
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN',
  active: true,
  ...overrides,
});

export const createMockContact = (overrides = {}) => ({
  id: 'test-contact-id',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+33123456789',
  company: 'Test Company',
  projectType: 'vitrine',
  budget: '3000-5000',
  timeline: '1-2 mois',
  message: 'Test message',
  status: 'NEW',
  priority: 'MEDIUM',
  createdAt: new Date(),
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  title: 'Test Project',
  description: 'Test project description',
  category: 'VITRINE',
  status: 'COMPLETED',
  imageUrl: '/test-image.jpg',
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/test/repo',
  featured: false,
  order: 0,
  createdAt: new Date(),
  ...overrides,
});

// Helper pour les tests d'API
export const createMockRequest = (options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  url?: string;
} = {}) => {
  const { method = 'GET', body, headers = {}, url = 'http://localhost:3000' } = options;
  
  return {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...headers,
    }),
    json: async () => body,
    url,
  } as any;
};

export const createMockResponse = () => {
  const response = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: vi.fn(),
    text: vi.fn(),
  };
  
  return response as any;
};

