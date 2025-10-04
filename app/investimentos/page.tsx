"use client";

import { Plus } from "lucide-react";
import { InfoSemDados } from "../_components/bancos/infoSemDados";
import { Button } from "../_components/ui/button";
import { toast } from "sonner";

const Investimentos = () => {
  function alerta() {
    toast.info("implementação em andamento 🥳");
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Investimentos</h1>
        <Button onClick={alerta}>
          <Plus /> Adicionar Investimento
        </Button>
      </div>

      <InfoSemDados
        titulo="Nenhum investimento cadastrado"
        subtitulo="Comece adicionando seu primeira plano de investimento"
        tituloBotao="Adicionar Investimento"
        onClick={alerta}
      />
    </div>
  );
};
export default Investimentos;
