import { faturaEstaFechada } from "@/app/controller/faturaCartaoController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { competencia, cartaoCreditoId } = await req.json();

    const fechada = await faturaEstaFechada(competencia, cartaoCreditoId);

    return NextResponse.json({ fechada }, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar fatura:", error);

    return NextResponse.json(
      { error: "Erro ao verificar fatura" },
      { status: 400 },
    );
  }
}
