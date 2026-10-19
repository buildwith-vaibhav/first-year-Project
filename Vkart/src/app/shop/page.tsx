import { getAllProducts, getAllCategories } from "@/lib/format";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return <ShopClient products={products} categories={categories} />;
}
