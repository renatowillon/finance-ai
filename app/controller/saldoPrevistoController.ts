import { db } from "../_lib/prisma";
import { obterSessao } from "../_lib/session";
import { formatarData } from "../_utils/functions";
import { saldoBancoController } from "./saldoBancoController";
import { pegarTransacaoPorPeriodo } from "./transacaoCartaoController";

export const saldoPrevistoController = async (
  bancoId: number,
  yearMonth: string,
) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  const startDate = new Date(`${yearMonth}-01T00:00:00`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const inicioCT = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const fimCT = new Date(endDate.getFullYear(), endDate.getMonth(), 0);

  const inicioFormatado = formatarData(inicioCT);
  const fimFormatado = formatarData(fimCT);

  const banco = await db.banco.findUnique({
    where: { id: bancoId },
    select: { principal: true },
  });

  const { totalCartao } = await pegarTransacaoPorPeriodo({
    dataInicio: new Date(inicioFormatado),
    dataFim: new Date(fimFormatado),
    userId: Number(usuarioLogado),
  });

  const totalCartaoConsiderado = banco?.principal ? totalCartao : 0;

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

  return receitas - (despesas + totalCartaoConsiderado) + saldoAtualBanco;
};
