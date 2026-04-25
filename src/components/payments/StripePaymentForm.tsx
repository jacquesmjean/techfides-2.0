"use client";

import { useEffect, useState } from "react";
import { loadStripe, type Stripe as StripeJS } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/**
 * StripePaymentForm
 *
 * Drops Stripe's Payment Element into the existing onboarding flow's
 * Payment step. The flow:
 *   1. Mount → POST /api/v1/stripe/create-payment-intent → get clientSecret
 *   2. Render Elements with clientSecret
 *   3. User fills card details
 *   4. Submit → stripe.confirmPayment() → redirects to return_url on success
 *
 * On Stripe's side, the webhook (POST /api/v1/stripe/webhook) handles the
 * actual onboarding chain trigger — this component just collects the card.
 *
 * Required env: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_... or pk_live_...)
 */

interface Props {
  serviceId: string;
  tierId: string;
  amountCents: number;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  /** Where the customer lands after a successful payment */
  returnUrl: string;
  /** Called when the PaymentIntent successfully creates (before card submit) */
  onIntentCreated?: (paymentIntentId: string, leadId: string) => void;
  /** Called when payment confirmation succeeds (rare — usually redirects first) */
  onSuccess?: () => void;
  /** Called when something fails (network, validation, declined card) */
  onError?: (message: string) => void;
}

let stripePromise: Promise<StripeJS | null> | null = null;
function getStripeJS(): Promise<StripeJS | null> {
  if (stripePromise) return stripePromise;
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!pk) {
    return Promise.resolve(null);
  }
  stripePromise = loadStripe(pk);
  return stripePromise;
}

export function StripePaymentForm(props: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: props.serviceId,
            tierId: props.tierId,
            amountCents: props.amountCents,
            customerName: props.customerName,
            customerEmail: props.customerEmail,
            customerCompany: props.customerCompany,
          }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (cancelled) return;
        setClientSecret(data.clientSecret);
        props.onIntentCreated?.(data.paymentIntentId, data.leadId);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to start payment";
        setError(msg);
        props.onError?.(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    props.serviceId,
    props.tierId,
    props.amountCents,
    props.customerEmail,
    // intentionally exclude callbacks to avoid infinite loops
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        Payment setup failed: {error}
      </div>
    );
  }
  if (!clientSecret) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-center text-sm text-slate-400">
        Preparing secure payment...
      </div>
    );
  }

  return (
    <Elements
      stripe={getStripeJS()}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#0ea5e9",
            colorBackground: "#0f172a",
            colorText: "#e2e8f0",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, -apple-system, sans-serif",
            borderRadius: "8px",
          },
        },
      }}
    >
      <CheckoutForm
        returnUrl={props.returnUrl}
        onSuccess={props.onSuccess}
        onError={props.onError}
      />
    </Elements>
  );
}

function CheckoutForm({
  returnUrl,
  onSuccess,
  onError,
}: {
  returnUrl: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMsg(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (result.error) {
      const msg = result.error.message ?? "Payment failed";
      setErrorMsg(msg);
      onError?.(msg);
      setSubmitting(false);
      return;
    }

    // Either redirected (3DS challenge etc.) or confirmed inline.
    onSuccess?.();
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMsg && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {errorMsg}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className={`w-full rounded-lg py-3 text-sm font-semibold transition-all ${
          !stripe || submitting
            ? "cursor-not-allowed bg-slate-800 text-slate-500"
            : "bg-electric-500 text-white hover:bg-electric-400 active:scale-[0.98]"
        }`}
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
