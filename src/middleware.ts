import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware: Protect /gse/* routes (UI) and /api/v1/* routes (Velocity Engine API).
 *
 * Lightweight version that uses API key auth only (no Prisma/NextAuth import
 * to keep edge function under 1MB Vercel free-tier limit).
 *
 * - /gse/* redirects to /login if no session cookie present
 * - /api/v1/* accepts a valid VELOCITY_API_KEY bearer token or session cookie
 * - All public marketing routes pass through
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // GSE UI routes — check for session cookie (lightweight, no Prisma)
  if (pathname.startsWith("/gse")) {
    const sessionToken =
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Velocity Engine API routes — allow session cookie OR API key
  if (pathname.startsWith("/api/v1")) {
    const sessionToken =
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value;

    if (sessionToken) return NextResponse.next();

    const authHeader = req.headers.get("authorization");
    const apiKey = process.env.VELOCITY_API_KEY;
    if (apiKey && authHeader === `Bearer ${apiKey}`) {
      return NextResponse.next();
    }

    // Allow form submissions without auth (contact, partner, careers forms)
    if (pathname === "/api/v1/forms/submit") {
      return NextResponse.next();
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/gse/:path*", "/api/v1/:path*"],
};
