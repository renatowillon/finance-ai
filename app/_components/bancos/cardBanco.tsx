import { Building2, EllipsisVertical, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypeBanco } from "@/app/types";
import { formatCurrency } from "@/app/_utils/currency";
import { ROTULOS_TIPO_CONTA } from "@/app/_constants/transactions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  dataBanco: TypeBanco;
}

export const CardBanco = ({ dataBanco }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["saldo", dataBanco.id],
    queryFn: async () => {
      const res = await axios.get(`/api/bancos/saldo/${dataBanco.id}`);
      return res.data as number;
    },
  });

  return (
    <>
      <Card
        key={dataBanco.id}
        className={`space-y-4 p-8`}
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)), ${dataBanco.cor}30)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${dataBanco.cor}30`,
                color: `${dataBanco.cor}`,
              }}
            >
              <Building2 />
            </span>
            <div>
              <p className="text-lg font-bold">{dataBanco.nome}</p>
              <p className="text-sm text-gray-500">
                {ROTULOS_TIPO_CONTA[dataBanco.tipo]}
              </p>
            </div>
          </div>
          <Button className="bg-secondary/25 hover:bg-secondary">
            <EllipsisVertical />
          </Button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-lg text-gray-500">Saldo Atual</div>
            <div className="text.lg font-bold text-green-500">
              {data && <>{formatCurrency(Number(data?.toFixed(2)))}</>}
              {isLoading && (
                <>
                  <p className="flex gap-2 text-sm font-semibold">
                    <Loader2 className="animate-spin duration-1000" />
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Saldo Inicial</div>
            <div className="text-sm font-bold text-green-500">
              {formatCurrency(dataBanco.saldoInicial)}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
