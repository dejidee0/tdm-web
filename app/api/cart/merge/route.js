// app/api/v1/cart/merge/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function authHeader() {
  const store = await cookies();
  const token = store.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// POST /api/v1/cart/merge  { items: [{ productId, quantity }] }
export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/cart/merge`, {
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
