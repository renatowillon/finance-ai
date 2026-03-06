import { redirect } from "next/navigation";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transaction";
import { cookies } from "next/headers";
import { obterUsuarioPorToken } from "../_lib/session";
import { PlanoDetalhes } from "./_components/planoDetalhes";

const SubscriptionsPage = async () => {
  const armazenadorCookie = cookies();
  const token = armazenadorCookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }

  const transacoesDoMesAtual = await getCurrentMonthTransactions(
    String(usuario.userId),
  );

  return (
    <>
      <div className="space-y-6 p-6 py-6 sm:p-6">
        <div className="">
          <h1 className="text-2xl font-bold">Assinatura</h1>
          <p className="mt-2 text-muted-foreground">
            Veja os detalhes do seu plano, histórico de pagamentos e faça o
            gerenciamento da sua conta.
          </p>
        </div>
        <PlanoDetalhes
          planoUsuario={usuario.plano}
          transacoesDoMesAtual={transacoesDoMesAtual}
        />
      </div>
    </>
  );
};
export default SubscriptionsPage;
