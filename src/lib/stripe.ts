import Stripe from "stripe";

/**
 * Server-side Stripe SDK singleton.
 *
 * Reuse one instance across requests in dev to avoid HMR re-instantiation.
 * In production each Vercel function gets its own (the global hack only
 * matters during `next dev`).
 *
 * STRIPE_SECRET_KEY: required. Use the test key (sk_test_...) until you're
 * ready to take real money. Set in .env.local for dev, Vercel env for prod.
 */

declare global {
  // eslint-disable-next-line no-var
  var stripe: Stripe | undefined;
}

function buildClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (test mode) or Vercel env (production)."
    );
  }
  return new Stripe(key, {
    // Pin the API version so Stripe rolling upgrades don't surprise us.
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
    appInfo: {
      name: "TechFides",
      version: "2.0",
    },
  });
}

export const stripe: Stripe =
  global.stripe ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  global.stripe = stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
