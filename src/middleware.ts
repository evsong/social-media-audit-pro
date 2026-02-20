import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token") ?? request.cookies.get("__Secure-authjs.session-token");
  if (!token) {
    const signIn = new URL("/auth/signin", request.url);
    signIn.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
