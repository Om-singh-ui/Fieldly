import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/post-auth(.*)",
  "/onboarding(.*)",
  "/farmer(.*)",
  "/landowner(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  /////////////////////////////////////////////////////////////
  // NOT SIGNED IN → redirect
  /////////////////////////////////////////////////////////////

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  /////////////////////////////////////////////////////////////
  // SIGNED IN → allow
  /////////////////////////////////////////////////////////////

  return;
});

export const config = {
  matcher: [
    "/post-auth/:path*",
    "/onboarding/:path*",
    "/farmer/:path*",
    "/landowner/:path*",
    "/dashboard/:path*",
  ],
};