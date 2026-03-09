import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://tbmbuild-001-site1.jtempurl.com";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET() {
  const res = await fetch(`${BASE}/ai/assistant/sessions`, {
    headers: await getAuthHeaders(),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : [], {
    status: res.status,
  });
}
