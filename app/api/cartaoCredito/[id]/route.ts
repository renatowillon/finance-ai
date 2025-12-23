import { atualizarCartao } from "@/app/controller/cartaoController";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cartaoId = Number(params.id);
    if (isNaN(cartaoId)) {
      return NextResponse.json({ error: "ID Inválido" }, { status: 400 });
    }
    const cartaoAtualizado = await request.json();
    const resposta = await atualizarCartao(cartaoId, cartaoAtualizado);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cartao: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor" },
      { status: 500 },
    );
  }
}
