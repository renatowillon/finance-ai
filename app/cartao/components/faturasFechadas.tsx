import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
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
                    <Lock size={25} /> Janeiro 2026 <Badge>Fechada</Badge>
                  </div>
                  <div className="flex items-center gap-3 pl-3 text-sm text-muted-foreground">
                    <Calendar size={20} /> Vence dia 17 2 transações
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black">R$ 200,00</div>
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
