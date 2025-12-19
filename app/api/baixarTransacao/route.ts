import { BaixarTransacao } from "@/app/controller/baixarTransacaoController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { idTransacao } = await req.json();
  if (!idTransacao) return NextResponse.json({ error: "Venda não localizada" });
  try {
    const baixarTrasacao = BaixarTransacao(idTransacao);
    return NextResponse.json(
      {
        conta: baixarTrasacao,
        messagem: "Conta Baixada com Sucesso!",
      },
      { status: 200 },
    );
  } catch {
    NextResponse.json({ error: "Erro ao baixar transação" }, { status: 401 });
  }
}
