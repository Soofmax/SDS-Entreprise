import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Auth callbacks', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('refuse Google sign-in for non-existing user', async () => {
    vi.mock('@/lib/db/client', () => ({
      prisma: {
        user: { findUnique: vi.fn().mockResolvedValue(null) },
        analyticsEvent: { create: vi.fn() },
      },
    }));

    const { authOptions } = await import('@/lib/auth/config');
    const result = await authOptions.callbacks?.signIn?.({
      user: { id: 'u1', email: 'nouveau@ex.com', name: 'Nouveau' } as any,
      account: { provider: 'google' } as any,
      profile: {} as any,
      email: undefined,
      credentials: undefined,
    } as any);

    expect(result).toBe(false);
  });

  it('authorize credentials when password is valid and user active', async () => {
    vi.mock('bcryptjs', () => ({
      default: { compare: vi.fn().mockResolvedValue(true) },
      compare: vi.fn().mockResolvedValue(true),
      hash: vi.fn(),
    }));
    vi.mock('@/lib/db/client', () => ({
      prisma: {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'u1',
            email: 'test@example.com',
            name: 'Test',
            passwordHash: '$2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            role: 'ADMIN',
            active: true,
          }),
          update: vi.fn(),
        },
        analyticsEvent: { create: vi.fn() },
      },
    }));

    const { authOptions } = await import('@/lib/auth/config');
    const provider = (authOptions.providers as any[]).find((p) => p.name === 'credentials');

    const user = await provider.options.authorize({
      email: 'test@example.com',
      password: 'secret',
    });

    expect(user).toBeTruthy();
    expect(user.email).toBe('test@example.com');
  });
});