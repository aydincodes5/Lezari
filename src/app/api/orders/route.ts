import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationToAdmin, sendOrderConfirmationToCustomer } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);

    const body = await req.json();
    const { items, customer, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const customerName = session?.user?.name || customer?.name || shippingAddress?.fullName || "Valued Customer";
    const customerEmail = session?.user?.email || customer?.email || "customer@lezarijewels.com";

    // Calculate total
    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Optionally try saving to Prisma if DB is configured, but don't let DB failure block order/email
    try {
      if (session?.user?.id) {
        await prisma.order.create({
          data: {
            id: orderId,
            userId: session.user.id,
            total,
            status: "PENDING",
            items: {
              create: items.map((item: { id?: string; name: string; quantity: number; price: number }) => ({
                productId: item.id || "custom-item",
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });
      }
    } catch (dbError) {
      console.warn("Database storage skipped (running in serverless/offline mode):", dbError);
    }

    // Send emails with full order details to Admin and Customer
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
      shippingAddress: shippingAddress ? {
        line1: shippingAddress.line1 || shippingAddress.address || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || shippingAddress.postalCode || "",
        phone: shippingAddress.phone || "",
      } : undefined,
    };

    // Fire emails
    Promise.all([
      sendOrderConfirmationToAdmin(emailData).catch(console.error),
      sendOrderConfirmationToCustomer(emailData).catch(console.error),
    ]);

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error("Order processing error:", error);
    return NextResponse.json({ error: error.message || "Failed to process order" }, { status: 500 });
  }
}
