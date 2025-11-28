import { Card } from "@/app/_components/ui/card";
import { formatCurrency } from "@/app/_utils/currency";
import { TypeTransacaoInvestimento } from "@/app/types";
import { Minus, Plus } from "lucide-react";
interface CardTransacaoInvestimentoProps {
  transacao: TypeTransacaoInvestimento;
}
export const CardTransacaoInvestimento = ({
  transacao,
}: CardTransacaoInvestimentoProps) => {
  return (
    <Card className="flex items-center justify-between bg-azulMuted/50 p-3 px-5">
      <div className="flex items-center gap-5">
        <p
          className={`rounded-full ${transacao.tipo === "DEPOSITO" ? "bg-green-500/20 p-1 text-green-500" : "bg-red-500/20 p-1 text-red-500"}`}
        >
          {transacao.tipo === "DEPOSITO" ? (
            <Plus size={20} />
          ) : transacao.tipo === "RETIRADA" ? (
            <Minus size={20} />
          ) : (
            ""
          )}
        </p>
        <div>
          <p>{transacao.tipo}</p>
          <p className="text-sm text-muted-foreground">{transacao.descricao}</p>
        </div>
      </div>

      <div
        className={`${transacao.tipo === "DEPOSITO" ? "text-green-500" : "text-red-500"}`}
      >
        {formatCurrency(transacao.valor)}
      </div>
    </Card>
  );
};
