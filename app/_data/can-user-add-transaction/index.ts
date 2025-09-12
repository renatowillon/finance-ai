import { obterSessao } from "@/app/_lib/session"; // Importe sua nova função
import { getCurrentMonthTransactions } from "../get-current-month-transaction";

export const canUserAddTransaction = async (): Promise<boolean> => {
  const sessao = await obterSessao();

  if (!sessao?.userId) {
    // O ideal é retornar false para verificações de permissão
    return false;
  }

  // Acessa o plano de assinatura diretamente da sessão
  if (sessao.plano === "PREMIUM") {
    return true;
  }

  // Passa o userId para a função que precisa dele
  const transacoesDoMesAtual = await getCurrentMonthTransactions(sessao.userId);

  if (transacoesDoMesAtual >= 10 && sessao.plano === "FREE") {
    return false;
  }

  return true;
};
