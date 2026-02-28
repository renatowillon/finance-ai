import { endOfMonth, startOfMonth } from "date-fns";
import { toNumber } from "@/app/_lib/ai/decimal";
import { Periodo, resolverPeriodo } from "@/app/_lib/ai/periodoResolver";
import { db } from "@/app/_lib/prisma";

function monthToDateRange(competenciaMes: string) {
  const [yearRaw, monthRaw] = competenciaMes.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!year || !month || month < 1 || month > 12) {
    throw new Error("Competencia invalida, use YYYY-MM");
  }

  const base = new Date(year, month - 1, 1);
  return { inicio: startOfMonth(base), fim: endOfMonth(base) };
}

export class FinanceQueryService {
  static async getResumoPeriodo(
    userId: number,
    periodo: Periodo,
    dataInicio?: Date,
    dataFim?: Date,
  ) {
    const { inicio, fim } = resolverPeriodo(periodo, dataInicio, dataFim);

    const transacoesBanco = await db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: inicio,
          lte: fim,
        },
      },
    });

    const transacoesCartao = await db.transacaoCartaoCredito.findMany({
      where: {
        cartaoCredito: { userId },
        competencia: {
          gte: inicio,
          lte: fim,
        },
      },
    });

    const totalEntradas = transacoesBanco
      .filter((t) => t.type === "DEPOSITO")
      .reduce((acc, t) => acc + toNumber(t.amount), 0);

    const totalDespesasBanco = transacoesBanco
      .filter((t) => t.type === "DESPESA")
      .reduce((acc, t) => acc + toNumber(t.amount), 0);

    const totalDespesasCartao = transacoesCartao.reduce(
      (acc, t) => acc + toNumber(t.valor),
      0,
    );

    const totalDespesas = totalDespesasBanco + totalDespesasCartao;

    return {
      periodo: { inicio, fim },
      totalEntradas,
      totalDespesasBanco,
      totalDespesasCartao,
      totalDespesas,
      saldoLiquido: totalEntradas - totalDespesas,
      quantidadeTransacoes: transacoesBanco.length + transacoesCartao.length,
    };
  }

  static async getSaldoContas(userId: number) {
    const bancos = await db.banco.findMany({
      where: { userId },
    });

    const saldoTotal = bancos.reduce(
      (acc, b) => acc + toNumber(b.saldoAtual),
      0,
    );

    return {
      bancos: bancos.map((b) => ({
        id: b.id,
        nome: b.nome,
        saldo: toNumber(b.saldoAtual),
      })),
      saldoTotal,
    };
  }

  static async getSaldoBancoPorNome(userId: number, bancoNome: string) {
    const banco = await db.banco.findFirst({
      where: {
        userId,
        nome: { equals: bancoNome, mode: "insensitive" },
      },
    });

    if (!banco) {
      throw new Error("Banco nao encontrado");
    }

    return {
      bancoId: banco.id,
      bancoNome: banco.nome,
      saldoAtual: toNumber(banco.saldoAtual),
    };
  }

  static async getFaturaAtual(cartaoId: string) {
    const fatura = await db.faturaCartao.findFirst({
      where: {
        cartaoCreditoId: cartaoId,
        fechada: false,
      },
      include: {
        cartao: true,
        transacoes: true,
      },
    });

    if (!fatura) {
      throw new Error("Fatura nao encontrada");
    }

    const valorTotal = toNumber(fatura.valorTotal);
    const limite = toNumber(fatura.cartao.limite);

    return {
      cartao: fatura.cartao.nome,
      valorAtual: valorTotal,
      limite,
      limiteDisponivel: limite - valorTotal,
      percentualUtilizado: limite > 0 ? (valorTotal / limite) * 100 : 0,
      vencimento: fatura.vencimento,
      quantidadeTransacoes: fatura.transacoes.length,
    };
  }

  static async getFaturaCartaoPorMes({
    userId,
    cartaoNome,
    competenciaMes,
  }: {
    userId: number;
    cartaoNome: string;
    competenciaMes?: string | null;
  }) {
    const cartao = await db.cartaoCredito.findFirst({
      where: {
        userId,
        nome: { equals: cartaoNome, mode: "insensitive" },
      },
    });

    if (!cartao) {
      throw new Error("Cartao nao encontrado");
    }

    const { inicio, fim } = competenciaMes
      ? monthToDateRange(competenciaMes)
      : monthToDateRange(
          `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
        );

    const [faturaFechada, transacoes] = await Promise.all([
      db.faturaCartao.findFirst({
        where: {
          cartaoCreditoId: cartao.id,
          competencia: { gte: inicio, lte: fim },
        },
      }),
      db.transacaoCartaoCredito.findMany({
        where: {
          cartaoCreditoId: cartao.id,
          competencia: { gte: inicio, lte: fim },
        },
      }),
    ]);

    const valorEmTransacoes = transacoes.reduce(
      (acc, transacao) => acc + toNumber(transacao.valor),
      0,
    );

    return {
      cartaoNome: cartao.nome,
      competencia: `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, "0")}`,
      valorTotal: faturaFechada
        ? toNumber(faturaFechada.valorTotal)
        : valorEmTransacoes,
      fechada: faturaFechada?.fechada ?? false,
      paga: faturaFechada?.paga ?? false,
      vencimento: faturaFechada?.vencimento ?? null,
      quantidadeTransacoes: transacoes.length,
      limite: toNumber(cartao.limite),
    };
  }

  static async getCategoriaMaisGasta(userId: number, periodo: Periodo) {
    const { inicio, fim } = resolverPeriodo(periodo);

    const gastosPorCategoria = await db.transaction.groupBy({
      by: ["categoriaId"],
      where: {
        userId,
        type: "DESPESA",
        date: {
          gte: inicio,
          lte: fim,
        },
        categoriaId: { not: null },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 1,
    });

    if (gastosPorCategoria.length === 0) {
      return null;
    }

    const categoriaId = gastosPorCategoria[0].categoriaId;
    const categoria = categoriaId
      ? await db.categoria.findUnique({ where: { id: categoriaId } })
      : null;

    return {
      categoriaNome: categoria?.nome ?? "Sem categoria",
      total: toNumber(gastosPorCategoria[0]._sum.amount),
      periodo,
    };
  }

  static async getCategorias(userId: number) {
    return db.categoria.findMany({
      where: { userId },
    });
  }

  static async getDetalhePeriodoPorBanco(userId: number, periodo: Periodo) {
    const { inicio, fim } = resolverPeriodo(periodo);

    const [transacoesBanco, transacoesCartao] = await Promise.all([
      db.transaction.findMany({
        where: {
          userId,
          date: {
            gte: inicio,
            lte: fim,
          },
        },
        include: {
          transactionBanco: {
            select: { id: true, nome: true },
          },
        },
      }),
      db.transacaoCartaoCredito.findMany({
        where: {
          cartaoCredito: { userId },
          competencia: {
            gte: inicio,
            lte: fim,
          },
        },
      }),
    ]);

    const detalhamentoMap = new Map<
      number,
      {
        bancoId: number;
        bancoNome: string;
        entradas: number;
        despesas: number;
        quantidade: number;
      }
    >();

    for (const transacao of transacoesBanco) {
      const bancoId = transacao.transactionBanco.id;
      const bancoNome = transacao.transactionBanco.nome;
      const itemAtual = detalhamentoMap.get(bancoId) ?? {
        bancoId,
        bancoNome,
        entradas: 0,
        despesas: 0,
        quantidade: 0,
      };

      const valor = toNumber(transacao.amount);
      if (transacao.type === "DEPOSITO") {
        itemAtual.entradas += valor;
      }
      if (transacao.type === "DESPESA") {
        itemAtual.despesas += valor;
      }
      itemAtual.quantidade += 1;

      detalhamentoMap.set(bancoId, itemAtual);
    }

    const detalhamentoBancos = Array.from(detalhamentoMap.values()).sort(
      (a, b) => a.bancoNome.localeCompare(b.bancoNome),
    );

    const totalEntradas = detalhamentoBancos.reduce(
      (acc, item) => acc + item.entradas,
      0,
    );
    const totalDespesasBanco = detalhamentoBancos.reduce(
      (acc, item) => acc + item.despesas,
      0,
    );
    const totalDespesasCartao = transacoesCartao.reduce(
      (acc, item) => acc + toNumber(item.valor),
      0,
    );

    return {
      periodo,
      inicio,
      fim,
      totalEntradas,
      totalDespesasBanco,
      totalDespesasCartao,
      totalDespesas: totalDespesasBanco + totalDespesasCartao,
      detalhamentoBancos,
    };
  }
}
