"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAdd = () => {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={handleAdd}
        className={`w-full py-4 uppercase tracking-widest text-sm font-medium transition-colors flex items-center justify-center ${
          added ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-[#3d2b1f] text-white hover:bg-[#5c4437]'
        }`}
      >
        <ShoppingBag className="w-4 h-4 mr-2" /> 
        {added ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
      
      <button 
        onClick={() => {
          addItem({ ...product, quantity: 1 });
          router.push('/checkout');
        }}
        className="w-full border border-[#3d2b1f] text-[#3d2b1f] py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#fdf8f6] transition-colors flex items-center justify-center"
      >
        Buy it Now
      </button>
    </div>
  );
}
