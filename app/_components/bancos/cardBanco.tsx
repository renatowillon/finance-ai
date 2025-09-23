import { Building2, EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypeBanco } from "@/app/types";
import { formatCurrency } from "@/app/_utils/currency";
import { ROTULOS_TIPO_CONTA } from "@/app/_constants/transactions";

interface Props {
  data: TypeBanco;
}

export const CardBanco = ({ data }: Props) => {
  return (
    <>
      <Card
        key={data.id}
        className={`space-y-4 p-8`}
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)), ${data.cor}30)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${data.cor}30`,
                color: `${data.cor}`,
              }}
            >
              <Building2 />
            </span>
            <div>
              <p className="text-lg font-bold">{data.nome}</p>
              <p className="text-sm text-gray-500">
                {ROTULOS_TIPO_CONTA[data.tipo]}
              </p>
            </div>
          </div>
          <Button className="bg-secondary/25 hover:bg-secondary">
            <EllipsisVertical />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Saldo Atual</div>
          <div className="text.lg font-bold text-green-500">
            {formatCurrency(data.saldoAtual)}
          </div>
        </div>
      </Card>
    </>
  );
};
