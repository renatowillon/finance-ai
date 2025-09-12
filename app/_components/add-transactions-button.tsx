"use client";
import { ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import DialogoInserirOuAtualizarTransacao from "./upsert-transaction-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

interface PropriedadesBotaoAdicionarTransacao {
  usuarioPodeAdicionarTransacao?: boolean;
}
const AddTransactionButton = ({
  usuarioPodeAdicionarTransacao,
}: PropriedadesBotaoAdicionarTransacao) => {
  const [dialogoEstaAberto, setDialogoEstaAberto] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogoEstaAberto(true)}
              disabled={!usuarioPodeAdicionarTransacao}
            >
              Adicionar Transação <ArrowDownUp />
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
export default AddTransactionButton;
