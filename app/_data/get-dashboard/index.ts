import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalDespesaPorCategoria, PorcentagemTransacaoPorTipo } from "./types";
import { obterSessao } from "@/app/_lib/session"; // 1. Importar a função de sessão
export const obterDashboard = async (mes: string) => {
  // 2. Obter a sessão do usuário no início da função
  const sessao = await obterSessao();
  if (!sessao?.userId) {
    throw new Error(
      "Usuário não autenticado. Não é possível carregar o dashboard.",
    );
  }

  // validação de mês
  const anoAtual = new Date().getFullYear();
  const numeroMes = Number(mes);

  const inicio = new Date(anoAtual, numeroMes - 1, 1);
  const fim =
    numeroMes === 12
      ? new Date(anoAtual + 1, 0, 1)
      : new Date(anoAtual, numeroMes, 1);
  // 3. Adicionar o userId ao objeto 'where' para filtrar TODAS as queries

  const filtroConsulta = {
    userId: Number(sessao.userId),
    date: {
      gte: inicio,
      lt: fim,
    },
  };

  const totalDepositos = Number(
    (
      await db.transaction.aggregate({
        where: { ...filtroConsulta, type: "DEPOSITO" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );

  const totalInvestimentos = Number(
    (
      await db.transaction.aggregate({
        where: { ...filtroConsulta, type: "INVESTIMENTO" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );

  const totalDespesas = Number(
    (
      await db.transaction.aggregate({
        where: { ...filtroConsulta, type: "DESPESA" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );

  const saldo = totalDepositos - totalInvestimentos - totalDespesas;

  const totalTransacoes = totalDepositos + totalInvestimentos + totalDespesas;

  const porcentagemPorTipo: PorcentagemTransacaoPorTipo = {
    [TransactionType.DEPOSITO]:
      totalTransacoes > 0
        ? Math.round((totalDepositos / totalTransacoes) * 100)
        : 0,
    [TransactionType.DESPESA]:
      totalTransacoes > 0
        ? Math.round((totalDespesas / totalTransacoes) * 100)
        : 0,
    [TransactionType.INVESTIMENTO]:
      totalTransacoes > 0
        ? Math.round((totalInvestimentos / totalTransacoes) * 100)
        : 0,
  };

  const totalDespesasPorCategoria: TotalDespesaPorCategoria[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: { ...filtroConsulta, type: TransactionType.DESPESA },
      _sum: { amount: true },
    })
  ).map((categoria) => ({
    categoria: categoria.category,
    valorTotal: Number(categoria._sum.amount),
    porcentagemDoTotal:
      totalDespesas > 0
        ? Math.round((Number(categoria._sum.amount) / totalDespesas) * 100)
        : 0,
  }));

  const ultimasTransacoes = await db.transaction.findMany({
    where: filtroConsulta,
    orderBy: { date: "desc" },
    take: 10,
  });

  return {
    totalDepositos,
    totalInvestimentos,
    totalDespesas,
    saldo,
    porcentagemPorTipo,
    totalDespesasPorCategoria,
    ultimasTransacoes,
  };
};
