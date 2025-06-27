import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ userId: null });
  }

  return NextResponse.json({ userId });
}
