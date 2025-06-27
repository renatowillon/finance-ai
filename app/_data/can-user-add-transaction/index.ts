import { cookies } from "next/headers";
import { getCurrentMonthTransactions } from "../get-current-month-transaction";

export const canUserAddTransaction = async () => {
  const cookieStore = cookies();
  const userIdString = cookieStore.get("userId")?.value;
  const userId = userIdString ? Number(userIdString) : null;
  // const { userId } = await useAuth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }
  if (!userId) {
    throw new Error("usuario não autenticado");
  }

  const currentMonthTransactions = await getCurrentMonthTransactions();
  if (currentMonthTransactions >= 10) {
    return false;
  }
  return true;
};
