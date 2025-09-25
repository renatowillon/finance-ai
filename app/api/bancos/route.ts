import { db } from "@/app/_lib/prisma";
import { Adicionarbanco } from "@/app/controller/bancosController";
import { TypeBanco } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const bancos = await db.banco.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(bancos);
}

export async function POST(req: NextRequest) {
  const banco: TypeBanco = await req.json();
  try {
    if (!banco.nome) {
      return NextResponse.json(
        { error: "Preencha o nome do Banco" },
        { status: 400 },
      );
    }
    const criarbanco = await Adicionarbanco(banco);

    const bancoConvertido: TypeBanco = {
      ...criarbanco,
      saldoInicial: Number(criarbanco.saldoInicial),
      saldoAtual: Number(criarbanco.saldoAtual),
    };

    return NextResponse.json(bancoConvertido, { status: 201 });
  } catch (error) {
    console.error("erro ao criar banco: ", error);
    return NextResponse.json(
      { error: "Erro ao criar o banco" },
      { status: 500 },
    );
  }
}

// export async function DELETE(id: number) {
//   try {
//     await DeleteBanco(id);
//     return NextResponse.json({ status: 200 });
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     if (!id) {
//       return NextResponse.json(
//         { error: "Id do Banco não encontrado" },
//         { status: 404 },
//       );
//     }
//   }
// }
