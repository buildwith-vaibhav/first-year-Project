"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

interface Props {
  product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    image: string;
    unit?: string | null;
  };
  variant?: "solid" | "outline" | "compact";
  qty?: number;
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  variant = "solid",
  qty = 1,
  fullWidth = false,
}: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const onClick = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        unit: product.unit ?? undefined,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-[0.98]";
  const styles =
    variant === "solid"
      ? "bg-ink text-bone hover:bg-moss-deep px-7 py-3.5"
      : variant === "outline"
      ? "border border-ink text-ink hover:bg-ink hover:text-bone px-7 py-3.5"
      : "bg-ink text-bone hover:bg-moss-deep px-4 py-2 text-xs";
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles} ${width}`}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Added!</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Add to cart</span>
        </>
      )}
    </button>
  );
}
