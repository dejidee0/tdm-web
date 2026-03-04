// app/api/account/password/otp/request/route.js
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

export async function POST(request) {
  const body = await request.json();
  const res = await fetch(`${BASE}/account/password/otp/request`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { success: true }, {
    status: res.status,
  });
}
