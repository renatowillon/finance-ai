import { getSession } from "@/app/_lib/session"; // Importe sua nova função
import { getCurrentMonthTransactions } from "../get-current-month-transaction";

export const canUserAddTransaction = async (): Promise<boolean> => {
  const session = await getSession();

  if (!session?.userId) {
    // O ideal é retornar false para verificações de permissão
    return false;
  }

  // Acessa o plano de assinatura diretamente da sessão
  if (session.plano === "PREMIUM") {
    return true;
  }

  // Passa o userId para a função que precisa dele
  const currentMonthTransactions = await getCurrentMonthTransactions(
    session.userId,
  );

  if (currentMonthTransactions >= 10 && session.plano === "FREE") {
    return false;
  }

  return true;
};
