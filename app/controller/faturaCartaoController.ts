import { db } from "../_lib/prisma";
import { TypeFaturaCartao } from "../types";

export const criarFaturaCartao = async (data: TypeFaturaCartao) => {
  return db.faturaCartao.create({ data });
};

export const alterarFaturaCartao = async (
  id: string,
  data: TypeFaturaCartao,
) => {
  return db.faturaCartao.update({
    where: { id },
    data,
  });
};
