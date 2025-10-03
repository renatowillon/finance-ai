import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, X } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transaction";
import { cookies } from "next/headers";
import { obterUsuarioPorToken } from "../_lib/session";
import PlanoAdquirido from "./_components/planoAdquirido";

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
        <h1 className="text-2xl font-bold">Assinatura</h1>
        <div className="flex flex-col gap-6 sm:flex-row">
          <Card className="sm:w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">
              {usuario.plano === "FREE" && (
                <Badge className="absolute left-4 top-4 bg-primary/20 text-primary">
                  Ativo
                </Badge>
              )}
              <h2 className="text-center text-2xl font-semibold">
                Plano Básico
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">0</span>
                <span className="text-2xl text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Apenas 10 transações por mês ({transacoesDoMesAtual}/10)</p>
              </div>
              <div className="flex items-center gap-2">
                <X className="" />
                <p>Relatório de IA</p>
              </div>
            </CardContent>
          </Card>
          <Card className="sm:w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">
              {usuario.plano === "PREMIUM" && (
                <Badge className="absolute left-4 top-4 bg-primary/20 text-primary">
                  Ativo
                </Badge>
              )}

              <h2 className="pointer-events-none text-center text-2xl font-semibold">
                Plano Premium
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">R$</span>
                <span className="text-6xl font-semibold">19</span>
                <span className="text-2xl text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Transações ilimitadas</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Relatório de IA</p>
              </div>
              {usuario.plano === "FREE" && <AcquirePlanButton />}
              {usuario.plano === "PREMIUM" && <PlanoAdquirido />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
export default SubscriptionsPage;
