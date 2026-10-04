"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton({ className }: { className?: string }) {
  return (
    <button onClick={() => signOut()} className={className}>
      <LogOut className="w-4 h-4 mr-3" />
      Sign Out
    </button>
  );
}
