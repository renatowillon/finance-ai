import { db } from "../_lib/prisma";
import { TypeInvestimento, TypeInvestimentoInput } from "../types";
import { obterSessao } from "../_lib/session";

export const PegarInvestimentos = async () => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;
  return db.investimento.findMany({
    where: { userId: Number(usuarioLogado) },
    orderBy: { id: "asc" },
  });
};

export const PegarUmInvestimento = async (id: number) => {
  const sessao = await obterSessao();
  const usuarioLogado = sessao?.userId;

  return await db.investimento.findUnique({
    where: { id, userId: Number(usuarioLogado) },
  });
};

export const AdicionarInvestimento = async (data: TypeInvestimento) => {
  return db.investimento.create({ data });
};

export const AtualizarInvestimento = async (
  id: number,
  data: TypeInvestimentoInput,
) => {
  return db.investimento.update({
    where: { id },
    data,
  });
};

export const DeleteInvestimento = async (id: number) => {
  return db.investimento.delete({ where: { id } });
};
