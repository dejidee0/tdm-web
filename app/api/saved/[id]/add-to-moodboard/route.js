// POST /api/v1/saved/{id}/add-to-moodboard
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const res = await fetch(`${BASE_URL}/saved/${id}/add-to-moodboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return NextResponse.json(json ?? {}, { status: res.status });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
