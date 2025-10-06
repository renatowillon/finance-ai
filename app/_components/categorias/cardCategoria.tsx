import { EllipsisVertical, Tags } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TypeCategoria } from "@/app/types";

import { ROTULO_TIPO_CATEGORIA } from "@/app/_constants/transactions";
import { Badge } from "../ui/badge";

interface Props {
  dataCategoria: TypeCategoria;
  editCategoria: (banco: TypeCategoria) => void;
}

export const CardCategoria = ({ dataCategoria, editCategoria }: Props) => {
  return (
    <>
      <Card key={dataCategoria.id} className={`space-y-4 p-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="rounded-lg p-2">
              <Tags />
            </span>
            <div className={`w-full`}>
              <p className="w-full truncate text-sm font-bold">
                {dataCategoria.nome}
              </p>
              <Badge
                className={`w-20 items-center justify-center ${ROTULO_TIPO_CATEGORIA[dataCategoria.tipo] === "Despesas" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                {ROTULO_TIPO_CATEGORIA[dataCategoria.tipo]}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => editCategoria(dataCategoria)}
              className="bg-secondary/25 hover:bg-secondary"
            >
              <EllipsisVertical />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
