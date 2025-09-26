import { Banco } from "@prisma/client";
import { db } from "../_lib/prisma";
import { TypeBanco } from "../types";
import { obterSessao } from "../_lib/session";

export const PegarBancos = async () => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;
  return db.banco.findMany({
    where: { userId: Number(usuarioLogado) },
    orderBy: { id: "asc" },
  });
};

export const PegarUmBanco = async (id: number) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;
  return db.banco.findUnique({
    where: { id, userId: Number(usuarioLogado) },
  });
};

export const Adicionarbanco = async (data: TypeBanco) => {
  return db.banco.create({ data });
};

export const AtualizarBanco = async (id: number, data: Banco) => {
  return db.banco.update({
    where: { id },
    data,
  });
};

export const DeleteBanco = async (id: number) => {
  return db.banco.delete({ where: { id } });
};
