import { db } from "../_lib/prisma";
import { obterSessao } from "../_lib/session";

export const saldoBancoController = async (bancoId: number) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  const { _sum: despesasBanco } = await db.transaction.aggregate({
    where: {
      type: "DESPESA",
      bancoId,
      userId: Number(usuarioLogado),
      baixado: true,
    },
    _sum: { amount: true },
  });

  const { _sum: receitasBanco } = await db.transaction.aggregate({
    where: {
      type: "DEPOSITO",
      bancoId,
      userId: Number(usuarioLogado),
      baixado: true,
    },
    _sum: { amount: true },
  });

  const saldoBancoInicial = await db.banco.findUnique({
    where: { id: bancoId, userId: Number(usuarioLogado) },
    select: { saldoInicial: true },
  });
  const despesas = despesasBanco.amount?.toNumber() ?? 0;
  const receitas = receitasBanco.amount?.toNumber() ?? 0;
  const ValorBancoInicial = saldoBancoInicial?.saldoInicial.toNumber() ?? 0;

  return ValorBancoInicial + receitas - despesas;
};
