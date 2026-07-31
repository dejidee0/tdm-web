// app/api/account/security/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/env";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET() {
  const res = await fetch(`${API_URL}/account/security`, {
    headers: await getAuthHeaders(),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : {}, {
    status: res.status,
  });
}
