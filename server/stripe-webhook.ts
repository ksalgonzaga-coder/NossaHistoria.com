import Stripe from 'stripe';
import { Request, Response } from 'express';
import { getDb } from './db';
import { eq } from 'drizzle-orm';
import { transactions } from '../drizzle/schema';
import { ENV } from './_core/env';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error: any) {
    console.error('[Webhook] Signature verification failed:', error.message);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({
      verified: true,
    });
  }

  console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Webhook] Checkout session completed: ${session.id}`);

  const db = await getDb();
  if (!db) {
    console.error('[Webhook] Database not available');
    return;
  }

  try {
    // Extract metadata from session
    const clientRefId = session.client_reference_id;
    const guestName = session.metadata?.customer_name || 'Anonymous';
    const guestEmail = session.metadata?.customer_email || '';
    const productId = session.metadata?.product_id ? parseInt(session.metadata.product_id) : null;
    const amount = session.amount_total ? (session.amount_total / 100).toString() : '0';

    // Find existing transaction by Stripe session ID
    const existingTx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.stripeSessionId, session.id))
      .limit(1);

    if (existingTx.length > 0) {
      console.log(`[Webhook] Transaction already processed: ${session.id}`);
      return;
    }

    // Create or update transaction
    await db.insert(transactions).values({
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      guestName,
      guestEmail,
      productId,
      amount,
      status: 'completed',
      paymentMethod: session.payment_method_types?.[0] || 'card',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`[Webhook] Transaction created: ${guestName} - R$ ${amount}`);

    // Log the event
    console.log(`[Webhook] ✓ Checkout completed - Guest: ${guestName}, Amount: R$ ${amount}`);
  } catch (error: any) {
    console.error('[Webhook] Error handling checkout.session.completed:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Webhook] Payment intent succeeded: ${paymentIntent.id}`);

  const db = await getDb();
  if (!db) {
    console.error('[Webhook] Database not available');
    return;
  }

  try {
    // Find transaction by payment intent ID
    const existingTx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.stripePaymentIntentId, paymentIntent.id))
      .limit(1);

    if (existingTx.length > 0) {
      // Update transaction status to completed if not already
      if (existingTx[0].status !== 'completed') {
        await db
          .update(transactions)
          .set({
            status: 'completed',
            updatedAt: new Date(),
          })
          .where(eq(transactions.id, existingTx[0].id));

        console.log(`[Webhook] Transaction updated to completed: ${paymentIntent.id}`);
      }
    }

    console.log(`[Webhook] ✓ Payment succeeded - Amount: R$ ${(paymentIntent.amount / 100).toFixed(2)}`);
  } catch (error: any) {
    console.error('[Webhook] Error handling payment_intent.succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Webhook] Payment intent failed: ${paymentIntent.id}`);

  const db = await getDb();
  if (!db) {
    console.error('[Webhook] Database not available');
    return;
  }

  try {
    // Find transaction by payment intent ID
    const existingTx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.stripePaymentIntentId, paymentIntent.id))
      .limit(1);

    if (existingTx.length > 0) {
      // Update transaction status to failed
      await db
        .update(transactions)
        .set({
          status: 'failed',
          updatedAt: new Date(),
        })
        .where(eq(transactions.id, existingTx[0].id));

      console.log(`[Webhook] Transaction marked as failed: ${paymentIntent.id}`);
    }

    console.log(`[Webhook] ✗ Payment failed - Amount: R$ ${(paymentIntent.amount / 100).toFixed(2)}`);
  } catch (error: any) {
    console.error('[Webhook] Error handling payment_intent.payment_failed:', error);
    throw error;
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`[Webhook] Charge refunded: ${charge.id}`);

  const db = await getDb();
  if (!db) {
    console.error('[Webhook] Database not available');
    return;
  }

  try {
    // Find transaction by payment intent ID
    if (charge.payment_intent) {
      const existingTx = await db
        .select()
        .from(transactions)
        .where(eq(transactions.stripePaymentIntentId, charge.payment_intent as string))
        .limit(1);

      if (existingTx.length > 0) {
        // Update transaction status to refunded
        await db
          .update(transactions)
          .set({
            status: 'refunded',
            updatedAt: new Date(),
          })
          .where(eq(transactions.id, existingTx[0].id));

        console.log(`[Webhook] Transaction marked as refunded: ${charge.id}`);
      }
    }

    console.log(`[Webhook] ✓ Charge refunded - Amount: R$ ${(charge.amount / 100).toFixed(2)}`);
  } catch (error: any) {
    console.error('[Webhook] Error handling charge.refunded:', error);
    throw error;
  }
}
