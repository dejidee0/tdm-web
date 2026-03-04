// app/api/account/avatar/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Forward the multipart/form-data as-is
  const formData = await request.formData();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/avatar`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type — fetch sets it automatically with boundary for multipart
      },
      body: formData,
    },
  );

  const raw = await res.text();
  try {
    return NextResponse.json(JSON.parse(raw), { status: res.status });
  } catch {
    return NextResponse.json({ success: res.ok }, { status: res.status });
  }
}
