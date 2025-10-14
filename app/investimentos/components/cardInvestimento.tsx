import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { formatCurrency } from "@/app/_utils/currency";
import { TypeInvestimento } from "@/app/types";
import { ChartSpline, EditIcon, Minus, Plus, Target } from "lucide-react";
import { useState } from "react";

interface CardInvestimentoProps {
  investimento: TypeInvestimento;
}

export const CardInvestimento = ({ investimento }: CardInvestimentoProps) => {
  const [adicionarTransacao, setAdicionarTransacao] = useState("");

  return (
    <Dialog>
      <DialogHeader>
        <DialogTrigger>
          <Card className="space-y-4 bg-secondary/20 p-6">
            <div className="flex items-center gap-3">
              <p className="rounded-lg bg-violet-500/20 p-2 text-violet-500">
                <ChartSpline />
              </p>
              <span className="flex flex-col text-start">
                <p className="font-bold">{investimento?.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {investimento?.descricao}
                </p>
              </span>
            </div>
            <div className="flex items-center justify-between px-5">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="font-bold text-green-500">R$ 0,00</p>
            </div>
            <div className="flex items-center justify-around border-y px-5 py-2">
              <div className="flex items-center gap-3">
                <p className="font-bold text-green-500">
                  <Plus />
                </p>
                <span>
                  <p className="text-sm text-muted-foreground">Depósito</p>
                  <p className="font-bold text-green-500">R$ 0,00</p>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-red-500">
                  <Minus />{" "}
                </p>
                <span>
                  <p className="text-sm text-muted-foreground">Saída</p>
                  <p className="font-bold text-red-500">R$ 0,00</p>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-5">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target size={15} /> Meta
                </p>
                <p className="text-sm text-muted-foreground">0%</p>
              </div>
              <div className="h-2 w-full rounded-lg bg-muted-foreground/20"></div>
              <div className="flex items-center justify-between px-5">
                <p className="text-sm text-muted-foreground">R$ 0,00</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(investimento.meta)}
                </p>
              </div>
            </div>
            <p className="text-start text-sm text-muted-foreground">
              0 transação(ões)
            </p>
          </Card>
        </DialogTrigger>
      </DialogHeader>
      <DialogContent className="">
        <DialogTitle className="flex items-center gap-3">
          <p className="rounded-lg bg-violet-500/20 p-2 text-violet-500">
            <ChartSpline />
          </p>
          <span className="flex flex-col text-start">
            <p className="font-bold">Viagem</p>
          </span>
        </DialogTitle>
        <Card className="space-y-3 bg-muted/20 p-6">
          <div className="flex w-full">
            <div className="w-full">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-2xl font-black text-green-500">R$ 0,00</div>
            </div>
            <div className="w-full">
              <div className="text-sm text-muted-foreground">Transações</div>
              <div className="text-2xl font-black">0</div>
            </div>
          </div>
          <p className="border-b pb-5 text-sm text-muted-foreground">
            viagem em fevereiro
          </p>
          <div className="flex items-center justify-between px-4">
            <div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex gap-2">
                  <Target size={20} /> Meta:
                </span>
                <span className="text-sm text-muted-foreground">
                  R$ 2.000,00
                </span>
              </p>
            </div>
            <Button
              variant={"ghost"}
              className="flex gap-3 text-sm text-muted-foreground"
            >
              <EditIcon size={20} /> Editar
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Progresso</p>
            <div className="h-2 w-full rounded-lg bg-muted-foreground/20"></div>
          </div>
        </Card>
        <div className="flex w-full gap-2">
          <Button
            onClick={() => setAdicionarTransacao("DEPOSITAR")}
            className="w-full bg-green-500 font-bold hover:bg-green-600"
          >
            <Plus /> Depositar
          </Button>
          <Button
            onClick={() => setAdicionarTransacao("SACAR")}
            className="w-full border border-red-500 bg-muted/20 font-bold text-red-500 hover:bg-red-500 hover:text-red-100"
          >
            <Minus /> Sacar
          </Button>
        </div>
        <div className="space-y-4 py-4">
          <p>Histórico de Transações</p>
          <div className="flex flex-col items-center justify-center">
            <p className="text-muted-foreground">
              Nenhuma transação realizada ainda
            </p>
            <p className="text-sm text-muted-foreground">
              faça seu primeiro depósito para começar
            </p>
          </div>
          {/* formulario de transação por investimento */}
          {adicionarTransacao && (
            <>
              <div>Aqui será criado as transações {adicionarTransacao}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
