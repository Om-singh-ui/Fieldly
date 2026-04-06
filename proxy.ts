import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  ////////////////////////////////////////
  // 1. BYPASS STATIC + API
  ////////////////////////////////////////
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  ////////////////////////////////////////
  // 2. NOT SIGNED IN
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
  // 3. SIGNED IN (NO DB HERE )
  ////////////////////////////////////////

  // Prevent accessing auth pages again
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.redirect(new URL("/post-auth", req.url));
  }

  // Let onboarding + post-auth + dashboards handle logic via layouts
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};