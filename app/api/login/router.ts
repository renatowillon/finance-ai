import { NextRequest, NextResponse } from "next/server";

import { db } from "../../_lib/prisma";
export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.senha !== senha) {
    return NextResponse.json(
      { error: "Credenciais Invalidas" },
      { status: 401 },
    );
  }
  const response = NextResponse.json({
    message: "Login bem-sucessido",
    userId: user.id,
  });

  response.cookies.set("userId", String(user.id), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
