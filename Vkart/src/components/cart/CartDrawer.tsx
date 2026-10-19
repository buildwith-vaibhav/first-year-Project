"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, close, subtotal, itemCount, updateQty, remove } =
    useCart();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const shipping = subtotal > 60 || subtotal === 0 ? 0 : 6.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-bone shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
              Your cart
            </p>
            <h2 className="font-serif text-2xl text-ink">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition hover:bg-ink hover:text-bone"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-mist">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 7h14l-1.5 11a2 2 0 01-2 1.7H8.5a2 2 0 01-2-1.7L5 7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 7V5a3 3 0 016 0v2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-serif text-xl text-ink">Your cart is empty</p>
                <p className="mt-1 text-sm text-ink-soft/70">
                  Add your favourites to get started.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="mt-2 rounded-full border border-ink px-6 py-2 text-sm font-medium transition hover:bg-ink hover:text-bone"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-ink/10 pb-5 last:border-b-0"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-mist">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-ink">{item.name}</p>
                        {item.unit && (
                          <p className="text-xs text-stone">{item.unit}</p>
                        )}
                      </div>
                      <p className="font-mono text-sm font-semibold tabular-nums text-ink">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-white/50 p-1">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink hover:bg-ink hover:text-bone"
                        >
                          −
                        </button>
                        <span className="min-w-[1.25rem] text-center font-mono text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink hover:bg-ink hover:text-bone"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-xs text-stone underline-offset-2 hover:text-rust hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 bg-bone-warm/50 px-6 py-5">
            <dl className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft/70">Subtotal</dt>
                <dd className="font-mono tabular-nums">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft/70">
                  Shipping {shipping === 0 && "(free)"}
                </dt>
                <dd className="font-mono tabular-nums">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft/70">Tax (est.)</dt>
                <dd className="font-mono tabular-nums">${tax.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-ink/10 pt-4">
              <p className="font-serif text-lg text-ink">Total</p>
              <p className="font-serif text-2xl tabular-nums text-ink">
                ${total.toFixed(2)}
              </p>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="mt-5 block w-full rounded-full bg-ink py-4 text-center font-medium text-bone transition hover:bg-moss-deep active:scale-[0.99]"
            >
              Checkout · ${total.toFixed(2)}
            </Link>
            <button
              type="button"
              onClick={close}
              className="mt-2 block w-full text-center text-sm text-ink-soft/70 underline-offset-4 hover:text-ink hover:underline"
            >
              or continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
