// app/api/assistant/tool-actions/[actionId]/route.js
// GET /api/v1/ai/assistant/tool-actions/{actionId}
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

export async function GET(_request, { params }) {
  const { actionId } = await params;
  const res = await fetch(
    `${BASE}/ai/assistant/tool-actions/${actionId}`,
    { headers: await getAuthHeaders() },
  );
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : {}, { status: res.status });
}
