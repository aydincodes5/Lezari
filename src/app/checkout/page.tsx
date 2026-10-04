"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif mb-6">Sign In Required</h1>
        <p className="text-muted-foreground mb-8">Please sign in to your Google account to proceed with checkout securely.</p>
        <Link href="/api/auth/signin" className="btn-primary w-full block">
          Sign In to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8 text-primary-900">
          <Lock className="w-5 h-5 mr-2" />
          <h1 className="text-xl uppercase tracking-widest font-medium">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 border border-border">
            <h2 className="font-medium uppercase tracking-widest text-sm mb-6 pb-2 border-b border-border">Shipping Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="input-field" defaultValue={session.user?.name?.split(' ')[0] || ''} />
                <input type="text" placeholder="Last Name" className="input-field" defaultValue={session.user?.name?.split(' ').slice(1).join(' ') || ''} />
              </div>
              <input type="email" placeholder="Email Address" className="input-field" defaultValue={session.user?.email || ''} readOnly />
              <input type="text" placeholder="Phone Number" className="input-field" />
              <input type="text" placeholder="Address" className="input-field" />
              <input type="text" placeholder="City" className="input-field" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="State/Province" className="input-field" />
                <input type="text" placeholder="Postal Code" className="input-field" />
              </div>
            </form>
            
            <h2 className="font-medium uppercase tracking-widest text-sm mb-6 mt-10 pb-2 border-b border-border">Payment Method</h2>
            <div className="p-4 border border-border bg-muted/20 text-center text-sm text-muted-foreground">
              <p>Payment Gateway Integration Pending.</p>
              <p className="mt-2 text-xs">For this prototype, clicking "Place Order" will simulate a successful transaction.</p>
            </div>
            
            <button className="w-full btn-primary mt-8">
              Place Order
            </button>
          </div>

          <div className="bg-primary-50 p-6 h-fit border border-primary-100">
            <h2 className="font-medium uppercase tracking-widest text-sm mb-6 pb-2 border-b border-primary-200">Order Summary</h2>
            <div className="text-sm text-muted-foreground mb-4">
              No items in cart for checkout simulation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
