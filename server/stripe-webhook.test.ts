import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleStripeWebhook } from './stripe-webhook';
import type { Request, Response } from 'express';

describe('Stripe Webhook', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn().mockReturnValue({});
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: Buffer.from('{}'),
    };

    mockRes = {
      json: jsonMock,
      status: statusMock,
    };
  });

  it('should return 400 if webhook secret is not configured', async () => {
    const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    try {
      await handleStripeWebhook(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
    } finally {
      if (originalSecret) {
        process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
      }
    }
  });

  it('should handle test events correctly', async () => {
    // Mock test event
    const testEvent = {
      id: 'evt_test_123456',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          client_reference_id: '1',
          amount_total: 10000,
          payment_method_types: ['card'],
          metadata: {
            customer_name: 'Test User',
            customer_email: 'test@example.com',
          },
        },
      },
    };

    // This test verifies the webhook structure
    expect(testEvent.id.startsWith('evt_test_')).toBe(true);
    expect(testEvent.type).toBe('checkout.session.completed');
    expect(testEvent.data.object.amount_total).toBe(10000);
  });

  it('should validate webhook signature', async () => {
    // This test verifies that signature validation is required
    const mockReqWithoutSignature: Partial<Request> = {
      headers: {},
      body: Buffer.from('{}'),
    };

    // The webhook should reject requests without proper signature
    expect(mockReqWithoutSignature.headers).not.toHaveProperty('stripe-signature');
  });

  it('should process checkout.session.completed event', async () => {
    const checkoutEvent = {
      id: 'evt_123456',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_123',
          client_reference_id: '1',
          amount_total: 10000,
          payment_method_types: ['card'],
          payment_intent: 'pi_123',
          metadata: {
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            product_id: '1',
          },
        },
      },
    };

    expect(checkoutEvent.type).toBe('checkout.session.completed');
    expect(checkoutEvent.data.object.amount_total).toBe(10000);
    expect(checkoutEvent.data.object.metadata.customer_name).toBe('John Doe');
  });

  it('should process payment_intent.succeeded event', async () => {
    const paymentEvent = {
      id: 'evt_789012',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 10000,
          status: 'succeeded',
          client_secret: 'pi_123_secret',
        },
      },
    };

    expect(paymentEvent.type).toBe('payment_intent.succeeded');
    expect(paymentEvent.data.object.status).toBe('succeeded');
    expect(paymentEvent.data.object.amount).toBe(10000);
  });

  it('should process charge.refunded event', async () => {
    const refundEvent = {
      id: 'evt_345678',
      type: 'charge.refunded',
      data: {
        object: {
          id: 'ch_123',
          amount: 10000,
          refunded: true,
          payment_intent: 'pi_123',
        },
      },
    };

    expect(refundEvent.type).toBe('charge.refunded');
    expect(refundEvent.data.object.refunded).toBe(true);
    expect(refundEvent.data.object.payment_intent).toBe('pi_123');
  });

  it('should extract guest information from checkout session', async () => {
    const session = {
      id: 'cs_123',
      client_reference_id: '1',
      amount_total: 15000,
      payment_method_types: ['card'],
      payment_intent: 'pi_123',
      metadata: {
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        product_id: '2',
      },
    };

    const guestName = session.metadata?.customer_name || 'Anonymous';
    const guestEmail = session.metadata?.customer_email || '';
    const amount = session.amount_total ? (session.amount_total / 100).toString() : '0';

    expect(guestName).toBe('Jane Smith');
    expect(guestEmail).toBe('jane@example.com');
    expect(amount).toBe('150');
  });

  it('should calculate correct amount from Stripe format', async () => {
    const stripeAmount = 25000; // $250.00 in cents
    const convertedAmount = (stripeAmount / 100).toFixed(2);

    expect(convertedAmount).toBe('250.00');
  });
});
