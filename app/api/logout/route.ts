import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout realizado com sucesso",
  });

  // Expira os cookies
  response.cookies.set("session_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("userId", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
