import {
  AdicionaCategoria,
  PegarCategorias,
} from "@/app/controller/categoriaController";
import { TypeCategoria } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const response = await PegarCategorias();
  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const categoria: TypeCategoria = await req.json();
  try {
    if (!categoria.nome) {
      return NextResponse.json(
        { error: "Preencha o nome da Categoria" },
        { status: 400 },
      );
    }
    const criarCategoria = await AdicionaCategoria(categoria);

    return NextResponse.json(criarCategoria, { status: 201 });
  } catch (error) {
    console.log("erro ao criar banco: ", error);
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
