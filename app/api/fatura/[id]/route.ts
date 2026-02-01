import { pegarFaturas } from "@/app/controller/faturaCartaoController";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const idCartaoCredito = params.id;
    if (!idCartaoCredito) {
      return NextResponse.json("ID cartão não localizado", { status: 400 });
    }
    const resposta = await pegarFaturas(idCartaoCredito);
    return NextResponse.json(resposta, { status: 200 });
  } catch (error) {
    console.error("Erro ao pegar faturas: ", error);
    return NextResponse.json(
      { error: "Erro Interno Servidor, ", detalhes: String(error) },
      { status: 500 },
    );
  }
}
