export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  category: string;
  categorySlug: string;
  images: string[];
  stock: number;
  available: boolean;
  featured?: boolean;
  new_arrival?: boolean;
  best_seller?: boolean;
  rating?: number;
  reviewCount?: number;
  material?: string;
  plating?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-necklaces",
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    itemCount: 8,
  },
  {
    id: "cat-earrings",
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    itemCount: 10,
  },
  {
    id: "cat-rings",
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    itemCount: 6,
  },
  {
    id: "cat-bracelets",
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591475878-83804868f060?q=80&w=800&auto=format&fit=crop",
    itemCount: 7,
  },
  {
    id: "cat-anklets",
    name: "Anklets",
    slug: "anklets",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    itemCount: 4,
  },
  {
    id: "cat-combos",
    name: "Combos & Sets",
    slug: "combos",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    itemCount: 5,
  },
];

export const HERO_SLIDES = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop",
    title: "18K Gold Plated Collection",
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1920&auto=format&fit=crop",
    title: "Waterproof Everyday Elegance",
  },
  {
    id: "slide-3",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920&auto=format&fit=crop",
    title: "Anti-Tarnish Floral Edit",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "lez-01",
    name: "Nale White Stone Huggies",
    slug: "nale-white-stone-huggies",
    description: "Crafted in surgical-grade stainless steel with 18K thick gold PVD plating. Features a radiant solitaire zirconia crystal that catches light from every angle. 100% waterproof, sweatproof, and hypoallergenic. Wear it in the shower, gym, or poolside without tarnishing.",
    short_description: "18K gold plated hoop earrings with radiant crystal.",
    price: 285,
    original_price: 599,
    discount: 52,
    category: "Earrings",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 45,
    available: true,
    featured: true,
    best_seller: true,
    rating: 4.9,
    reviewCount: 142,
    material: "316L Stainless Steel",
    plating: "18K Gold PVD",
  },
  {
    id: "lez-02",
    name: "Sareine Circle Drop Earrings",
    slug: "sareine-circle-drop-earrings",
    description: "Sleek geometric circles designed for understated luxury. The smooth polished gold finish reflects elegance suitable for everyday desk-to-dinner looks. Completely anti-tarnish and featherlight on your earlobes.",
    short_description: "Minimalist dual circular drop earrings in 18K gold.",
    price: 330,
    original_price: 649,
    discount: 49,
    category: "Earrings",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 38,
    available: true,
    featured: true,
    best_seller: true,
    rating: 4.8,
    reviewCount: 98,
    material: "316L Stainless Steel",
    plating: "18K Yellow Gold",
  },
  {
    id: "lez-03",
    name: "Eira White Crystal Huggies",
    slug: "eira-white-crystal-huggies",
    description: "Petite pave-set huggies that hug your ear gently. Encrusted with brilliant micro-zirconia stones that shimmer endlessly. Waterproof, hypoallergenic, and perfect for multi-piercing stacks.",
    short_description: "Dainty micro-pave hoop huggies.",
    price: 299,
    original_price: 599,
    discount: 50,
    category: "Earrings",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 50,
    available: true,
    featured: true,
    new_arrival: true,
    rating: 4.9,
    reviewCount: 76,
    material: "316L Stainless Steel",
    plating: "18K Gold PVD",
  },
  {
    id: "lez-04",
    name: "Tulip Salene Pendant Necklace",
    slug: "tulip-salene-pendant-necklace",
    description: "An ode to springtime romance. Features a beautifully sculpted 3D tulip pendant suspended on a delicate yet sturdy cable chain. Hypoallergenic, sweatproof, and anti-tarnish.",
    short_description: "Sculpted floral tulip pendant necklace.",
    price: 389,
    original_price: 799,
    discount: 51,
    category: "Necklaces",
    categorySlug: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 30,
    available: true,
    featured: true,
    best_seller: true,
    rating: 5.0,
    reviewCount: 164,
    material: "316L Stainless Steel",
    plating: "18K Gold Plated",
  },
  {
    id: "lez-05",
    name: "Heart Tale Charm Band",
    slug: "heart-tale-charm-band",
    description: "A sleek magnetic clasp band adorned with a high-polish golden heart charm. Designed for effortless one-handed wearing. Stays untarnished and brilliant day in and day out.",
    short_description: "Magnetic wrist band with polished heart charm.",
    price: 349,
    original_price: 699,
    discount: 50,
    category: "Bracelets",
    categorySlug: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1611591475878-83804868f060?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 40,
    available: true,
    featured: true,
    new_arrival: true,
    rating: 4.8,
    reviewCount: 62,
    material: "Stainless Steel + Magnetic Clasp",
    plating: "18K Gold",
  },
  {
    id: "lez-06",
    name: "Pink Tulip Anklet Pair",
    slug: "pink-tulip-anklet-pair",
    description: "Delicate double-chain anklets adorned with hand-painted enamel pink tulip charms and gold beads. Waterproof and beach-proof — wear them in salt water, chlorine, or daily showers without worry.",
    short_description: "Pair of waterproof enamel tulip anklets.",
    price: 360,
    original_price: 699,
    discount: 48,
    category: "Anklets",
    categorySlug: "anklets",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591475878-83804868f060?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 25,
    available: true,
    featured: true,
    best_seller: true,
    rating: 4.9,
    reviewCount: 88,
    material: "316L Stainless Steel",
    plating: "18K Gold Plated",
  },
  {
    id: "lez-07",
    name: "Aura Solitaire Dome Ring",
    slug: "aura-solitaire-dome-ring",
    description: "A bold, modern signet dome ring featuring a flush-set faceted zirconia crystal. The ergonomic interior contour ensures all-day comfort. Tarnish-free and won't turn your finger green.",
    short_description: "Croissant dome ring with solitaire crystal.",
    price: 299,
    original_price: 599,
    discount: 50,
    category: "Rings",
    categorySlug: "rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 60,
    available: true,
    featured: true,
    new_arrival: true,
    rating: 4.9,
    reviewCount: 110,
    material: "316L Stainless Steel",
    plating: "18K Gold PVD",
  },
  {
    id: "lez-08",
    name: "Green Laura Clover Necklace",
    slug: "green-laura-clover-necklace",
    description: "Inspired by timeless good luck charms. Features a double-sided malachite green enamel clover framed in beaded 18K gold. Pairs effortlessly with white shirts and evening silhouettes.",
    short_description: "Four-leaf clover pendant in malachite green.",
    price: 399,
    original_price: 799,
    discount: 50,
    category: "Necklaces",
    categorySlug: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 35,
    available: true,
    featured: true,
    best_seller: true,
    rating: 5.0,
    reviewCount: 195,
    material: "316L Stainless Steel",
    plating: "18K Gold PVD",
  },
  {
    id: "lez-09",
    name: "Single Stone Tennis Bracelet",
    slug: "single-stone-tennis-bracelet",
    description: "An everyday luxury essential. Clean cable chain featuring a bezel-set faceted diamond-cut cubic zirconia. Adjustable slider closure fits all wrist sizes comfortably.",
    short_description: "Adjustable slider bracelet with bezel crystal.",
    price: 320,
    original_price: 649,
    discount: 51,
    category: "Bracelets",
    categorySlug: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1611591475878-83804868f060?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 45,
    available: true,
    new_arrival: true,
    rating: 4.8,
    reviewCount: 54,
    material: "316L Stainless Steel",
    plating: "18K Gold Plated",
  },
  {
    id: "lez-10",
    name: "Pearl Khathara Vintage Studs",
    slug: "pearl-khathara-vintage-studs",
    description: "Baroque aesthetic reimagined. Lustrous organic freshwater pearls nestled inside textured sunburst gold bezels. Perfect heirloom piece for weddings and daily quiet luxury.",
    short_description: "Lustrous pearl studs with sunburst gold rim.",
    price: 310,
    original_price: 599,
    discount: 48,
    category: "Earrings",
    categorySlug: "earrings",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 30,
    available: true,
    new_arrival: true,
    rating: 4.9,
    reviewCount: 73,
    material: "Freshwater Pearl + Stainless Steel",
    plating: "18K Gold",
  },
  {
    id: "lez-11",
    name: "Colette Charm Layered Set",
    slug: "colette-charm-layered-set",
    description: "Complete matching set containing the bestselling Clover Pendant Necklace and matching huggie earrings. Delivered in a signature velvet Lezari gift box with authenticity card.",
    short_description: "Complete 2-piece necklace & earring combo gift set.",
    price: 649,
    original_price: 1399,
    discount: 54,
    category: "Combos & Sets",
    categorySlug: "combos",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 20,
    available: true,
    featured: true,
    best_seller: true,
    rating: 5.0,
    reviewCount: 130,
    material: "316L Stainless Steel",
    plating: "18K Gold PVD",
  },
  {
    id: "lez-12",
    name: "Hena Adjustable Stacking Ring",
    slug: "hena-adjustable-stacking-ring",
    description: "An open cuff ring featuring dual teardrop zirconia stones on opposite ends. Squeeze or expand gently to fit any finger from size 5 to 9. Never oxidizes or tarnishes.",
    short_description: "Open cuff stacking ring with teardrop crystals.",
    price: 279,
    original_price: 549,
    discount: 49,
    category: "Rings",
    categorySlug: "rings",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 55,
    available: true,
    new_arrival: true,
    rating: 4.8,
    reviewCount: 81,
    material: "316L Stainless Steel",
    plating: "18K Gold",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug?: string, searchQuery?: string): Product[] {
  return PRODUCTS.filter((p) => {
    const matchesCat = !categorySlug || categorySlug === "all" || p.categorySlug.toLowerCase() === categorySlug.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
}
