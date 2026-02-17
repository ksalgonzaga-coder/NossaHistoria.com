import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';

let stripeInstance: StripeType | null = null;

function getStripe(): StripeType {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return stripeInstance;
}
import { createStripeLineItem } from './stripe-products';

export async function createCheckoutSession(options: {
  amount: number;
  guestName: string;
  guestEmail?: string;
  productId?: number;
  quantity?: number;
  origin: string;
  userId?: string;
}) {
  const {
    amount,
    guestName,
    guestEmail,
    productId,
    quantity = 1,
    origin,
    userId,
  } = options;

  try {
    const stripeClient = getStripe();
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [createStripeLineItem(amount, quantity)],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      customer_email: guestEmail,
      client_reference_id: userId || guestName,
      metadata: {
        guest_name: guestName,
        guest_email: guestEmail || 'unknown',
        product_id: productId?.toString() || 'none',
        quantity: quantity.toString(),
        user_id: userId || 'guest',
      },
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function retrieveSession(sessionId: string) {
  try {
    const stripeClient = getStripe();
    return await stripeClient.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Error retrieving session:', error);
    throw error;
  }
}
