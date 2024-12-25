import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function middleware(req: NextRequest, evt: any) {
  // Check if it's the root path
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard/default", req.url));
  }

  // For all other paths, use Clerk's middleware
  return clerkMiddleware()(req, evt);
}

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
};