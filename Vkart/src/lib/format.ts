import { db } from "@/db";
import {
  categories,
  products,
  type Category,
  type Product,
} from "@/db/schema";
import { sql, asc } from "drizzle-orm";

export type ProductDTO = Omit<Product, "price" | "compareAtPrice" | "rating"> & {
  price: number;
  compareAtPrice: number | null;
  rating: number;
  images: string[];
  tags: string[];
};

function toNumber(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export function productToDTO(row: Product): ProductDTO {
  return {
    ...row,
    price: toNumber(row.price as unknown as string),
    compareAtPrice: row.compareAtPrice
      ? toNumber(row.compareAtPrice as unknown as string)
      : null,
    rating: toNumber(row.rating as unknown as string),
    images: Array.isArray(row.images) ? row.images : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export async function getAllCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  const rows = await db.select().from(products).orderBy(asc(products.name));
  return rows.map(productToDTO);
}

export async function getFeaturedProducts(): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(sql`${products.featured} = true`);
  return rows.map(productToDTO);
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: ProductDTO; category: Category | null } | null> {
  const rows = await db
    .select()
    .from(products)
    .where(sql`${products.slug} = ${slug}`)
    .limit(1);
  if (!rows.length) return null;
  const product = productToDTO(rows[0]);
  let category: Category | null = null;
  if (rows[0].categoryId) {
    const cats = await db
      .select()
      .from(categories)
      .where(sql`${categories.id} = ${rows[0].categoryId}`)
      .limit(1);
    category = cats[0] ?? null;
  }
  return { product, category };
}

export async function getReviewsForProduct(productId: number) {
  const { reviews } = await import("@/db/schema");
  return db
    .select()
    .from(reviews)
    .where(sql`${reviews.productId} = ${productId}`)
    .orderBy(sql`${reviews.createdAt} desc`);
}

export async function getRelatedProducts(
  productId: number,
  categoryId: number | null,
  limit = 4,
): Promise<ProductDTO[]> {
  if (!categoryId) return [];
  const rows = await db
    .select()
    .from(products)
    .where(
      sql`${products.categoryId} = ${categoryId} AND ${products.id} != ${productId}`,
    )
    .limit(limit);
  return rows.map(productToDTO);
}
