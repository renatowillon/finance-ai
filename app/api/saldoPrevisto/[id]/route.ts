import { saldoPrevistoController } from "@/app/controller/saldoPrevistoController";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const bancoId = Number(id);
  const { mes } = await request.json();
  if (!mes) {
    return NextResponse.json(
      { error: "O campo mes é obrigatorio" },
      { status: 400 },
    );
  }
  const saldo = await saldoPrevistoController(bancoId, mes);
  return NextResponse.json(saldo);
}
