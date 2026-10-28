import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/internal")) {
    const session = request.cookies.get("blake_internal_session")?.value;
    if (!session || session !== process.env.INTERNAL_SESSION_TOKEN) return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/internal/:path*"] };
