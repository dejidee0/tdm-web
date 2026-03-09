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

export async function PATCH(request, { params }) {
  const { taskId } = await params;
  const body = await request.json();
  const res = await fetch(`${BASE}/ai/assistant/tasks/${taskId}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { success: true }, {
    status: res.status,
  });
}
