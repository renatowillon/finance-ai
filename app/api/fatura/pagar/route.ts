import { pagarFatura } from "@/app/controller/faturaCartaoController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { faturaId, valorPago, bancoId } = body;

    if (!faturaId) {
      return NextResponse.json(
        { error: "ID da fatura nao informado." },
        { status: 400 },
      );
    }

    if (!valorPago) {
      return NextResponse.json(
        { error: "Valor do pagamento nao informado." },
        { status: 400 },
      );
    }

    if (!bancoId) {
      return NextResponse.json(
        { error: "Banco nao informado." },
        { status: 400 },
      );
    }

    const resposta = await pagarFatura({
      faturaId,
      valorPago,
      bancoId: Number(bancoId),
    });

    return NextResponse.json(resposta, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
