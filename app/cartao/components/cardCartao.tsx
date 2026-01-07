"use client";
import { Card } from "@/app/_components/ui/card";
import { TypeCartaoCredito } from "@/app/types";
import { Building2, ChevronRight, EllipsisVertical } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { formatCurrency } from "@/app/_utils/currency";
import { useRouter } from "next/navigation";

interface Props {
  dataCartao: TypeCartaoCredito;
  editCartao: (cartao: TypeCartaoCredito) => void;
}

export const CardCartao = ({ dataCartao, editCartao }: Props) => {
  const route = useRouter();
  return (
    <>
      <Card
        key={dataCartao.id}
        className={`space-y-4 p-8`}
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)), ${dataCartao.cor}30)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${dataCartao.cor}30`,
                color: `${dataCartao.cor}`,
              }}
            >
              <Building2 />
            </span>
            <div>
              <p className="text-lg font-bold">{dataCartao.nome}</p>
            </div>
          </div>
          <Button
            onClick={() => editCartao(dataCartao)}
            className="bg-secondary/25 hover:bg-secondary"
          >
            <EllipsisVertical />
          </Button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-lg text-gray-500">Limite Cartão</div>
            <div className={`text.lg font-bold`}>
              {formatCurrency(dataCartao.limite)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-md text-gray-500">Melhor dia de Compra</div>
            <div className="text-md flex items-center gap-3 font-bold text-green-500">
              {dataCartao.diaFechamento}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-md text-gray-500">Vencimento</div>
            <div className="text-md font-bold text-green-500">
              {dataCartao.diaVencimento}
            </div>
          </div>
        </div>
        <div className="flex">
          <Button
            className="w-full"
            onClick={() => route.push(`cartao/${dataCartao.id}`)}
          >
            Ver Faturas <ChevronRight />
          </Button>
        </div>
      </Card>
    </>
  );
};
