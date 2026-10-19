import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-24 text-center">
      <div className="max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
          404
        </p>
        <h1 className="mt-2 font-serif text-6xl text-ink">Not here.</h1>
        <p className="mt-4 text-ink-soft/70">
          We couldn't find that page. It may have moved, or the link is wrong.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-bone transition hover:bg-moss-deep"
          >
            Back home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium transition hover:border-ink"
          >
            Browse shop
          </Link>
        </div>
      </div>
    </div>
  );
}
