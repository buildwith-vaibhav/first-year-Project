"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "VK-PENDING";
  const total = params.get("total") ?? "0.00";

  return (
    <div className="fade-in container-page py-20 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-moss text-bone">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
          Order confirmed
        </p>
        <h1 className="mt-2 font-serif text-5xl tracking-tight text-ink sm:text-6xl">
          Thank you.
        </h1>
        <p className="mt-4 text-lg text-ink-soft/80">
          Your order is being prepped. We've sent a confirmation to your inbox.
        </p>

        <div className="mt-10 inline-flex flex-col items-center gap-2 rounded-2xl bg-bone-warm/60 px-10 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone">
            Order number
          </p>
          <p className="font-mono text-3xl font-bold tabular-nums text-ink">{ref}</p>
          <p className="mt-2 text-sm text-ink-soft/70">
            Total charged:{" "}
            <span className="font-mono font-semibold tabular-nums text-ink">
              ${total}
            </span>
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-bone transition hover:bg-moss-deep"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium transition hover:border-ink"
          >
            Back home
          </Link>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <Promise
            icon="🚚"
            title="On its way"
            body="Tracking info will land in your inbox shortly."
          />
          <Promise
            icon="📦"
            title="Packed with care"
            body="Hand-packed at our fulfilment centre."
          />
          <Promise
            icon="💬"
            title="Need anything?"
            body="Our team is here 24/7 — just reply to your confirmation."
          />
        </div>
      </div>
    </div>
  );
}

function Promise({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-bone-warm/40 p-5 text-left">
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-3 font-serif text-lg text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-soft/70">{body}</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-24 text-center text-ink-soft/60">
          Loading…
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
