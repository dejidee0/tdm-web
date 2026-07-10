// app/api/v1/cart/items/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

async function authHeader() {
  const store = await cookies();
  const token = store.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// POST /api/v1/cart/items  { productId, quantity }
export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return NextResponse.json(json ?? {}, { status: res.status });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
