import { reabrirFatura } from "@/app/controller/faturaCartaoController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    await reabrirFatura(id);
    return NextResponse.json({ status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Não foi possivel localizar Fatura: ", error);

    return NextResponse.json(
      { error: error.message ?? "Erro inesperado" },
      { status: 400 },
    );
  }
}
