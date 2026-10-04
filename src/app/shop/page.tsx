import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  
  const where: any = { available: true };
  if (categorySlug) where.category = { slug: categorySlug };
  if (searchQuery) where.name = { contains: searchQuery };

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      category: true,
    },
    orderBy: { created_at: 'desc' }
  });

  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-serif text-[#1c1917] uppercase tracking-widest">
            {searchQuery ? `Search Results` : (categorySlug ? `Shop ${categorySlug}` : 'Shop All')}
          </h1>
          {searchQuery && (
            <p className="text-[#78716c] mt-2">Showing results for "{searchQuery}"</p>
          )}
        </div>

        {/* Search Bar within Shop Page */}
        <form action="/shop" method="GET" className="relative w-full md:w-72">
          <input 
            type="text" 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Search jewellery..." 
            className="w-full border border-[#e7e5e4] pl-10 pr-4 py-2.5 text-sm focus:border-[#3d2b1f] outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-[#78716c] absolute left-4 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <div className="flex items-center space-x-2 mb-6 text-sm font-medium uppercase tracking-widest text-[#3d2b1f] border-b border-[#e7e5e4] pb-4">
            <Filter className="h-4 w-4" />
            <span>Categories</span>
          </div>
          <ul className="space-y-4">
            <li>
              <Link href="/shop" className={`text-sm tracking-wide ${!categorySlug && !searchQuery ? 'text-[#3d2b1f] font-medium' : 'text-[#78716c] hover:text-[#3d2b1f]'} transition-colors`}>
                All Products
              </Link>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <Link href={`/shop?category=${cat.slug}`} className={`text-sm tracking-wide ${categorySlug === cat.slug ? 'text-[#3d2b1f] font-medium' : 'text-[#78716c] hover:text-[#3d2b1f]'} transition-colors`}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-[#fdf8f6] border border-[#eaddd7]">
              <p className="text-[#78716c] mb-6">No products found matching your criteria.</p>
              <Link href="/shop" className="btn-primary inline-block">Clear Filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8">
              {products.map(product => (
                <Link href={`/product/${product.slug}`} key={product.id} className="group cursor-pointer flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f4] mb-4">
                    {product.images[0] ? (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#fdf8f6] text-[#d2bab0]">No Image</div>
                    )}
                    {product.new_arrival && (
                      <div className="absolute top-2 left-2 bg-white px-2 py-1 text-[9px] uppercase tracking-widest font-medium">New</div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-[#a37c6b] transition-colors">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-[#3d2b1f]">₹{product.price.toFixed(2)}</span>
                    {product.original_price && (
                      <span className="text-xs text-[#78716c] line-through">₹{product.original_price.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
