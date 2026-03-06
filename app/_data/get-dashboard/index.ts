import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalDespesaPorCategoria, PorcentagemTransacaoPorTipo } from "./types";
import { obterSessao } from "@/app/_lib/session"; // 1. Importar a função de sessão
import { pegarTransacaoPorPeriodo } from "@/app/controller/transacaoCartaoController";
import { formatarData } from "@/app/_utils/functions";
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

  const inicioCT = new Date(
    inicio.getFullYear(),
    inicio.getMonth(),
    inicio.getDate(),
  );
  const fimCT = new Date(fim.getFullYear(), fim.getMonth(), 0);

  const inicioFormatado = formatarData(inicioCT);
  const fimFormatado = formatarData(fimCT);

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
  const { totalCartao } = await pegarTransacaoPorPeriodo({
    dataInicio: new Date(inicioFormatado),
    dataFim: new Date(fimFormatado),
    userId: Number(sessao.userId),
  });
  const saldo =
    totalDepositos - totalInvestimentos - totalDespesas - totalCartao;

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
    [TransactionType.CARTAOCREDITO]:
      totalTransacoes > 0
        ? Math.round((totalInvestimentos / totalTransacoes) * 100)
        : 0,
  };

  const transacoes = await db.transaction.findMany({
    where: { ...filtroConsulta, type: TransactionType.DESPESA },
    orderBy: { createAt: "desc" },
    include: { categoria: true },
  });

  const totalDespesasPorCategoria: TotalDespesaPorCategoria[] = (
    await db.transaction.groupBy({
      by: ["categoriaId"],
      where: { ...filtroConsulta, type: TransactionType.DESPESA },
      _sum: { amount: true },
    })
  )
    .filter((categoria) => categoria.categoriaId !== null)
    .map((categoria) => {
      const categoriaInfo = transacoes.find(
        (t) => t.categoriaId === categoria.categoriaId,
      );

      return {
        categoria: categoria.categoriaId!,
        valorTotal: Number(categoria._sum.amount),
        porcentagemDoTotal:
          totalDespesas > 0
            ? Math.round((Number(categoria._sum.amount) / totalDespesas) * 100)
            : 0,
        categoriaNome: categoriaInfo?.categoria?.nome ?? "Sem nome",
      };
    });

  const ultimasTransacoes = await db.transaction.findMany({
    where: filtroConsulta,
    orderBy: { date: "desc" },
    take: 10,
  });
  console.log("inicio:", inicioFormatado, "Fim: ", fimFormatado);
  console.log("Mês: ", mes);
  console.log("Total Cartão: ", totalCartao);
  return {
    totalDepositos,
    totalInvestimentos,
    totalDespesas,
    saldo,
    totalCartao,
    porcentagemPorTipo,
    totalDespesasPorCategoria,
    ultimasTransacoes,
  };
};
