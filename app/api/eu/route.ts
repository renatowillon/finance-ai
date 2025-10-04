import { NextResponse } from "next/server";
import { obterSessao } from "@/app/_lib/session"; // ou ajuste o caminho se necessário

export async function GET() {
  const sessao = await obterSessao();

  if (!sessao) {
    return NextResponse.json({ userId: null });
  }

  return NextResponse.json({
    userId: sessao.userId,
    email: sessao.email,
    name: sessao.name,
    plano: sessao.plano,
    status: sessao.status,
  });
}
