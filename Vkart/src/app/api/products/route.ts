import { NextResponse } from "next/server";
import {
  getAllProducts,
  getAllCategories,
  getFeaturedProducts,
} from "@/lib/format";

export async function GET() {
  const [products, categories, featured] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getFeaturedProducts(),
  ]);
  return NextResponse.json({
    products: products.length,
    categories: categories.length,
    featured: featured.length,
    status: "ok",
  });
}
