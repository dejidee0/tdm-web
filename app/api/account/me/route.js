// app/api/account/me/route.js
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

export async function GET() {
  const res = await fetch(`${BASE}/account/me`, {
    headers: await getAuthHeaders(),
  });
  // Read body ONCE as text, then parse
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  console.log("GET /api/account/me →", data);
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(request) {
  const body = await request.json();
  const res = await fetch(`${BASE}/account/me`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { success: true }, {
    status: res.status,
  });
}
