import { db } from "../_lib/prisma";
import { parseMoney } from "../_lib/utils";
import { adicionarMeses, calcularCompetencia } from "../functions/functions";
import { TypeTransacaoCartao } from "../types";

export const PegarTransacaoPorCartao = async (cartaoCreditoId: string) => {
  return db.transacaoCartaoCredito.findMany({
    where: { cartaoCreditoId },
    orderBy: { dataCompra: "desc" },
  });
};

export const PegarUmaTransacaoCartao = async (transacaoCartaoId: string) => {
  return db.transacaoCartaoCredito.findUnique({
    where: { id: transacaoCartaoId },
  });
};

export const AdicionarTransacaoCartao = async (data: TypeTransacaoCartao) => {
  const cartao = await db.cartaoCredito.findUnique({
    where: { id: data.cartaoCreditoId },
  });

  if (!cartao) {
    throw new Error("Cartão não encontrado");
  }

  const dataCompra = new Date(data.dataCompra);

  if (isNaN(dataCompra.getTime())) {
    throw new Error("Data de compra inválida");
  }

  const competenciaBase = calcularCompetencia(dataCompra, cartao.diaFechamento);

  // NÃO parcelado
  if (!data.parcelada || !data.totalParcelas || data.totalParcelas <= 1) {
    return db.transacaoCartaoCredito.create({
      data: {
        ...data,
        dataCompra,
        parcelaAtual: 1,
        totalParcelas: 1,
        competencia: competenciaBase,
        valor: parseMoney(data.valor),
      },
    });
  }

  // Parcelado → cria N registros
  const transacoes = Array.from({ length: data.totalParcelas }, (_, index) => ({
    descricao: data.descricao,
    valor: parseMoney(data.valor) / Number(data.totalParcelas),
    dataCompra,
    parcelada: true,
    parcelaAtual: index + 1,
    totalParcelas: data.totalParcelas,
    competencia: adicionarMeses(competenciaBase, index),
    pago: false,
    cartaoCreditoId: data.cartaoCreditoId,
  }));

  return db.transacaoCartaoCredito.createMany({
    data: transacoes,
  });
};

export const AtualizarTransacaoCartao = async (
  id: string,
  data: TypeTransacaoCartao,
) => {
  return db.transacaoCartaoCredito.update({
    where: { id },
    data,
  });
};

export const DeletarTransacaoCartao = async (id: string) => {
  return db.transacaoCartaoCredito.delete({
    where: { id },
  });
};
