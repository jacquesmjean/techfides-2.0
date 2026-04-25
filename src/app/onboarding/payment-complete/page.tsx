"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * /onboarding/payment-complete
 *
 * Stripe redirects the customer here after payment confirmation. The query
 * params Stripe attaches:
 *   - payment_intent: pi_xxx
 *   - payment_intent_client_secret: pi_xxx_secret_xxx
 *   - redirect_status: succeeded | requires_payment_method | requires_action
 *
 * The actual onboarding chain (ClientAccount + Project + folder) was already
 * triggered by the webhook on Stripe's side. This page just shows confirmation
 * and gives the customer next steps.
 */

function PaymentCompleteContent() {
  const params = useSearchParams();
  const status = params.get("redirect_status") ?? "unknown";
  const piId = params.get("payment_intent");

  const success = status === "succeeded";

  return (
    <div className="grid-pattern flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
        {success ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10 text-4xl text-accent-green">
              &#10003;
            </div>
            <h1 className="mt-6 text-3xl font-bold">
              Payment <span className="text-accent-green">Confirmed</span>
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Thanks for choosing TechFides. Your engagement is locked in and
              your client folder is being set up automatically. You&apos;ll
              receive a receipt by email and your TechFides contact will reach
              out within one business day to schedule kickoff.
            </p>
            {piId && (
              <p className="mt-4 text-[10px] text-slate-600">
                Reference: {piId}
              </p>
            )}
          </>
        ) : status === "requires_payment_method" ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-4xl text-amber-400">
              !
            </div>
            <h1 className="mt-6 text-3xl font-bold">Payment Not Completed</h1>
            <p className="mt-3 text-sm text-slate-400">
              Your card was declined or the payment failed to complete. Please
              return to the onboarding flow and try again, or use the invoice
              option to pay by wire/check/ACH.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-electric-500/10 text-4xl text-electric-400">
              ...
            </div>
            <h1 className="mt-6 text-3xl font-bold">Processing</h1>
            <p className="mt-3 text-sm text-slate-400">
              Your payment is being processed. This page will update once Stripe
              confirms the transaction. You&apos;ll receive an email receipt
              when it&apos;s complete.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="w-full rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-electric-400 sm:w-auto"
          >
            Return to TechFides
          </Link>
          <a
            href="mailto:support@techfides.com"
            className="w-full rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:text-white sm:w-auto"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <PaymentCompleteContent />
    </Suspense>
  );
}
