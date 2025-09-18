import { Building2, EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypeBanco } from "@/app/types";
import { formatCurrency } from "@/app/_utils/currency";

interface Props {
  data: TypeBanco;
}

export const CardBanco = ({ data }: Props) => {
  return (
    <>
      <Card key={data.id} className="space-y-4 bg-secondary/25 p-8 lg:w-1/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="rounded-lg bg-primary/20 p-2 text-primary/80">
              <Building2 />
            </span>
            <div>
              <p className="text-lg font-bold">{data.nome}</p>
              <p className="text-sm text-gray-500">{data.tipo}</p>
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
