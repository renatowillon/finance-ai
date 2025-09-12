import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
//import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { ROTULOS_CATEGORIAS_TRANSACAO } from "@/app/_constants/transactions";
import { TotalDespesaPorCategoria } from "@/app/_data/get-dashboard/types";

interface PropriedadesDespesasPorCategoria {
  expensesPerCategory: TotalDespesaPorCategoria[];
}
const ExpensesPerCategory = ({
  expensesPerCategory,
}: PropriedadesDespesasPorCategoria) => {
  return (
    <ScrollArea className="col-span-2 h-full rounded-md border pb-6">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por categoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {expensesPerCategory.map((categoria) => (
          <div key={categoria.categoria} className="space-y-2">
            <div className="flex w-full justify-between">
              <p className="text-sm font-bold">
                {ROTULOS_CATEGORIAS_TRANSACAO[categoria.categoria]}
              </p>
              <p className="text-sm font-bold">
                {categoria.porcentagemDoTotal}%
              </p>
            </div>
            <Progress value={categoria.porcentagemDoTotal} />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};
export default ExpensesPerCategory;
