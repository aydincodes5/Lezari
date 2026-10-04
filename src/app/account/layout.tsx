import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { User, MapPin, ShoppingBag, Heart, Package } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";
import { redirect } from "next/navigation";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, image: true, role: true }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-10">

        {/* Sidebar */}
        <div className="w-full md:w-60 flex-shrink-0">
          {/* Profile mini card */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#e7e5e4]">
            <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#f5f5f4] border border-[#e7e5e4] flex-shrink-0">
              {dbUser?.image ? (
                <Image src={dbUser.image} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-[#a37c6b]">
                  {dbUser?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[#1c1917] text-sm truncate">{dbUser?.name || "My Account"}</p>
              <p className="text-xs text-[#78716c] truncate">{dbUser?.email}</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1">
            <Link href="/account" className="flex items-center px-4 py-3 text-sm font-medium text-[#1c1917] hover:bg-[#f5f5f4] transition-colors rounded">
              <User className="w-4 h-4 mr-3 text-[#a37c6b]" /> Profile
            </Link>
            <Link href="/account/orders" className="flex items-center px-4 py-3 text-sm font-medium text-[#1c1917] hover:bg-[#f5f5f4] transition-colors rounded">
              <Package className="w-4 h-4 mr-3 text-[#a37c6b]" /> Orders
            </Link>
            <Link href="/account/wishlist" className="flex items-center px-4 py-3 text-sm font-medium text-[#1c1917] hover:bg-[#f5f5f4] transition-colors rounded">
              <Heart className="w-4 h-4 mr-3 text-[#a37c6b]" /> Wishlist
            </Link>
            <Link href="/account/addresses" className="flex items-center px-4 py-3 text-sm font-medium text-[#1c1917] hover:bg-[#f5f5f4] transition-colors rounded">
              <MapPin className="w-4 h-4 mr-3 text-[#a37c6b]" /> Addresses
            </Link>
            <SignOutButton className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left rounded" />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
