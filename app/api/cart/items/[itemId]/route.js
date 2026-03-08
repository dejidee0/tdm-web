// app/api/v1/Cart/items/[itemId]/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function authHeader() {
  const store = await cookies();
  const token = store.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUT /api/v1/Cart/items/{itemId}  { quantity }
export async function PUT(req, { params }) {
  try {
    const { itemId } = await params;
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/Cart/items/${itemId}`, {
      method: "PUT",
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

// DELETE /api/v1/Cart/items/{itemId}
export async function DELETE(_req, { params }) {
  try {
    const { itemId } = await params;
    const res = await fetch(`${BASE_URL}/Cart/items/${itemId}`, {
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
