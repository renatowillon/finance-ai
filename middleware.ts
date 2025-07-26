import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("session_token")?.value;
  const path = req.nextUrl.pathname;
  const isPublicPath =
    path.startsWith("/login") ||
    path.startsWith("/cadastro") ||
    path.startsWith("/api/login") ||
    path.startsWith("/api/cadastro") ||
    path.startsWith("/api/me") ||
    path.startsWith("/api/logout");

  if (!userId && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
