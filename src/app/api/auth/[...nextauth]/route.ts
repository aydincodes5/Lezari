import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Check if user is admin
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
        
        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          session.user.role = "ADMIN";
          
          // Update DB if not already admin
          if (user.role !== "ADMIN") {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "ADMIN" }
            });
          }
        } else {
          session.user.role = "CUSTOMER";
          
          // Demote from admin if removed from env
          if (user.role === "ADMIN") {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "CUSTOMER" }
            });
          }
        }
      }
      return session
    },
  },
  session: {
    strategy: "database", // Since we use adapter, default is database
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
