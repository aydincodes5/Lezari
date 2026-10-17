import { notFound } from "next/navigation";
import { getProductBySlug, PRODUCTS } from "@/lib/catalog";
import ProductDetailView from "@/components/product/ProductDetailView";

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  // Lookup in built-in rich catalog
  const product = getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  // Get related products from same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  );

  return (
    <ProductDetailView product={product} relatedProducts={relatedProducts} />
  );
}
