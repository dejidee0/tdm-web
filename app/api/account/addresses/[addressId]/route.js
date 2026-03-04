// app/api/account/addresses/[addressId]/route.js
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

export async function PUT(request, { params }) {
  const { addressId } = await params;
  const body = await request.json();
  const res = await fetch(`${BASE}/v1/account/addresses/${addressId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { success: true }, {
    status: res.status,
  });
}

export async function DELETE(request, { params }) {
  const { addressId } = await params;
  const res = await fetch(`${BASE}/v1/account/addresses/${addressId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  return NextResponse.json({ success: res.ok }, { status: res.status });
}
