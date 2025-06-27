import { db } from "@/app/_lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
import { cookies } from "next/headers";

export const getCurrentMonthTransactions = async () => {
  const cookieStore = cookies();
  const userIdString = cookieStore.get("userId")?.value;
  const userId = userIdString ? Number(userIdString) : null;
  // const { userId } = await useAuth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
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
