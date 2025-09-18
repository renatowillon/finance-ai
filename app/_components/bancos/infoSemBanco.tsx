import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface Props {
  onClick: () => void;
}

export const InfoSemBanco = ({ onClick }: Props) => {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 bg-secondary/25 p-10">
      <p className="text-xl font-semibold">Nenhum banco cadastrado</p>
      <p className="text-base text-gray-500">
        Comece adicionando sua primeira conta bancária
      </p>
      <Button onClick={onClick}>
        <Plus /> Adicionar Banco
      </Button>
    </Card>
  );
};
