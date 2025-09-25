import { AtualizarBanco } from "@/app/controller/bancosController";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const bancoId = Number(params.id);
    if (isNaN(bancoId)) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }
    const dadosAtualizado = await request.json();
    const resposta = await AtualizarBanco(bancoId, dadosAtualizado);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar banco: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor" },
      { status: 500 },
    );
  }
}
