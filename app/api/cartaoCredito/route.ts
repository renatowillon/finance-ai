import { criarCartao, pegarCartao } from "@/app/controller/cartaoController";
import { TypeCartaoCreditoInput } from "@/app/types";
import { NextResponse } from "next/server";

export async function GET() {
  const cartaoCredito = await pegarCartao();
  return NextResponse.json(cartaoCredito);
}

export async function POST(req: Request) {
  const cartaoParaCadatrar: TypeCartaoCreditoInput = await req.json();

  if (!cartaoParaCadatrar)
    return NextResponse.json({ error: "Dados Invalidos" });

  try {
    if (!cartaoParaCadatrar.userId)
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 400 },
      );
    if (
      !cartaoParaCadatrar.nome ||
      !cartaoParaCadatrar.limite ||
      !cartaoParaCadatrar.diaVencimento ||
      !cartaoParaCadatrar.diaFechamento ||
      !cartaoParaCadatrar.cor
    ) {
      return NextResponse.json(
        { error: "Preencha todos os dados!" },
        { status: 400 },
      );
    }
    const cartaoCriado = await criarCartao(cartaoParaCadatrar);
    return NextResponse.json(cartaoCriado, { status: 201 });
  } catch (error) {
    console.log("Erro ao criar cartão de crédito: ", error);
    NextResponse.json(
      { error: "Erro ao criar cartão de crédito" },
      { status: 400 },
    );
  }
}
