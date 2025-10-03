"use client";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import DialogoInserirOuAtualizarTransacao from "./upsert-transaction-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

interface PropriedadesBotaoAdicionarTransacao {
  usuarioPodeAdicionarTransacao?: boolean;
}
const AddTransactionMobile = ({
  usuarioPodeAdicionarTransacao,
}: PropriedadesBotaoAdicionarTransacao) => {
  const [dialogoEstaAberto, setDialogoEstaAberto] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="size-14 rounded-full font-bold"
              onClick={() => setDialogoEstaAberto(true)}
              disabled={!usuarioPodeAdicionarTransacao}
            >
              <Plus className="h-8 w-8 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!usuarioPodeAdicionarTransacao &&
              "Você atingiu o limite de transações. Atualize seu plano para transações ilimitadas"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogoInserirOuAtualizarTransacao
        estaAberto={dialogoEstaAberto}
        definirSeEstaAberto={setDialogoEstaAberto}
      />
    </>
  );
};
export default AddTransactionMobile;
