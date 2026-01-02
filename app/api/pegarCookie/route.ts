import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const sessaoToken = cookieStore.get("session_token")?.value;

  if (!sessaoToken) {
    return NextResponse.json(
      { error: "Cookie não encontrado" },
      { status: 401 },
    );
  }
  return NextResponse.json({ sessaoToken });
}
