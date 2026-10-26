import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, updateReview, deleteReview } from "@/lib/reviews";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAILS = ["aydincodes5@gmail.com", "shaheen97@gmail.com", "ashiqaat@gmail.com"];

function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

export async function GET() {
  return NextResponse.json(getReviews());
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const review = addReview(body);
    return NextResponse.json(review, { status: 201 });
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
    const updated = updateReview(Number(id), patch);
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
    const ok = deleteReview(Number(id));
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
