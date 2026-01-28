import { AdicionarTransacaoCartao } from "@/app/controller/transacaoCartaoController";
import { TypeTransacaoCartao } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const transacaoCartao: TypeTransacaoCartao = await req.json();

  try {
    if (!transacaoCartao.cartaoCreditoId) {
      return NextResponse.json(
        { error: "ID do cartão de crédito não preenchido" },
        { status: 400 },
      );
    }
    if (!transacaoCartao.valor) {
      return NextResponse.json({ error: "Preencha o valor" }, { status: 400 });
    }
    const criarTransacaoCartao =
      await AdicionarTransacaoCartao(transacaoCartao);
    return NextResponse.json(criarTransacaoCartao, { status: 201 });
  } catch (error) {
    console.log("Erro ao criar transação de cartão: ", error);
    return NextResponse.json(
      { error: "erro ao criar transação de cartão" },
      { status: 500 },
    );
  }
}
