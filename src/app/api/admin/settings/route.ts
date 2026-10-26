import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/siteSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAILS = ["aydincodes5@gmail.com", "shaheen97@gmail.com", "ashiqaat@gmail.com"];

function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const updated = updateSettings(body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
