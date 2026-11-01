import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAILS } from "@/lib/auth";
import prisma from "@/lib/prisma";

function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Aggregate customers from both orders and database users
  const orders = getAllOrders();
  const customerMap = new Map<string, any>();

  // Extract customer data from orders
  for (const order of orders) {
    const key = order.customerEmail.toLowerCase();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: order.userId || `cust-${key}`,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.phone || order.shippingAddress?.phone || "Not provided",
        city: order.shippingAddress?.city || "India",
        state: order.shippingAddress?.state || "",
        orderCount: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
        status: "Active",
      });
    } else {
      const existing = customerMap.get(key);
      existing.orderCount += 1;
      existing.totalSpent += order.total;
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
      }
    }
  }

  // Also include registered users from database if any
  try {
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: { id: true, name: true, email: true, phone: true, created_at: true },
    });
    for (const u of users) {
      if (u.email && !customerMap.has(u.email.toLowerCase())) {
        customerMap.set(u.email.toLowerCase(), {
          id: u.id,
          name: u.name || "Customer",
          email: u.email,
          phone: u.phone || "Not provided",
          city: "India",
          state: "",
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: u.created_at || new Date().toISOString(),
          status: "Registered",
        });
      }
    }
  } catch (e) {
    // Database might be in offline mode
  }

  const customerList = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return NextResponse.json(customerList);
}
