import { db } from "../_lib/prisma";

export const saldoBancoController = async (bancoId: number) => {
  const { _sum: despesasBanco } = await db.transaction.aggregate({
    where: { type: "DESPESA", bancoId },
    _sum: { amount: true },
  });

  const { _sum: receitasBanco } = await db.transaction.aggregate({
    where: { type: "DEPOSITO", bancoId },
    _sum: { amount: true },
  });

  const saldoBancoInicial = await db.banco.findUnique({
    where: { id: bancoId },
    select: { saldoInicial: true },
  });
  const despesas = despesasBanco.amount?.toNumber() ?? 0;
  const receitas = receitasBanco.amount?.toNumber() ?? 0;
  const ValorBancoInicial = saldoBancoInicial?.saldoInicial.toNumber() ?? 0;

  return ValorBancoInicial + receitas - despesas;
};
