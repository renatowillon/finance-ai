import { AdicionarTransacaoInvestimento } from "@/app/controller/transacaoInvestimentoController";
import { TypeTransacaoInvestimento } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const transacaoInvestimento: TypeTransacaoInvestimento = await req.json();
  try {
    if (!transacaoInvestimento.investimentoId) {
      return NextResponse.json(
        { error: "Id de investimento não preenchido" },
        { status: 400 },
      );
    }
    if (!transacaoInvestimento.valor) {
      return NextResponse.json({ error: "Preencha o valor" }, { status: 400 });
    }
    if (!transacaoInvestimento.tipo) {
      return NextResponse.json({ error: "Informe o tipo" }, { status: 400 });
    }
    const criarTransacaoInvestimento = await AdicionarTransacaoInvestimento(
      transacaoInvestimento,
    );

    return NextResponse.json(criarTransacaoInvestimento, { status: 201 });
  } catch (error) {
    console.log("erro ao criar trancacao de investimento: ", error);
    return NextResponse.json(
      { error: "Erro ao criar trancacao de investimento" },
      { status: 500 },
    );
  }
}
