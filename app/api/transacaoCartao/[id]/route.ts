import {
  AtualizarTransacaoCartao,
  DeletarTransacaoCartao,
  PegarTransacaoPorCartao,
  PegarUmaTransacaoCartao,
} from "@/app/controller/transacaoCartaoController";
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const transacaoCartaoId = params.id;
    if (!transacaoCartaoId) {
      return NextResponse.json(
        { error: "ID da transação invalido" },
        { status: 400 },
      );
    }
    const transacaoCartaoAtualizado = await req.json();
    const resposta = await AtualizarTransacaoCartao(
      transacaoCartaoId,
      transacaoCartaoAtualizado,
    );
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar transação: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor", detalhe: error },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const transacaoCartaoId = params.id;
    const transacaoExiste = await PegarUmaTransacaoCartao(transacaoCartaoId);

    if (!transacaoExiste) {
      return NextResponse.json(
        { error: "ID da transação inválido" },
        { status: 404 },
      );
    }
    if (!transacaoCartaoId) {
      return NextResponse.json(
        { error: "ID da transação inválido" },
        { status: 400 },
      );
    }
    await DeletarTransacaoCartao(transacaoCartaoId);
    return NextResponse.json(
      { mensagem: "Transação deletada com sucesso." },
      { status: 204 },
    );
  } catch (error) {
    console.error("Erro ao deletar transação: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor", detalhe: error },
      { status: 500 },
    );
  }
}
