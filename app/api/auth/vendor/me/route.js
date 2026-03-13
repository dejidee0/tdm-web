import { getCurrentVendorUser } from "@/lib/actions/vendor-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentVendorUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("💥 [/api/auth/vendor/me] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
