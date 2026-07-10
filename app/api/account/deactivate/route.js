// app/api/account/deactivate/route.js
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

export async function POST() {
  const res = await fetch(`${API_URL}/account/deactivate`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  return NextResponse.json({ success: res.ok }, { status: res.status });
}
