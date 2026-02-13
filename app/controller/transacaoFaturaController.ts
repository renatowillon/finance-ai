import { db } from "../_lib/prisma";

export const PegarTransacaoFatura = async (faturaId: string) => {
  return db.transacaoCartaoCredito.findMany({
    where: { faturaId: faturaId },
    orderBy: { dataCompra: "desc" },
  });
};
