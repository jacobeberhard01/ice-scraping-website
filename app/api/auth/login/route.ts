import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const configuredUsername = process.env.INTERNAL_USERNAME;
  const configuredPassword = process.env.INTERNAL_PASSWORD;
  const sessionToken = process.env.INTERNAL_SESSION_TOKEN;

  if (!configuredUsername || !configuredPassword || !sessionToken) {
    return NextResponse.json({ error: "Internal login is not configured." }, { status: 503 });
  }

  if (username !== configuredUsername || password !== configuredPassword) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("blake_internal_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
