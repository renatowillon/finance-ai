import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { formatCurrency } from "@/app/_utils/currency";
import { dataFormatada, formatarCompetencia } from "@/app/_utils/functions";
// import { dataFormatada } from "@/app/_utils/functions";
import { PegarFaturas } from "@/app/fetche/faturaFetch";
import { TypeFaturaCartao } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Lock } from "lucide-react";
import { useParams } from "next/navigation";

export const FaturasFechadas = () => {
  const params = useParams();
  const cartaoId = String(params.id);

  const { data: faturasCartao } = useQuery({
    queryKey: ["fatura-cartao"],
    queryFn: () => PegarFaturas(cartaoId),
  });

  return (
    <div className="space-y-5">
      <div className="w-full space-y-3 rounded-lg border p-5">
        <p>Faturas Fechadas</p>
        <div className="rounded-lg border bg-azulMuted p-3">
          {faturasCartao?.map((fatura: TypeFaturaCartao) => (
            <div key={fatura.id} className="flex items-center justify-between">
              <div className="flex space-x-3">
                <div className="rounded-full bg-primary p-1" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-lg font-black">
                    <Lock size={25} /> {formatarCompetencia(fatura.competencia)}{" "}
                    <Badge>Fechada</Badge>
                  </div>
                  <div className="flex items-center gap-3 pl-3 text-xs text-muted-foreground">
                    <Calendar size={20} />{" "}
                    <p>vencimento dia {dataFormatada(fatura.vencimento)}</p>
                    <p>2 transações</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black">
                  {formatCurrency(fatura.valorTotal)}
                </div>
                <Button variant={"outline"}>Ver Transações</Button>
                <Button>Pagar</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
