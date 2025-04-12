import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export const getCurrentMonthTransactions = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("usuario não autenticado");
  }
  return db.transaction.count({
    where: {
      userId: userId,
      createAt: {
        gte: startOfMonth(new Date()),
        lt: endOfMonth(new Date()),
      },
    },
  });
};
