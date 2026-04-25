import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { onboardClientFromLead } from "@/lib/sales/onboarding";

/**
 * POST /api/v1/stripe/webhook
 *
 * Stripe webhook endpoint. Verifies the signature using STRIPE_WEBHOOK_SECRET
 * (which Stripe gives you when you create the webhook), then routes events.
 *
 * Events we care about:
 *   - payment_intent.succeeded   → mark deposit/first-month paid, run onboarding
 *   - payment_intent.payment_failed → log + activity entry
 *   - charge.refunded            → log + activity entry (manual ops can reverse onboarding)
 *
 * Setup:
 *   1. Stripe dashboard → Developers → Webhooks → Add endpoint
 *      URL: https://<your-domain>/api/v1/stripe/webhook
 *      Events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
 *   2. Copy the signing secret → STRIPE_WEBHOOK_SECRET in your env
 *   3. For local dev: `stripe listen --forward-to localhost:3001/api/v1/stripe/webhook`
 *
 * IMPORTANT: This route is exempt from middleware auth — Stripe doesn't send
 * auth headers, only signatures. Middleware should already exempt /api/v1/stripe/webhook.
 */

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 500 }
    );
  }

  // Stripe requires the raw body for signature verification.
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Signature verification failed";
    return NextResponse.json({ error: `Webhook signature error: ${msg}` }, { status: 400 });
  }

  // Idempotency: Stripe retries on failure. Don't process the same event twice.
  const existing = await db.auditLog.findFirst({
    where: { action: "stripe_webhook_received", resource: `Stripe/${event.id}` },
  });
  if (existing) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  await db.auditLog.create({
    data: {
      action: "stripe_webhook_received",
      resource: `Stripe/${event.id}`,
      metadata: { type: event.type },
    },
  });

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;

    case "charge.refunded":
      await handleChargeRefunded(event.data.object);
      break;

    default:
      // Unhandled events are ack'd to keep Stripe from retrying forever.
      break;
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent): Promise<void> {
  const meta = pi.metadata ?? {};
  const leadId = meta.leadId;
  const paymentType = meta.paymentType ?? "deposit";

  if (!leadId) {
    // Payment without our metadata — log and move on. Could be a Stripe
    // dashboard test, manual invoice, etc.
    await db.auditLog.create({
      data: {
        action: "stripe_payment_succeeded_no_lead",
        resource: `Stripe/${pi.id}`,
        metadata: { amount: pi.amount, currency: pi.currency },
      },
    });
    return;
  }

  // Activity log
  await db.activity.create({
    data: {
      leadId,
      type: "PAYMENT_RECEIVED",
      title: `Stripe payment confirmed — $${(pi.amount / 100).toLocaleString()}`,
      description: `${paymentType} for ${meta.serviceId ?? "service"} (tier ${meta.tierId ?? "n/a"}). PI: ${pi.id}`,
      automated: true,
      metadata: {
        paymentIntentId: pi.id,
        chargeId: typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id,
        amountCents: pi.amount,
        paymentType,
      },
    },
  });

  // Trigger the full onboarding chain. onboardClientFromLead is idempotent.
  try {
    const result = await onboardClientFromLead(leadId);
    await db.auditLog.create({
      data: {
        action: "stripe_onboarding_triggered",
        resource: `Lead/${leadId}`,
        metadata: {
          paymentIntentId: pi.id,
          clientAccountId: result.clientAccountId,
          projectId: result.projectId,
          folderPath: result.folderPath,
        },
      },
    });
  } catch (e) {
    await db.auditLog.create({
      data: {
        action: "stripe_onboarding_failed",
        resource: `Lead/${leadId}`,
        metadata: {
          paymentIntentId: pi.id,
          error: e instanceof Error ? e.message : "unknown",
        },
      },
    });
    // Don't re-throw — we already collected payment. Manual recovery via
    // POST /api/v1/leads/[id]/onboard.
  }
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent): Promise<void> {
  const meta = pi.metadata ?? {};
  const leadId = meta.leadId;
  if (!leadId) return;

  await db.activity.create({
    data: {
      leadId,
      type: "NOTE",
      title: `Stripe payment failed`,
      description: `${meta.paymentType ?? "payment"} attempt failed. PI: ${pi.id}. Reason: ${pi.last_payment_error?.message ?? "unknown"}`,
      automated: true,
      metadata: {
        paymentIntentId: pi.id,
        errorCode: pi.last_payment_error?.code,
        errorMessage: pi.last_payment_error?.message,
      },
    },
  });
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  // Look up the PaymentIntent to recover our metadata.
  const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!piId) return;

  const pi = await stripe.paymentIntents.retrieve(piId);
  const leadId = pi.metadata?.leadId;
  if (!leadId) return;

  await db.activity.create({
    data: {
      leadId,
      type: "NOTE",
      title: `Stripe refund issued — $${(charge.amount_refunded / 100).toLocaleString()}`,
      description: `Refund on PI ${piId}. Manual review of ClientAccount/Project status may be needed.`,
      automated: true,
      metadata: {
        paymentIntentId: piId,
        chargeId: charge.id,
        amountRefundedCents: charge.amount_refunded,
      },
    },
  });
}
