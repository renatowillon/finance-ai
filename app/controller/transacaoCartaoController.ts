import { db } from "../_lib/prisma";
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
  return db.transacaoCartaoCredito.create({ data });
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
