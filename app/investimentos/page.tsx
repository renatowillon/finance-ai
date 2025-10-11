"use client";

import { Plus } from "lucide-react";
import { InfoSemDados } from "../_components/bancos/infoSemDados";
import { Button } from "../_components/ui/button";
import { toast } from "sonner";
// import { CardInvestimento } from "./components/cardInvestimento";

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

      {/* inicio de implementação de card de investimento */}
      {/* <div className="grid-cols-1 md:grid md:grid-cols-2 lg:grid-cols-3">
        <CardInvestimento />
      </div> */}
    </div>
  );
};
export default Investimentos;
