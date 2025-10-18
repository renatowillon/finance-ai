import {
  AdicionarInvestimento,
  PegarInvestimentos,
} from "@/app/controller/investimentoController";
import { TypeInvestimento } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const response = await PegarInvestimentos();
  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const investimento: TypeInvestimento = await req.json();
  try {
    if (!investimento.nome) {
      return NextResponse.json(
        { error: "Preencha o nome do Investimento" },
        { status: 400 },
      );
    }
    if (!investimento.meta) {
      return NextResponse.json({ error: "Preencha a meta" }, { status: 400 });
    }
    const criarInvestimento = await AdicionarInvestimento(investimento);

    return NextResponse.json(criarInvestimento, { status: 201 });
  } catch (error) {
    console.log("erro ao criar investimento: ", error);
    return NextResponse.json(
      { error: "Erro ao criar o investimento" },
      { status: 500 },
    );
  }
}
