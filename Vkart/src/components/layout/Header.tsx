"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?collection=weekly-essentials", label: "Essentials" },
  { href: "/shop?collection=pantry-staples", label: "Pantry" },
  { href: "/about", label: "Story" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, open } = useCart();
  const { count: wishlistCount, open: openWishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "border-b border-ink/10 bg-[#fbfaf7]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="overflow-hidden bg-ink text-bone">
        <div className="marquee flex whitespace-nowrap py-2 text-[11px] font-medium uppercase tracking-[0.2em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 px-6">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-clay" /> Free shipping over $60
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-clay" /> Same-day delivery in select cities
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-clay" /> Freshness guaranteed — or your money back
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-clay" /> Subscribe & save 15%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 transition hover:opacity-80"
          aria-label="Vkart home"
        >
          <span className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image
              src="/logo-mark.svg"
              alt="Vkart"
              fill
              sizes="36px"
              priority
              className="object-cover"
            />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-ink">
            V<span className="text-moss">k</span>art
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-stone sm:inline">
            groceries
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/shop"
                ? pathname === "/shop"
                : pathname.startsWith(item.href.split("?")[0]) &&
                  item.href !== "/shop";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-ink text-bone"
                    : "text-ink-soft hover:bg-mist hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            aria-label="Search products"
            className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-mist md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <button
            type="button"
            onClick={openWishlist}
            aria-label={`Open wishlist, ${wishlistCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-mist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 2.5 5 6 5c2 0 3.3 1.2 4 2.2C10.7 6.2 12 5 14 5c3.5 0 5.2 3.3 3.6 6.8C19.5 16.4 12 21 12 21z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-bone">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={open}
            aria-label={`Open cart, ${itemCount} items`}
            className="relative flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-medium transition hover:border-ink hover:bg-ink hover:text-bone"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 7h14l-1.5 11a2 2 0 01-2 1.7H8.5a2 2 0 01-2-1.7L5 7z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 7V5a3 3 0 016 0v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono tabular-nums">
              {itemCount.toString().padStart(2, "0")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
