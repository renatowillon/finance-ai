import {
  atualizarCartao,
  deletarCartao,
  pegarUmCartao,
} from "@/app/controller/cartaoController";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cartaoId = params.id;
    if (!cartaoId) {
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cartaoId = params.id;
    if (!cartaoId) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }

    const resposta = await pegarUmCartao(cartaoId);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao pegar banco: ", error);
    return NextResponse.json(
      { error: "Erro interno no servidor", detalhes: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cartaoId = params.id;
    if (!cartaoId) {
      return NextResponse.json({ error: "ID Inválido" }, { status: 400 });
    }
    const resposta = await deletarCartao(cartaoId);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao pegar banco: ", error);
    return NextResponse.json(
      { error: "Erro Interno no Servidor", detalhes: String(error) },
      { status: 500 },
    );
  }
}
