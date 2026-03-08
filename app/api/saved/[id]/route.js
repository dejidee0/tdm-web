// app/api/saved/[id]/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${BASE_URL}/saved/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
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
