import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationToAdmin, sendOrderConfirmationToCustomer } from "@/lib/email";
import { createOrderRecord, getOrdersByUser, getAllOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    if (isAdmin) {
      return NextResponse.json(getAllOrders());
    }

    const userOrders = getOrdersByUser(session.user.id, session.user.email);
    return NextResponse.json(userOrders);
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);

    const body = await req.json();
    const { items, customer, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const customerName =
      session?.user?.name || customer?.name || shippingAddress?.fullName || "Valued Customer";
    const customerEmail =
      session?.user?.email || customer?.email || "customer@lezarijewels.com";
    const phone = shippingAddress?.phone || "";

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // Normalize shipping address
    const normalizedAddress = {
      fullName: customerName,
      phone,
      line1: shippingAddress?.line1 || shippingAddress?.address || "",
      line2: shippingAddress?.line2 || "",
      city: shippingAddress?.city || "",
      state: shippingAddress?.state || "",
      pincode: shippingAddress?.pincode || shippingAddress?.postalCode || "",
    };

    // 1. Save in robust in-memory order store (always accessible)
    createOrderRecord({
      id: orderId,
      userId: session?.user?.id || null,
      customerName,
      customerEmail,
      phone,
      total,
      paymentMethod: "Cash on Delivery",
      items: items.map((i: any) => ({
        id: i.id,
        productId: i.id || i.slug,
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        image: i.image || "",
      })),
      shippingAddress: normalizedAddress,
    });

    // 2. Optionally try saving to Prisma if DB is configured
    try {
      if (session?.user?.id) {
        await prisma.order.create({
          data: {
            id: orderId,
            userId: session.user.id,
            total,
            status: "PENDING",
            items: {
              create: items.map(
                (item: { id?: string; name: string; quantity: number; price: number }) => ({
                  productId: item.id || "custom-item",
                  quantity: item.quantity,
                  price: item.price,
                })
              ),
            },
          },
        });
      }
    } catch (dbError) {
      console.warn("Database storage skipped (running in serverless/offline mode):", dbError);
    }

    // 3. Send email notifications
    const emailData = {
      orderId,
      customerName,
      customerEmail,
      items: items.map((i: { name: string; quantity: number; price: number }) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      total,
      shippingAddress: normalizedAddress,
    };

    Promise.all([
      sendOrderConfirmationToAdmin(emailData).catch(console.error),
      sendOrderConfirmationToCustomer(emailData).catch(console.error),
    ]);

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
