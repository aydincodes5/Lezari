import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasValidDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL || "";
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

let realPrisma: PrismaClient | null = null;

if (hasValidDatabaseUrl()) {
  try {
    realPrisma = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = realPrisma;
    }
  } catch (err) {
    console.warn("Prisma Client connection warning:", err);
  }
}

// Resilient Proxy: prevents runtime and prerender crashes when no database is configured
export const prisma: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (realPrisma && (realPrisma as any)[prop]) {
        return (realPrisma as any)[prop];
      }

      // Safe fallback for model operations
      return new Proxy(
        {},
        {
          get(_modelTarget, method: string) {
            return async (...args: any[]) => {
              if (realPrisma && (realPrisma as any)[prop] && typeof (realPrisma as any)[prop][method] === "function") {
                try {
                  return await (realPrisma as any)[prop][method](...args);
                } catch (e) {
                  console.warn(`Prisma query error on ${prop}.${method}:`, e);
                }
              }

              // Graceful mock responses for offline/storage-free mode
              if (method === "count") return 0;
              if (method === "findMany") return [];
              if (method === "findUnique" || method === "findFirst") return null;
              if (method === "create" || method === "update" || method === "delete") {
                const data = args[0]?.data || {};
                return { id: `id-${Date.now()}`, ...data };
              }
              return null;
            };
          },
        }
      );
    },
  }
);

export default prisma;
