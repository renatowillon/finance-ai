import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;

  const isPublicPath =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/cadastro");

  if (!userId && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
