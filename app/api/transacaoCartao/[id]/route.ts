import { PegarTransacaoPorCartao } from "@/app/controller/transacaoCartaoController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const cartaoId = params.id;
    if (!cartaoId) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }
    const resposta = await PegarTransacaoPorCartao(cartaoId);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao pegar transações: ", error);
    return NextResponse.json(
      { error: "Erro interno no servidor, ", detalhes: String(error) },
      { status: 500 },
    );
  }
}
