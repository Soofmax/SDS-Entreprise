import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest } from '../setup';

describe('/api/stripe/checkout', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('crée une session de checkout Stripe', async () => {
    // Mock stripe sdk
    const sessionMock = { id: 'cs_test_123', url: 'https://stripe.test/checkout/cs_test_123' };
    const customerMock = { id: 'cus_123', email: 'john@example.com' };

    const stripeCtor: any = vi.fn(() => ({
      customers: {
        list: vi.fn().mockResolvedValue({ data: [] }),
        create: vi.fn().mockResolvedValue(customerMock),
      },
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue(sessionMock),
          retrieve: vi.fn(),
        },
      },
      paymentIntents: { create: vi.fn(), retrieve: vi.fn() },
      webhooks: { constructEvent: vi.fn() },
    }));
    vi.doMock('stripe', () => ({ default: stripeCtor }));

    const { POST } = await import('@/app/api/stripe/checkout/route');

    const body = {
      packageId: 'ESSENTIEL',
      customerInfo: { email: 'john@example.com', name: 'John' },
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    };

    const req = createMockRequest({ method: 'POST', body, headers: { origin: 'https://example.com' } });
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.sessionId).toBe(sessionMock.id);
    expect(data.url).toBe(sessionMock.url);
  });
});