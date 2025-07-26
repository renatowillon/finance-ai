import { db } from "@/app/_lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";

export const getCurrentMonthTransactions = async (userId: string) => {
  // A verificação de autenticação foi removida daqui,
  // pois a função que a chama (`canUserAddTransaction`) já faz isso.

  // A função agora usa o userId recebido como parâmetro para filtrar a contagem.
  return db.transaction.count({
    where: {
      userId: Number(userId), // <-- Apenas transações do usuário logado
      createAt: {
        gte: startOfMonth(new Date()),
        lt: endOfMonth(new Date()),
      },
    },
  });
};
