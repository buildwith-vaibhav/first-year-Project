"use client";

import { useWishlist, type WishlistItem } from "@/components/wishlist/WishlistProvider";

interface Props {
  product: WishlistItem;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ product, className = "", size = "md" }: Props) {
  const { has, toggleItem } = useWishlist();
  const saved = has(product.id);

  const dim = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
      }}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={saved}
      className={`${dim} flex items-center justify-center rounded-full border border-ink/10 bg-bone/90 text-ink shadow-sm backdrop-blur transition hover:border-ink/30 hover:bg-white ${className}`}
    >
      <svg
        width={size === "sm" ? 16 : 18}
        height={size === "sm" ? 16 : 18}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        className={saved ? "text-clay" : "text-ink"}
      >
        <path
          d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 2.5 5 6 5c2 0 3.3 1.2 4 2.2C10.7 6.2 12 5 14 5c3.5 0 5.2 3.3 3.6 6.8C19.5 16.4 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
