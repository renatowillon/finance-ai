import { db } from "../_lib/prisma";
import { calcularVencimento } from "../functions/functions";

interface FecharFaturaProps {
  competencia: string;
  cartaoCreditoId: string;
}

export const pegarFaturas = (id: string) => {
  return db.faturaCartao.findMany({
    where: {
      cartaoCreditoId: id,
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
    throw new Error("Fatura não existe");
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
      throw new Error("Cartão não encontrado");
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
      throw new Error("Essa fatura já está fechada");
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
      throw new Error("Não existe transações para fechar essa fatura");
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
