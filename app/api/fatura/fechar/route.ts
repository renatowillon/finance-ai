import { fecharFatura } from "@/app/controller/faturaCartaoController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { competencia, cartaoCreditoId } = body;

    const fatura = await fecharFatura({
      competencia,
      cartaoCreditoId,
    });
    return NextResponse.json(fatura, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Não foi possivel criar Fatura: ", error);

    return NextResponse.json(
      { error: error.message ?? "Erro inesperado" },
      { status: 400 },
    );
  }
}
