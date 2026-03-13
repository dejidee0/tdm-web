import { getCurrentAdminUser } from "@/lib/actions/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentAdminUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("💥 [/api/auth/admin/me] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
