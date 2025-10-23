import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { db } from "@/app/_lib/prisma";
import { AtualizarUsuario } from "@/app/controller/usuarioController";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_req: Request, { params }: Params) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
  }

  try {
    const user: User | null = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não existe nesse ID" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const usuarioId = Number(params.id);
    if (isNaN(usuarioId)) {
      return NextResponse.json({ error: "ID Invalido" }, { status: 400 });
    }
    const dadosAtualizado = await request.json();
    const resposta = await AtualizarUsuario(usuarioId, dadosAtualizado);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar usuário: ", error);
    return NextResponse.json(
      { error: "Erro Interno no servidor" },
      { status: 500 },
    );
  }
}
