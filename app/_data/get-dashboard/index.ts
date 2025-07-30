import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { getSession } from "@/app/_lib/session"; // 1. Importar a função de sessão
export const getDashboard = async (month: string) => {
  // 2. Obter a sessão do usuário no início da função
  const session = await getSession();
  if (!session?.userId) {
    throw new Error(
      "Usuário não autenticado. Não é possível carregar o dashboard.",
    );
  }

  // validação de mês
  const currentYear = new Date().getFullYear();
  const m = Number(month);

  const start = new Date(currentYear, m - 1, 1);
  const end =
    m === 12 ? new Date(currentYear + 1, 0, 1) : new Date(currentYear, m, 1);
  // 3. Adicionar o userId ao objeto 'where' para filtrar TODAS as queries

  const where = {
    userId: Number(session.userId),
    date: {
      gte: start,
      lt: end,
    },
  };

  const depositTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSITO" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );

  const investimentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTIMENTO" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DESPESA" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );

  const balance = depositTotal - investimentsTotal - expensesTotal;

  const transactionTotal = depositTotal + investimentsTotal + expensesTotal;

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSITO]:
      transactionTotal > 0
        ? Math.round((depositTotal / transactionTotal) * 100)
        : 0,
    [TransactionType.DESPESA]:
      transactionTotal > 0
        ? Math.round((expensesTotal / transactionTotal) * 100)
        : 0,
    [TransactionType.INVESTIMENTO]:
      transactionTotal > 0
        ? Math.round((investimentsTotal / transactionTotal) * 100)
        : 0,
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: { ...where, type: TransactionType.DESPESA },
      _sum: { amount: true },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal:
      expensesTotal > 0
        ? Math.round((Number(category._sum.amount) / expensesTotal) * 100)
        : 0,
  }));

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 10,
  });

  return {
    depositTotal,
    investimentsTotal,
    expensesTotal,
    balance,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
