// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/marketplace(.*)",
  "/post-auth(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  ////////////////////////////////////////
  // 1. BYPASS STATIC FILES
  ////////////////////////////////////////
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  ////////////////////////////////////////
  // 2. API ROUTES - Let route handlers handle auth
  ////////////////////////////////////////
  if (pathname.startsWith("/api")) {
    // API routes use requireAdmin() internally
    return NextResponse.next();
  }

  ////////////////////////////////////////
  // 3. NOT SIGNED IN
  ////////////////////////////////////////
  if (!userId) {
    if (!isPublicRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  ////////////////////////////////////////
  // 4. PREVENT AUTH PAGES WHEN SIGNED IN
  ////////////////////////////////////////
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.redirect(new URL("/post-auth", req.url));
  }

  ////////////////////////////////////////
  // 5. ALL OTHER ROUTES - Allow
  // (Admin layout handles role check)
  ////////////////////////////////////////
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};