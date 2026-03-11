import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  ////////////////////////////////////////
  // NOT SIGNED IN
  ////////////////////////////////////////

  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  ////////////////////////////////////////
  // SIGNED IN
  ////////////////////////////////////////

  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: {
          role: true,
          isOnboarded: true,
        },
      });

      ////////////////////////////////////
      // USER NOT IN DB → post-auth
      ////////////////////////////////////

      if (!user && !pathname.startsWith("/post-auth")) {
        return NextResponse.redirect(new URL("/post-auth", req.url));
      }

      ////////////////////////////////////
      // ROLE NOT CHOSEN
      ////////////////////////////////////

      if (user && !user.role) {
        if (!pathname.startsWith("/onboarding/role")) {
          return NextResponse.redirect(
            new URL("/onboarding/role", req.url)
          );
        }
      }

      ////////////////////////////////////
      // ONBOARDING NOT COMPLETE
      ////////////////////////////////////

      if (user?.role && !user.isOnboarded) {
        const onboardingPath =
          user.role === "FARMER"
            ? "/onboarding/farmer"
            : "/onboarding/landowner";

        if (!pathname.startsWith(onboardingPath)) {
          return NextResponse.redirect(
            new URL(onboardingPath, req.url)
          );
        }
      }

      ////////////////////////////////////
      // FULLY ONBOARDED → BLOCK ROLE PAGE
      ////////////////////////////////////

      if (user?.role && user.isOnboarded) {
        const dashboard =
          user.role === "FARMER"
            ? "/farmer/dashboard"
            : "/landowner/dashboard";

        if (pathname.startsWith("/onboarding")) {
          return NextResponse.redirect(new URL(dashboard, req.url));
        }
      }
    } catch (e) {
      console.error("Middleware DB error:", e);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};