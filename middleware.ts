import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;
  const path = req.nextUrl.pathname;
  const isPublicPath =
    path.startsWith("/login") ||
    path.startsWith("/cadastro") ||
    path.startsWith("/api/login") ||
    path.startsWith("/api/cadastro") ||
    path.startsWith("/api/eu") ||
    path.startsWith("/api/logout") ||
    path.startsWith("/api/send-email") ||
    path.startsWith("/api/pegarCookie");

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const rotasApenasDev = ["/configuracao", "/api/usuarios"];

  if (rotasApenasDev.some((r) => path.startsWith(r))) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);
      const { payload } = await jwtVerify(token!, secret);
      if (payload.plano !== "DEV") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|logo-wfinance.png|web-app-manifest-192x192.png|web-app-manifest-512x512.png).*)",
  ],
};
