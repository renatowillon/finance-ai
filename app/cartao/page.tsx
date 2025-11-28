import { Plus } from "lucide-react";
import { Button } from "../_components/ui/button";
import { Card } from "../_components/ui/card";

const Cartao = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Cartões de Crédito</h1>
        <Button>
          <Plus /> Adicionar Cartão
        </Button>
      </div>
      <Card className="bg-azulMuted"></Card>
    </div>
  );
};
export default Cartao;
