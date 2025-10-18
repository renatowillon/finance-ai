import { Building2, Loader2 } from "lucide-react";

import { Card } from "../ui/card";
import { TypeBanco } from "@/app/types";
import { formatCurrency } from "@/app/_utils/currency";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  dataBanco: TypeBanco;
}

export const CardBancoPequeno = ({ dataBanco }: Props) => {
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
        className={`w-full flex-grow basis-20 justify-between space-y-1 p-4`}
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)), ${dataBanco.cor}30)`,
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="rounded-sm p-2"
              style={{
                backgroundColor: `${dataBanco.cor}30`,
                color: `${dataBanco.cor}`,
              }}
            >
              <Building2 size={15} />
            </span>
            <div>
              <p className="text-base font-semibold text-muted-foreground">
                {dataBanco.nome}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex flex-col items-center justify-between rounded-lg">
            <div
              className={`text-lg font-bold ${Number(data) >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {data !== undefined && (
                <p>{formatCurrency(Number(data?.toFixed(2)))}</p>
              )}
              {isLoading && (
                <>
                  <p
                    className={`flex gap-2 text-sm font-semibold text-green-500`}
                  >
                    <Loader2 className="animate-spin duration-1000" />
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
