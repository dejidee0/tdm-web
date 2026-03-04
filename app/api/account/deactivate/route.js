// app/api/account/deactivate/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function POST() {
  const res = await fetch(`${BASE}/v1/account/deactivate`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  return NextResponse.json({ success: res.ok }, { status: res.status });
}
