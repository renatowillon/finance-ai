import { db } from "../_lib/prisma";
import { obterSessao } from "../_lib/session";
import { parseMoney } from "../_lib/utils";
import { calcularVencimento } from "../functions/functions";

interface FecharFaturaProps {
  competencia: string;
  cartaoCreditoId: string;
}

interface PagarFaturaProps {
  faturaId: string;
  valorPago: string | number;
  bancoId: number;
}

const obterCompetenciaMesAno = (data: Date) => {
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const ano = data.getUTCFullYear();
  return `${mes}/${ano}`;
};

export const pegarFaturas = (id: string) => {
  return db.faturaCartao.findMany({
    where: {
      cartaoCreditoId: id,
    },
    orderBy: {
      competencia: "desc",
    },
  });
};

export const faturaEstaFechada = async (
  competencia: string,
  cartaoCreditoId: string,
): Promise<{ fechada: boolean; faturaId: string | null }> => {
  const [ano, mes] = competencia.split("-").map(Number);

  const inicioMes = new Date(Date.UTC(ano, mes - 1, 1));
  const fimMes = new Date(Date.UTC(ano, mes, 1));

  const fatura = await db.faturaCartao.findFirst({
    where: {
      cartaoCreditoId,
      fechada: true,
      competencia: {
        gte: inicioMes,
        lt: fimMes,
      },
    },
    select: {
      id: true,
    },
  });

  return {
    fechada: !!fatura,
    faturaId: fatura?.id ?? null,
  };
};

export const reabrirFatura = async (id: string) => {
  const faturaExiste = await db.faturaCartao.findUnique({
    where: { id },
  });

  if (!faturaExiste) {
    throw new Error("Fatura nao existe");
  }

  const pagamentosRegistrados = await db.transaction.count({
    where: {
      faturaCartaoId: id,
    },
  });

  if (pagamentosRegistrados > 0) {
    throw new Error(
      "Nao e possivel reabrir uma fatura com pagamentos registrados.",
    );
  }

  return db.faturaCartao.delete({
    where: {
      id: faturaExiste.id,
    },
  });
};

export const fecharFatura = async ({
  cartaoCreditoId,
  competencia,
}: FecharFaturaProps) => {
  const [ano, mes] = competencia.split("-").map(Number);
  const dataCompetencia = new Date(ano, mes - 1, 1);

  return db.$transaction(async (transacao) => {
    const cartao = await transacao.cartaoCredito.findUnique({
      where: { id: cartaoCreditoId },
    });

    if (!cartao) {
      throw new Error("Cartao nao encontrado");
    }

    const vencimento = calcularVencimento(
      dataCompetencia,
      cartao.diaVencimento,
    );

    const inicioMes = new Date(Date.UTC(ano, mes - 1, 1));
    const fimMes = new Date(Date.UTC(ano, mes, 1));

    const faturaExistente = await transacao.faturaCartao.findFirst({
      where: {
        cartaoCreditoId,
        competencia: { gte: inicioMes, lt: fimMes },
        fechada: true,
      },
    });

    if (faturaExistente) {
      throw new Error("Essa fatura ja esta fechada");
    }

    const transacaoCartao = await transacao.transacaoCartaoCredito.findMany({
      where: {
        cartaoCreditoId,
        competencia: {
          gte: inicioMes,
          lt: fimMes,
        },
        faturaId: null,
      },
    });

    if (transacaoCartao.length === 0) {
      throw new Error("Nao existe transacoes para fechar essa fatura");
    }

    const valorTotal = transacaoCartao.reduce(
      (acc, t) => acc + Number(t.valor),
      0,
    );

    const fatura = await transacao.faturaCartao.create({
      data: {
        cartaoCreditoId,
        competencia: dataCompetencia,
        vencimento,
        valorTotal,
        valorPago: 0,
        fechada: true,
        paga: false,
      },
    });

    await transacao.transacaoCartaoCredito.updateMany({
      where: {
        id: { in: transacaoCartao.map((t) => t.id) },
      },
      data: {
        faturaId: fatura.id,
      },
    });

    return fatura;
  });
};

export const pagarFatura = async ({
  faturaId,
  valorPago,
  bancoId,
}: PagarFaturaProps) => {
  const sessao = await obterSessao();
  const userId = Number(sessao?.userId);

  if (!userId) {
    throw new Error("Usuario nao autenticado");
  }

  const valorPagamento = parseMoney(valorPago);

  if (!valorPagamento || valorPagamento <= 0) {
    throw new Error("Informe um valor de pagamento valido.");
  }

  return db.$transaction(async (transacao) => {
    const fatura = await transacao.faturaCartao.findUnique({
      where: { id: faturaId },
      include: {
        cartao: {
          select: { id: true, nome: true, userId: true },
        },
      },
    });

    if (!fatura) {
      throw new Error("Fatura nao encontrada.");
    }

    if (fatura.cartao.userId !== userId) {
      throw new Error("Sem permissao para pagar essa fatura.");
    }

    if (!fatura.fechada) {
      throw new Error("Apenas faturas fechadas podem ser pagas.");
    }

    const valorTotalFatura = Number(fatura.valorTotal);
    const valorJaPago = Number(fatura.valorPago);
    const valorRestante = Number((valorTotalFatura - valorJaPago).toFixed(2));

    if (valorRestante <= 0) {
      throw new Error("Essa fatura ja esta totalmente paga.");
    }

    if (valorPagamento > valorRestante) {
      throw new Error(
        `Pagamento maior que o valor restante da fatura (${valorRestante.toFixed(2)}).`,
      );
    }

    const bancoExiste = await transacao.banco.findFirst({
      where: { id: bancoId, userId },
      select: { id: true },
    });

    if (!bancoExiste) {
      throw new Error("Banco nao encontrado.");
    }

    const pagamentoTotal = valorPagamento === valorRestante;
    const tipoPagamento = pagamentoTotal ? "total" : "parcial";
    const competencia = obterCompetenciaMesAno(fatura.competencia);

    const transacaoPagamento = await transacao.transaction.create({
      data: {
        name: `Pagamento de fatura ${tipoPagamento} - ${competencia} ${fatura.cartao.nome}`,
        type: "DESPESA",
        amount: valorPagamento,
        date: new Date(),
        userId,
        bancoId,
        baixado: true,
        afetaSaldo: false,
        faturaCartaoId: fatura.id,
      },
    });

    const novoValorPago = Number((valorJaPago + valorPagamento).toFixed(2));
    const faturaAtualizada = await transacao.faturaCartao.update({
      where: { id: fatura.id },
      data: {
        valorPago: novoValorPago,
        paga: novoValorPago >= valorTotalFatura,
      },
    });

    return {
      fatura: faturaAtualizada,
      pagamento: transacaoPagamento,
      valorRestante: Number((valorTotalFatura - novoValorPago).toFixed(2)),
    };
  });
};

export const pegarHistoricoPagamentoCartao = async (
  cartaoCreditoId: string,
) => {
  const sessao = await obterSessao();
  const userId = Number(sessao?.userId);

  if (!userId) {
    throw new Error("Usuario nao autenticado");
  }

  return db.transaction.findMany({
    where: {
      userId,
      faturaCartao: {
        cartaoCreditoId,
      },
    },
    include: {
      transactionBanco: {
        select: {
          id: true,
          nome: true,
        },
      },
      faturaCartao: {
        select: {
          id: true,
          competencia: true,
          valorTotal: true,
          valorPago: true,
          paga: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};
