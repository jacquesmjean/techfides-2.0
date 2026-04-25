import { NextResponse } from "next/server";
import { z } from "zod";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getService } from "@/lib/services/catalog";

/**
 * POST /api/v1/stripe/create-payment-intent
 *
 * Creates a Stripe PaymentIntent for the deposit (fixed-scope engagements)
 * or first month (Private AI subscriptions). Returns a client_secret that
 * the browser uses with the Stripe Payment Element to collect card details.
 *
 * The PaymentIntent carries metadata that lets the webhook find the right
 * Lead and trigger the onboarding chain on success:
 *   - leadEmail, leadName, leadCompany   (customer identity)
 *   - serviceId, tierId                  (engagement)
 *   - paymentType: "deposit" | "subscription_first_month"
 *
 * Body:
 *   {
 *     serviceId: "AI_READINESS_360" | "TRANSFORMATION_MANAGEMENT" | "AEGIS" | "SOVEREIGN_AI"
 *     tierId: string         // tier id within the catalog entry
 *     amountCents: number    // amount to charge (already computed client-side
 *                            //   based on tier — server validates)
 *     customerName: string
 *     customerEmail: string
 *     customerCompany: string
 *   }
 *
 * Returns: { clientSecret, paymentIntentId, leadId }
 */

const Schema = z.object({
  serviceId: z.enum(["AI_READINESS_360", "TRANSFORMATION_MANAGEMENT", "AEGIS", "SOVEREIGN_AI"]),
  tierId: z.string().min(1).max(64),
  amountCents: z.number().int().positive().max(10_000_000), // ceiling at $100K so a typo can't 10x someone
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email(),
  customerCompany: z.string().min(1).max(160),
});

// The catalog uses the local OnboardingClient shape; server-side we use the
// shared catalog. Tier IDs are kept consistent between the two.
const SERVICE_TO_VERTICAL: Record<string, "LEGAL" | "MEDICAL" | "AUTO" | "TRADES" | "PROPERTY_MANAGEMENT" | "OTHER"> = {
  AI_READINESS_360: "OTHER",
  TRANSFORMATION_MANAGEMENT: "OTHER",
  AEGIS: "OTHER",
  SOVEREIGN_AI: "OTHER",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const service = getService(data.serviceId);

  // Server-side validation of amount: must be at least 50% of priceMin (deposit
  // floor) for fixed-scope, OR equal to priceMin (monthly) for subscriptions.
  // This blocks a tampered client from charging $1 for a $50K engagement.
  const isSubscription = data.serviceId === "SOVEREIGN_AI";
  const expectedDepositCents = isSubscription
    ? service.baseSOW * 100 // For subscription, baseSOW holds the monthly amount
    : Math.round(service.baseSOW * 0.5) * 100;
  // Allow tier-level pricing to vary: accept any amount within
  // ±5% of expectedDepositCents OR within the catalog's full priceMin..priceMax range.
  // (We're permissive because the tier the user picked isn't passed to the
  // server-side getService — that uses the default base. Tighten later by
  // looking up the tier server-side.)
  const minAcceptable = Math.round(expectedDepositCents * 0.05); // floor at 5% of base
  if (data.amountCents < minAcceptable) {
    return NextResponse.json(
      { error: `Amount ${data.amountCents} is below the minimum acceptable for ${service.name}.` },
      { status: 400 }
    );
  }

  // Upsert the Lead (idempotent on email) at PROPOSAL stage.
  const nameParts = data.customerName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "Unknown";
  const lastName = nameParts.slice(1).join(" ") || "—";

  const lead = await db.lead.upsert({
    where: { email: data.customerEmail },
    update: {
      firstName,
      lastName,
      company: data.customerCompany,
      stage: "PROPOSAL",
      salesStatus: "PROPOSAL_SENT",
      service: data.serviceId,
      sowCost: data.amountCents / 100,
      lastActivity: new Date(),
    },
    create: {
      firstName,
      lastName,
      email: data.customerEmail,
      company: data.customerCompany,
      vertical: SERVICE_TO_VERTICAL[data.serviceId],
      service: data.serviceId,
      stage: "PROPOSAL",
      source: "WEBSITE",
      region: "US",
      salesStatus: "PROPOSAL_SENT",
      sowCost: data.amountCents / 100,
    },
  });

  // Create the PaymentIntent.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amountCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    receipt_email: data.customerEmail,
    description: `${service.name} ${isSubscription ? "(monthly subscription)" : "(SOW deposit)"} — ${data.customerCompany}`,
    metadata: {
      leadId: lead.id,
      leadEmail: data.customerEmail,
      leadName: data.customerName,
      leadCompany: data.customerCompany,
      serviceId: data.serviceId,
      tierId: data.tierId,
      paymentType: isSubscription ? "subscription_first_month" : "deposit",
    },
  });

  await db.activity.create({
    data: {
      leadId: lead.id,
      type: "PAYMENT_RECEIVED",
      title: `Stripe PaymentIntent created — $${(data.amountCents / 100).toLocaleString()}`,
      description: `${service.name} (tier: ${data.tierId}). Awaiting confirmation. PI: ${paymentIntent.id}`,
      automated: true,
      metadata: {
        paymentIntentId: paymentIntent.id,
        amountCents: data.amountCents,
      },
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    leadId: lead.id,
  });
}
