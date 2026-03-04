// app/api/account/profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value;
}

export async function GET() {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
    .then((r) => r.text())
    .catch(() => null);

  if (!raw)
    return NextResponse.json({ error: "API unreachable" }, { status: 502 });

  try {
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from API", raw: raw.slice(0, 300) },
      { status: 502 },
    );
  }
}
