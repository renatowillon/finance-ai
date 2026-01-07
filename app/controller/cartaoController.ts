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

export const pegarUmCartao = async (id: number) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  return db.cartaoCredito.findUnique({
    where: { id, userId: Number(usuarioLogado) },
  });
};

export const criarCartao = (data: TypeCartaoCreditoInput) => {
  return db.cartaoCredito.create({ data });
};

export const atualizarCartao = async (id: number, data: TypeCartaoCredito) => {
  return db.cartaoCredito.update({
    where: { id },
    data,
  });
};

export const deletarCartao = (id: number) => {
  return db.cartaoCredito.delete({
    where: { id },
  });
};
