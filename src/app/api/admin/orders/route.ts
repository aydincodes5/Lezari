import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, updateOrderStatus, deleteOrderRecord, OrderStatus } from "@/lib/orders";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAILS } from "@/lib/auth";

function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json(getAllOrders());
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, trackingNumber, courierPartner } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const updated = updateOrderStatus(
      id,
      status as OrderStatus,
      trackingNumber,
      courierPartner
    );

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    const ok = deleteOrderRecord(id);
    if (!ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}
