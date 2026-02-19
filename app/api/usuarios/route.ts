import { NextRequest, NextResponse } from "next/server";
import { db } from "../../_lib/prisma";
import { TypeUsuario } from "@/app/types";
import { AdicionaUsuario } from "@/app/controller/usuarioController";

export async function GET() {
  const users = await db.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      plano: true,
      status: true,
      createAt: true,
      updateAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const usuario: TypeUsuario = await req.json();
  try {
    if (!usuario.name) {
      return NextResponse.json(
        { error: "Preencha o nome do usuário" },
        { status: 400 },
      );
    } else if (!usuario.email) {
      return NextResponse.json(
        { error: "Preencha o email do usuário" },
        { status: 400 },
      );
    } else if (!usuario.plano) {
      return NextResponse.json(
        { error: "Preencher o plano do usuário" },
        { status: 400 },
      );
    } else if (!usuario.senha) {
      return NextResponse.json(
        { error: "Preencher a senha do usuário" },
        { status: 400 },
      );
    }

    const criarUsuario = await AdicionaUsuario(usuario);

    return NextResponse.json(criarUsuario, { status: 201 });
  } catch (error) {
    console.log("erro ao criar usuário: ", error);
    return NextResponse.json(
      { error: "Erro ao criar o usuário" },
      { status: 500 },
    );
  }
}
