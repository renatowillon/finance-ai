import { db } from "../_lib/prisma";
import {
  TypeTransacaoInvestimento,
  TypeTransacaoInvestimentoInput,
} from "../types";

export const PegarTransacaoPorInvestimento = async (investimentoId: number) => {
  return db.transacoesInvestimento.findMany({
    where: { investimentoId },
    orderBy: { id: "asc" },
  });
};

export const AdicionarTransacaoInvestimento = async (
  data: TypeTransacaoInvestimento,
) => {
  return db.transacoesInvestimento.create({ data });
};

export const AtualizarTransacaoInvestimento = async (
  id: number,
  data: TypeTransacaoInvestimentoInput,
) => {
  return db.transacoesInvestimento.update({
    where: { id },
    data,
  });
};

export const DeleteTransacaoInvestimento = async (id: number) => {
  return db.transacoesInvestimento.delete({ where: { id } });
};
