import Link from "next/link";
import { Filter, Search, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { CATEGORIES, getProductsByCategory } from "@/lib/catalog";

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const searchQuery = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const products = getProductsByCategory(categorySlug, searchQuery);
  const activeCategory = CATEGORIES.find((c) => c.slug === categorySlug);

  return (
    <div className="bg-[#fffdf6] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-[#e7e5e4] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#a37c6b] mb-1.5 font-medium">
              <span>Lezari Collection</span>
              {activeCategory && <span>/ {activeCategory.name}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1c1917] tracking-wide">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory
                ? activeCategory.name
                : "All Jewellery"}
            </h1>
            <p className="text-xs text-[#78716c] mt-2">
              Showing {products.length} anti-tarnish, 18K gold plated pieces
            </p>
          </div>

          {/* Search Bar on Shop Tab */}
          <form action="/shop" method="GET" className="relative w-full md:w-80">
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search necklaces, earrings, rings..."
              className="w-full bg-white border border-[#e7e5e4] pl-10 pr-4 py-2.5 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#3d2b1f] outline-none shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Categories Sidebar */}
          <div className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white p-5 border border-[#e7e5e4] shadow-xs">
              <div className="flex items-center space-x-2 mb-4 text-xs font-semibold uppercase tracking-widest text-[#3d2b1f] pb-3 border-b border-[#f5f5f4]">
                <Filter className="h-3.5 w-3.5" />
                <span>Categories</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/shop"
                    className={`block py-1.5 px-2 rounded-xs transition-colors ${
                      !categorySlug
                        ? "bg-[#fdf8f6] text-[#3d2b1f] font-semibold"
                        : "text-[#78716c] hover:text-[#1c1917]"
                    }`}
                  >
                    All Jewellery
                  </Link>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className={`flex justify-between items-center py-1.5 px-2 rounded-xs transition-colors ${
                        categorySlug === cat.slug
                          ? "bg-[#fdf8f6] text-[#3d2b1f] font-semibold"
                          : "text-[#78716c] hover:text-[#1c1917]"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#a8a29e]">({cat.itemCount})</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Anti-Tarnish Assurance in Sidebar */}
              <div className="mt-8 pt-5 border-t border-[#f5f5f4] text-[11px] text-[#78716c] space-y-2">
                <div className="flex items-center gap-1.5 font-medium text-[#3d2b1f]">
                  <Sparkles className="w-3.5 h-3.5" /> All Items Are:
                </div>
                <p>• 18K Real Gold PVD Plated</p>
                <p>• Guaranteed Anti-Tarnish</p>
                <p>• 100% Waterproof & Sweatproof</p>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#e7e5e4] p-8">
                <p className="text-sm text-[#78716c] mb-4">No jewellery found matching your search.</p>
                <Link
                  href="/shop"
                  className="btn-primary text-xs uppercase tracking-wider py-2.5 px-6 inline-block"
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
