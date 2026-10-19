"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";

interface ReviewItem {
  id: number;
  author: string;
  rating: number;
  title: string | null;
  body: string;
}

export function ReviewsSection({
  reviews,
  productName,
}: {
  reviews: ReviewItem[];
  productName: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return {
      star,
      count,
      pct: reviews.length ? (count / reviews.length) * 100 : 0,
    };
  });

  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-[20rem,1fr] md:gap-16">
        <aside className="md:sticky md:top-32 md:self-start">
          <h2 className="font-serif text-4xl text-ink">Customer reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={avg} size={20} showValue />
            <span className="text-sm text-ink-soft/70">
              Based on {reviews.length} reviews
            </span>
          </div>

          <div className="mt-6 space-y-2">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3 text-xs">
                <span className="w-6 text-stone">{d.star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full bg-rust"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono tabular-nums text-stone">
                  {d.count}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="mt-6 w-full rounded-full border border-ink/15 px-4 py-2.5 text-sm font-medium transition hover:border-ink hover:bg-ink hover:text-bone"
          >
            Write a review
          </button>

          {showForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowForm(false);
              }}
              className="mt-4 space-y-3 rounded-2xl border border-ink/10 bg-bone-warm/50 p-4"
            >
              <p className="text-xs text-ink-soft/70">
                Reviews are read by our team — thank you!
              </p>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-ink/15 bg-[#fbfaf7] px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-ink/15 text-sm hover:border-ink"
                    aria-label={`Rate ${n} stars`}
                  >
                    {n}★
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder={`What did you think of ${productName}?`}
                className="w-full rounded-lg border border-ink/15 bg-[#fbfaf7] px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-ink px-4 py-2 text-sm font-medium text-bone transition hover:bg-moss-deep"
              >
                Submit review
              </button>
            </form>
          )}
        </aside>

        <div>
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/20 bg-bone-warm/40 p-12 text-center text-ink-soft/70">
              No reviews yet. Be the first to share your thoughts.
            </p>
          ) : (
            <ul className="space-y-8">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="border-b border-ink/10 pb-8 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-moss text-bone">
                      <span className="text-sm font-semibold">
                        {r.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{r.author}</p>
                      <p className="text-xs text-stone">Verified customer</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={r.rating} size={13} />
                    </div>
                  </div>
                  {r.title && (
                    <h3 className="mt-3 font-serif text-xl text-ink">
                      {r.title}
                    </h3>
                  )}
                  <p className="mt-2 leading-relaxed text-ink-soft/80">
                    {r.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
