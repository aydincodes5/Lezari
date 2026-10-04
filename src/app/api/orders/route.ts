import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendOrderConfirmationToAdmin, sendOrderConfirmationToCustomer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { items, shippingAddress } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items in order" }, { status: 400 });
  }

  // Calculate total
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  // Create order in DB
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      status: "PENDING",
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: { product: true }
      },
      user: true,
    }
  });

  // Send emails (non-blocking, don't fail order if email fails)
  const emailData = {
    orderId: order.id,
    customerName: session.user.name || "Customer",
    customerEmail: session.user.email!,
    items: order.items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: order.total,
    shippingAddress,
  };

  Promise.all([
    sendOrderConfirmationToAdmin(emailData).catch(console.error),
    sendOrderConfirmationToCustomer(emailData).catch(console.error),
  ]);

  return NextResponse.json({ success: true, orderId: order.id });
}
