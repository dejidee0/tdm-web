// app/api/v1/cart/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function authHeader() {
  const store = await cookies();
  const token = store.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET /api/v1/cart
export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
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

// DELETE /api/v1/cart  (clear cart)
export async function DELETE() {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
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
