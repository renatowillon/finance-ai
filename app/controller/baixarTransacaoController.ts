import { db } from "../_lib/prisma";

export const BaixarTransacao = async (idTransacao: string) => {
  if (!idTransacao) return null;

  const contaParaBaixar = db.transaction.update({
    where: {
      id: idTransacao,
    },
    data: {
      baixado: true,
    },
  });
  return contaParaBaixar;
};

export const EstornarTransacao = async (idTransacao: string) => {
  if (!idTransacao) return null;
  const contaParaEstornar = db.transaction.update({
    where: {
      id: idTransacao,
    },
    data: {
      baixado: false,
    },
  });
  return contaParaEstornar;
};
