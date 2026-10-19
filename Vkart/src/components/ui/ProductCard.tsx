"use client";

import Link from "next/link";
import Image from "next/image";
import { StarRating } from "@/components/ui/StarRating";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { WishlistButton } from "@/components/ui/WishlistButton";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%23e8edea' width='400' height='500'/%3E%3Ctext x='200' y='260' text-anchor='middle' fill='%23908a80' font-family='sans-serif' font-size='18'%3ENo image%3C/text%3E%3C/svg%3E";

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name: string;
    shortDescription: string | null;
    brand: string | null;
    price: number;
    compareAtPrice: number | null;
    unit: string | null;
    rating: number;
    reviewCount: number;
    images: string[];
    tags: string[];
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = onSale
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;
  const isNew = product.tags?.includes("new");
  const hasBestseller = product.tags?.includes("bestseller");
  const primaryImage = product.images?.[0] || PLACEHOLDER;
  const secondaryImage = product.images?.[1];
  const isDataUrl = primaryImage.startsWith("data:");

  return (
    <article
      className="fade-up group flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-mist"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          unoptimized={isDataUrl}
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && (
            <span className="rounded-full bg-clay px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-bone">
              −{discount}%
            </span>
          )}
          {isNew && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-bone">
              New
            </span>
          )}
          {hasBestseller && !isNew && (
            <span className="rounded-full bg-bone/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">
              Bestseller
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10">
          <WishlistButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: primaryImage,
              unit: product.unit ?? undefined,
            }}
            size="sm"
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: primaryImage,
              unit: product.unit,
            }}
            variant="solid"
            fullWidth
          />
        </div>
      </Link>

      <div className="mt-4 px-1">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="font-serif text-lg text-ink transition hover:text-moss"
          >
            {product.name}
          </Link>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone">
          {product.brand && (
            <span className="uppercase tracking-wider">{product.brand}</span>
          )}
          {product.unit && (
            <>
              <span className="opacity-50">·</span>
              <span>{product.unit}</span>
            </>
          )}
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold tabular-nums text-ink">
              ${product.price.toFixed(2)}
            </span>
            {onSale && (
              <span className="font-mono text-xs tabular-nums text-stone line-through">
                ${product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>
          <StarRating rating={product.rating} size={11} />
        </div>
      </div>
    </article>
  );
}
