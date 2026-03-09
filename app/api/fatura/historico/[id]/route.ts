import { pegarHistoricoPagamentoCartao } from "@/app/controller/faturaCartaoController";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cartaoId = params.id;
    if (!cartaoId) {
      return NextResponse.json(
        { error: "ID do cartao nao informado." },
        { status: 400 },
      );
    }

    const historico = await pegarHistoricoPagamentoCartao(cartaoId);
    return NextResponse.json(historico, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
