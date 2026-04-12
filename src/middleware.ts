import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware: Protect /gse/* routes (UI) and /api/v1/* routes (Velocity Engine API).
 *
 * - /gse/* requires a valid session (redirects to /login)
 * - /api/v1/* accepts EITHER a valid session OR a valid VELOCITY_API_KEY bearer token
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // GSE UI routes — require interactive session
  if (pathname.startsWith("/gse")) {
    if (!req.auth) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Velocity Engine API routes — allow session OR API key
  if (pathname.startsWith("/api/v1")) {
    if (req.auth) return NextResponse.next();

    const authHeader = req.headers.get("authorization");
    const apiKey = process.env.VELOCITY_API_KEY;
    if (apiKey && authHeader === `Bearer ${apiKey}`) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/gse/:path*", "/api/v1/:path*"],
};
