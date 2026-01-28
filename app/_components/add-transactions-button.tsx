"use client";
import {
  ArrowDownUp,
  BanknoteIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import DialogoInserirOuAtualizarTransacao from "./upsert-transaction-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "./ui/dialog";
import { AddTransacaoCartao } from "../cartao/components/addTransacaoCartao";

interface PropriedadesBotaoAdicionarTransacao {
  usuarioPodeAdicionarTransacao?: boolean;
}
const AddTransactionButton = ({
  usuarioPodeAdicionarTransacao,
}: PropriedadesBotaoAdicionarTransacao) => {
  const [dialogoEstaAberto, setDialogoEstaAberto] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirDialogCartao, setAbrirDialogCartao] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="hidden rounded-full font-bold md:flex"
              onClick={() => {
                // setDialogoEstaAberto(true)
                setAbrirModal(true);
              }}
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
      <AddTransacaoCartao
        open={abrirDialogCartao}
        onOpenChange={setAbrirDialogCartao}
      />

      <Dialog open={abrirModal} onOpenChange={setAbrirModal}>
        <DialogContent className="flex size-full max-h-[50%] min-h-[50%] min-w-[60%] max-w-[60%] flex-col">
          <DialogPortal>
            <div className="fixed inset-0 bg-black/70 transition-opacity duration-500" />
          </DialogPortal>
          <DialogHeader>
            <DialogTitle>O que deseja lançar hoje?</DialogTitle>
            <DialogDescription>
              escolhe a opção desejada para realizar a sua transação
            </DialogDescription>
          </DialogHeader>
          <div className="grid size-full grid-cols-3 gap-3 p-10">
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border bg-red-600/80 transition-all duration-300 hover:scale-105"
              onClick={() => {
                setDialogoEstaAberto(true);
                setAbrirModal(false);
              }}
            >
              <TrendingDown size={40} /> <p>Despesa</p>
            </div>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border bg-green-600/80 transition-all duration-300 hover:scale-105"
              onClick={() => {
                setDialogoEstaAberto(true);
                setAbrirModal(false);
              }}
            >
              <TrendingUp size={40} /> <p>Receitas</p>
            </div>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border bg-primary/80 transition-all duration-300 hover:scale-105"
              onClick={() => {
                setAbrirDialogCartao(true);
                setAbrirModal(false);
              }}
            >
              <BanknoteIcon size={40} /> <p>Despesa Cartão</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddTransactionButton;
