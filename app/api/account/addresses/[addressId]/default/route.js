// app/api/account/addresses/[addressId]/default/route.js
// PUT /account/addresses/{addressId}/default — set an address as the default
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

export async function PUT(_request, { params }) {
  const { addressId } = await params;
  const res = await fetch(`${BASE}/account/addresses/${addressId}/default`, {
    method: "PUT",
    headers: await getAuthHeaders(),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { success: true }, {
    status: res.status,
  });
}
