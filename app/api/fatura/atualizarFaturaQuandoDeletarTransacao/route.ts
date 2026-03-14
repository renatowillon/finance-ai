import { AtualizarFaturaQuandoDeletarTransacao } from "@/app/controller/faturaCartaoController";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { faturaId } = body;

    await AtualizarFaturaQuandoDeletarTransacao(faturaId);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Não foi possivel atualizar fatura: ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro inesperado" },
      { status: 400 },
    );
  }
}
