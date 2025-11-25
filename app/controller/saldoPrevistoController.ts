import { db } from "../_lib/prisma";
import { obterSessao } from "../_lib/session";
import { saldoBancoController } from "./saldoBancoController";

export const saldoPrevistoController = async (
  bancoId: number,
  yearMonth: string,
) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  const startDate = new Date(`${yearMonth}-01T00:00:00`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const { _sum: despesasGeral } = await db.transaction.aggregate({
    where: {
      type: "DESPESA",
      bancoId,
      userId: Number(usuarioLogado),
      baixado: false,
      date: {
        //gte: startDate,
        lt: endDate,
      },
    },
    _sum: { amount: true },
  });

  const { _sum: receitasGeral } = await db.transaction.aggregate({
    where: {
      type: "DEPOSITO",
      bancoId,
      userId: Number(usuarioLogado),
      baixado: false,
      date: {
        //gte: startDate,
        lt: endDate,
      },
    },
    _sum: { amount: true },
  });

  const saldoAtualBanco = await saldoBancoController(bancoId);
  const despesas = despesasGeral.amount?.toNumber() ?? 0;
  const receitas = receitasGeral.amount?.toNumber() ?? 0;

  return receitas - despesas + saldoAtualBanco;
};
