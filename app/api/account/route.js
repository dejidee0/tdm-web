// app/api/account/route.js
// DELETE /account — permanently delete the authenticated user's account
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/env";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function DELETE() {
  const res = await fetch(`${API_URL}/account`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { success: true }, {
    status: res.status,
  });
}
