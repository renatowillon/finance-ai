import {
  AtualizarCategoria,
  PegarUmaCategoria,
} from "@/app/controller/categoriaController";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const categoriaId = Number(params.id);
    if (isNaN(categoriaId)) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }

    const resposta = await PegarUmaCategoria(categoriaId);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao pegar categoria: ", error);
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
    const categoriaId = Number(params.id);
    if (isNaN(categoriaId)) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }
    const dadosAtualizado = await request.json();
    const resposta = await AtualizarCategoria(categoriaId, dadosAtualizado);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar Categoria: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor" },
      { status: 500 },
    );
  }
}
