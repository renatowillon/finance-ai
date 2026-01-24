"use client";
import { Banknote, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import DialogoInserirOuAtualizarTransacao from "./upsert-transaction-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { AddTransacaoCartao } from "../cartao/components/addTransacaoCartao";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface PropriedadesBotaoAdicionarTransacao {
  usuarioPodeAdicionarTransacao?: boolean;
}
const AddTransactionMobile = ({
  usuarioPodeAdicionarTransacao,
}: PropriedadesBotaoAdicionarTransacao) => {
  const [dialogoEstaAberto, setDialogoEstaAberto] = useState(false);
  const [abrirDialogCartao, setAbrirDialogCartao] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute flex gap-5 transition-all duration-300 ${
            openMenu
              ? "-translate-y-14 opacity-100"
              : "pointer-events-none translate-y-0 opacity-0"
          } `}
        ></div>
        <Sheet open={openMenu} onOpenChange={setOpenMenu}>
          <SheetTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="z-10 size-14 rounded-full"
                    onClick={() => setOpenMenu(!openMenu)}
                    disabled={!usuarioPodeAdicionarTransacao}
                  >
                    <Plus
                      className={`h-8 w-8 transition-transform ${
                        openMenu ? "rotate-45" : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!usuarioPodeAdicionarTransacao &&
                    "Você atingiu o limite de transações. Atualize seu plano para transações ilimitadas"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle>O que deseja lançar hoje?</SheetTitle>
            </SheetHeader>
            <div className="mt-5 space-y-3">
              <Button
                onClick={() => setDialogoEstaAberto(true)}
                disabled={!usuarioPodeAdicionarTransacao}
                className="flex w-full items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted"
              >
                <TrendingDown /> Despesa
              </Button>
              <Button
                onClick={() => setDialogoEstaAberto(true)}
                disabled={!usuarioPodeAdicionarTransacao}
                className="flex w-full items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted"
              >
                <TrendingUp /> Receitas
              </Button>
              <Button
                onClick={() => setAbrirDialogCartao(!abrirDialogCartao)}
                className="flex w-full items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted"
              >
                <Banknote /> Despesa Cartão
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AddTransacaoCartao
        open={abrirDialogCartao}
        onOpenChange={setAbrirDialogCartao}
      />
      <DialogoInserirOuAtualizarTransacao
        estaAberto={dialogoEstaAberto}
        definirSeEstaAberto={setDialogoEstaAberto}
      />
    </>
  );
};
export default AddTransactionMobile;
