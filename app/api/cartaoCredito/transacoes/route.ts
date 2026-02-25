import { pegarTransacaoPorPeriodo } from "@/app/controller/transacaoCartaoController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, dataInicio, dataFim } = body;

    if (!userId || !dataInicio || !dataFim) {
      return NextResponse.json(
        { message: "parametros obrigatorios não informado!" },
        { status: 400 },
      );
    }

    const resultado = await pegarTransacaoPorPeriodo({
      userId: Number(userId),
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
    });

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error("erro ao buscar transações de cartão:", error);

    return NextResponse.json(
      { message: "erro interno no servidor" },
      { status: 500 },
    );
  }
}
