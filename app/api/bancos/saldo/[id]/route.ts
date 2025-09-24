import { saldoBancoController } from "@/app/controller/saldoBancoController";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const bancoId = Number(id);
  const saldo = await saldoBancoController(bancoId);
  return NextResponse.json(saldo);
}
