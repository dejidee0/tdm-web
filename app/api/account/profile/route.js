// app/api/account/profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  console.log(token);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let res;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/account/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("[profile proxy] fetch error:", err);
    return NextResponse.json({ error: "Failed to reach API" }, { status: 502 });
  }

  // Read as text first — never assume JSON
  const raw = await res.text();
  console.log(
    "[profile proxy] status:",
    res.status,
    "body:",
    raw.slice(0, 300),
  );

  if (!raw) {
    return NextResponse.json(
      { error: `API returned empty response (${res.status})` },
      { status: res.status || 502 },
    );
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "API returned non-JSON", raw: raw.slice(0, 500) },
      { status: 502 },
    );
  }

  return NextResponse.json(data, { status: res.status });
}
