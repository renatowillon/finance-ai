import { db } from "../_lib/prisma";
import { obterSessao } from "../_lib/session";
import { TypeCartaoCredito, TypeCartaoCreditoInput } from "../types";

export const pegarCartao = async () => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  return db.cartaoCredito.findMany({
    where: { userId: Number(usuarioLogado) },
    orderBy: { id: "asc" },
  });
};

export const pegarUmCartao = async (id: string) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  return db.cartaoCredito.findUnique({
    where: { id, userId: Number(usuarioLogado) },
  });
};

export const criarCartao = (data: TypeCartaoCreditoInput) => {
  return db.cartaoCredito.create({ data });
};

export const atualizarCartao = async (id: string, data: TypeCartaoCredito) => {
  return db.cartaoCredito.update({
    where: { id },
    data,
  });
};

export const deletarCartao = (id: string) => {
  return db.cartaoCredito.delete({
    where: { id },
  });
};
