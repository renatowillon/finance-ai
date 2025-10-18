import {
  AtualizarInvestimento,
  PegarUmInvestimento,
} from "@/app/controller/investimentoController";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const investimentoId = Number(params.id);
    if (isNaN(investimentoId)) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }

    const resposta = await PegarUmInvestimento(investimentoId);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao pegar investimento: ", error);
    return NextResponse.json(
      { error: "Erro interno no servidor", detalhes: String(error) },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const investimentoId = Number(params.id);
    if (isNaN(investimentoId)) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }
    const dadosAtualizado = await request.json();
    const resposta = await AtualizarInvestimento(
      investimentoId,
      dadosAtualizado,
    );
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar investimento: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor" },
      { status: 500 },
    );
  }
}
