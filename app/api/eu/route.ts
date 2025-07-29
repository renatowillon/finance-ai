import { NextResponse } from "next/server";
import { getSession } from "@/app/_lib/session"; // ou ajuste o caminho se necessário

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ userId: null });
  }

  return NextResponse.json({
    userId: session.userId,
    email: session.email,
    subscriptionPlan: session.subscriptionPlan,
  });
}
