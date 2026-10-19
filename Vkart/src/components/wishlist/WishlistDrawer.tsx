"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e8edea' width='200' height='200'/%3E%3Ctext x='100' y='105' text-anchor='middle' fill='%23908a80' font-family='sans-serif' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

export function WishlistDrawer() {
  const { items, isOpen, close, remove, clear, count } = useWishlist();
  const { add } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Wishlist">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close wishlist"
        onClick={close}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bone shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
              Saved for later
            </p>
            <h2 className="font-serif text-2xl text-ink">
              Wishlist{" "}
              <span className="font-mono text-base text-moss">({count})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-mist"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-soft/70">
              <span className="text-4xl">♡</span>
              <p className="font-serif text-xl text-ink">Your wishlist is empty</p>
              <p className="text-sm">Tap the heart on any product to save it here.</p>
              <button
                type="button"
                onClick={close}
                className="mt-4 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bone hover:bg-moss-deep"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-ink/8 bg-white/60 p-3"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={close}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-mist"
                  >
                    <Image
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={item.image?.startsWith("data:")}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={close}
                      className="truncate font-medium text-ink hover:text-moss"
                    >
                      {item.name}
                    </Link>
                    {item.unit && (
                      <span className="text-xs text-stone">{item.unit}</span>
                    )}
                    <span className="mt-auto font-mono text-sm font-semibold tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-xs text-stone hover:text-rust"
                      aria-label={`Remove ${item.name}`}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        add(
                          {
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            unit: item.unit,
                          },
                          1,
                        );
                        remove(item.id);
                      }}
                      className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-bone hover:bg-moss-deep"
                    >
                      Add to cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-ink/10 px-6 py-4">
            <button
              type="button"
              onClick={clear}
              className="w-full rounded-full border border-ink/15 py-3 text-sm font-medium text-ink hover:border-ink hover:bg-mist"
            >
              Clear wishlist
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
