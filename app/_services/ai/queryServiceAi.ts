// /services/finance/FinanceQueryService.ts
import { toNumber } from "@/app/_lib/ai/decimal";
import { Periodo, resolverPeriodo } from "@/app/_lib/ai/periodoResolver";
import { db } from "@/app/_lib/prisma";

export class FinanceQueryService {
  static async getResumoPeriodo(
    userId: number,
    periodo: Periodo,
    dataInicio?: Date,
    dataFim?: Date,
  ) {
    const { inicio, fim } = resolverPeriodo(periodo, dataInicio, dataFim);

    // 🔹 Banco (Transaction)
    const transacoesBanco = await db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: inicio,
          lte: fim,
        },
      },
    });

    // 🔹 Cartão
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
      throw new Error("Fatura não encontrada");
    }

    const valorTotal = toNumber(fatura.valorTotal);
    const limite = toNumber(fatura.cartao.limite);

    return {
      cartao: fatura.cartao.nome,
      valorAtual: valorTotal,
      limite,
      limiteDisponivel: limite - valorTotal,
      percentualUtilizado: (valorTotal / limite) * 100,
      vencimento: fatura.vencimento,
      quantidadeTransacoes: fatura.transacoes.length,
    };
  }

  static async getCategorias(userId: number) {
    return db.categoria.findMany({
      where: { userId },
    });
  }
}
