import { db } from "../_lib/prisma";
import { TypeCategoria } from "../types";
import { obterSessao } from "../_lib/session";

export const PegarCategorias = async () => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  return db.categoria.findMany({
    where: { userId: Number(usuarioLogado) },
    orderBy: { id: "asc" },
  });
};

export const PegarUmaCategoria = async (id: number) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  return await db.categoria.findUnique({
    where: { id, userId: Number(usuarioLogado) },
  });
};

export const AdicionaCategoria = async (data: TypeCategoria) => {
  return db.categoria.create({ data });
};

export const AtualizarCategoria = async (id: number, data: TypeCategoria) => {
  return db.categoria.update({
    where: { id },
    data,
  });
};

export const DeleteCategoria = async (id: number) => {
  return db.categoria.delete({ where: { id } });
};
