import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, X } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transaction";
import { cookies } from "next/headers";

const SubscriptionsPage = async () => {
  const cookieStore = cookies();
  const userIdString = cookieStore.get("userId")?.value;
  const userId = userIdString ? Number(userIdString) : null;
  // const { userId } = await useAuth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }
  if (!userId) {
    redirect("/login");
  }

  const currentMonthTransactions = await getCurrentMonthTransactions();

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Assinatura</h1>
        <div className="flex gap-6">
          <Card className="w-[450px]">
            <CardHeader className="border-b border-solid py-8">
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
                <p>
                  Apenas 10 transações por mês ({currentMonthTransactions}/10)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <X className="" />
                <p>Relatório de IA</p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-[450px]">
            <CardHeader className="relative border-b border-solid py-8">
              <Badge className="absolute left-4 top-4 bg-primary/20 text-primary">
                Ativo
              </Badge>

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
              <AcquirePlanButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
export default SubscriptionsPage;
