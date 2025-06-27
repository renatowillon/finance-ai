import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout Realizado" });
  response.cookies.set("userId", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
