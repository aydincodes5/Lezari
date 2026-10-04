"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Panel - Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d2b1f 0%, #5c4437 50%, #a37c6b 100%)' }}
      >
        <div className="text-center px-12 relative z-10">
          <div className="relative h-20 w-20 mx-auto mb-8">
            <Image src="/logo.png" alt="Lezari Jewels" fill style={{ objectFit: 'contain' }} />
          </div>
          <h2 className="text-4xl font-serif text-white mb-4 leading-tight">
            Welcome to<br />Lezari Jewels
          </h2>
          <p className="text-[#d2bab0] text-sm leading-relaxed max-w-xs mx-auto">
            Sign in to track your orders, save your wishlist, and enjoy a personalised shopping experience.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, rgba(61,43,31,0.5), transparent)' }} />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image src="/logo.png" alt="Lezari Jewels" fill style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <span className="font-serif text-xl tracking-widest text-[#3d2b1f] block">LEZARI</span>
                <span className="text-[10px] tracking-[0.25em] text-[#a37c6b] uppercase block">Jewels</span>
              </div>
            </Link>
          </div>

          <h1 className="text-2xl font-serif text-[#1c1917] mb-2">Sign In</h1>
          <p className="text-sm text-[#78716c] mb-8">Access your Lezari Jewels account</p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#e7e5e4] bg-white text-[#1c1917] py-3.5 text-sm font-medium hover:bg-[#f5f5f4] transition-colors mb-4 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-[#a37c6b] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e7e5e4]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-[#78716c]">or</span>
            </div>
          </div>

          {/* Sign Up note */}
          <div className="text-center">
            <p className="text-xs text-[#78716c] mb-4">
              New to Lezari Jewels? Your account is created automatically the first time you sign in with Google.
            </p>
          </div>

          <div className="mt-8 p-4 bg-[#fdf8f6] border border-[#eaddd7]">
            <p className="text-[11px] text-[#78716c] text-center leading-relaxed">
              We use Google Sign-In to keep your account secure. No passwords needed — just one tap to access your wishlist, orders, and more.
            </p>
          </div>

          <p className="text-xs text-center text-[#78716c] mt-6">
            <Link href="/" className="hover:text-[#3d2b1f] transition-colors">← Back to store</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
