import { NextRequest, NextResponse } from "next/server";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/catalog";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_EMAILS } from "@/lib/auth";

function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const product = addProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { id, ...patch } = body;
    const updated = updateProduct(id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const { id } = await req.json();
    const ok = deleteProduct(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
