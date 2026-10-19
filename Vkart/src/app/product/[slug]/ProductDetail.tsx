import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/format";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewsSection } from "@/components/ui/ReviewsSection";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();

  const { product, category } = data;
  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product.id, category?.id ?? null, 4),
  ]);

  const onSale =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const discount = onSale
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="bg-[#fbfaf7]">
      <div className="container-page pt-6 text-xs text-stone">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/shop?category=${category.slug}`}
              className="hover:text-ink"
            >
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </div>

      <section className="container-page grid gap-10 py-10 md:grid-cols-2 md:gap-16 md:py-14 lg:gap-20">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {onSale && (
              <span className="rounded-full bg-clay px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-bone">
                Sale · {discount}% off
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-bone-warm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
                Bestseller
              </span>
            )}
            {product.stock < 30 && (
              <span className="rounded-full bg-rust/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rust">
                Only {product.stock} left
              </span>
            )}
          </div>

          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            {product.brand && (
              <span className="rounded-full bg-mist px-3 py-1 text-xs uppercase tracking-wider text-ink-soft">
                {product.brand}
              </span>
            )}
            {product.unit && (
              <span className="text-ink-soft/70">{product.unit}</span>
            )}
            <span className="ml-2">
              <StarRating rating={product.rating} size={13} showValue totalReviews={product.reviewCount} />
            </span>
          </div>

          {product.shortDescription && (
            <p className="mt-6 text-lg leading-relaxed text-ink-soft/85">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6 flex items-baseline gap-3 border-y border-ink/10 py-6">
            <p className="font-serif text-4xl text-ink">
              <span className="font-mono text-3xl tabular-nums">
                ${product.price.toFixed(2)}
              </span>
            </p>
            {onSale && (
              <span className="font-mono text-base tabular-nums text-stone line-through">
                ${product.compareAtPrice!.toFixed(2)}
              </span>
            )}
            <span className="ml-auto text-xs text-ink-soft/70">
              {product.stock > 0 ? "In stock" : "Back soon"} · ships in 1-2 days
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border border-ink/15 px-2 py-1.5">
              <span className="px-3 text-xs uppercase tracking-wider text-stone">
                Qty
              </span>
              <span className="font-mono tabular-nums">1</span>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "",
                unit: product.unit,
              }}
              variant="solid"
              fullWidth
            />
            <WishlistButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "",
                unit: product.unit ?? undefined,
              }}
            />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 text-xs text-ink-soft/70 sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-moss text-bone">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Freshness guaranteed
            </li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-moss text-bone">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h13l-3-3M21 12H8l3 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Free returns
            </li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-moss text-bone">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
              </span>
              Secure checkout
            </li>
          </ul>

          {product.description && (
            <div className="mt-10">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
                About this product
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft/85">
                {product.description}
              </p>
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
                Tags
              </span>
              {product.tags.map((t) => (
                <span key={t} className="rounded-full bg-bone-warm px-3 py-1 text-xs text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page">
        <div className="overflow-hidden rounded-3xl bg-moss text-bone">
          <div className="grid items-center gap-8 p-10 md:grid-cols-2 md:p-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={product.images[1] || product.images[0]}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-90"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay-soft">
                Save on subscription
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
                Subscribe & save 15% on every order.
              </h3>
              <p className="mt-3 text-bone/80">
                Delivery that fits your schedule — weekly, biweekly, or monthly.
                Pause or skip anytime.
              </p>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink transition hover:bg-sand"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} productName={product.name} />

      {related.length > 0 && (
        <section className="container-page pb-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
                You might also like
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                More from {category?.name ?? "this aisle"}
              </h2>
            </div>
            <Link
              href={`/shop?category=${category?.slug ?? ""}`}
              className="hidden text-sm font-medium text-ink underline-offset-4 hover:underline sm:inline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
