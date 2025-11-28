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
import {
  TypeInvestimento,
  TypeTransacaoInvestimento,
  TypeTransacaoInvestimentoInput,
} from "@/app/types";
import { ChartSpline, EditIcon, Minus, Plus, Target } from "lucide-react";
import { useState } from "react";
import { FormTransacaoInvestimentos } from "./formTransacaoInvestimento";
import { useQuery } from "@tanstack/react-query";
import {
  calcularResumo,
  pegarTransacaoInvestimento,
} from "@/app/fetche/transacaoInvestimentoFetch";
import { CardTransacaoInvestimento } from "./cardTransacaoInvestimento";
import { InfoSemDados } from "@/app/_components/bancos/infoSemDados";
import { useMutations } from "@/app/mutetions/transacaoInvestimentoMutation";

interface CardInvestimentoProps {
  investimento: TypeInvestimento;
  editInvestimento: (investimento: TypeInvestimento) => void;
}

export const CardInvestimento = ({
  investimento,
  editInvestimento,
}: CardInvestimentoProps) => {
  const [adicionarTransacao, setAdicionarTransacao] = useState("");
  const [open, setOpen] = useState(false);
  const { criarMutation } = useMutations();

  const { data } = useQuery({
    queryKey: ["transacaoInvestimento", investimento.id],
    queryFn: () => pegarTransacaoInvestimento(investimento.id),
  });

  const onSubmitTransacao = (values: TypeTransacaoInvestimentoInput) => {
    const transacaoInvestimento: TypeTransacaoInvestimentoInput = {
      ...values,
    };
    criarMutation.mutate(transacaoInvestimento);
  };

  const resumoTransacao = calcularResumo(data || []);
  const resumoProgresso =
    (resumoTransacao.saldoTotal / investimento.meta) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader>
        <DialogTrigger>
          <Card className="space-y-4 bg-azulMuted/50 p-6">
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
              <p className="font-bold text-green-500">
                {formatCurrency(resumoTransacao.saldoTotal)}
              </p>
            </div>
            <div className="flex items-center justify-around border-y px-5 py-2">
              <div className="flex items-center gap-3">
                <p className="font-bold text-green-500">
                  <Plus />
                </p>
                <span>
                  <p className="text-sm text-muted-foreground">Depósito</p>
                  <p className="font-bold text-green-500">
                    {formatCurrency(resumoTransacao.totalDepositos)}
                  </p>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-red-500">
                  <Minus />{" "}
                </p>
                <span>
                  <p className="text-sm text-muted-foreground">Saída</p>
                  <p className="font-bold text-red-500">
                    {formatCurrency(resumoTransacao.totalRetiradas)}
                  </p>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-5">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target size={15} /> Meta
                </p>
                <p className="text-sm text-muted-foreground">
                  {resumoProgresso.toFixed(0)}%
                </p>
              </div>
              <div className="relative">
                <div
                  className={`absolute h-2 rounded-lg bg-green-500`}
                  style={{ width: `${resumoProgresso}%` }}
                />
                <div className="absolute h-2 w-full rounded-lg bg-muted-foreground/20" />
              </div>
              <div className="flex items-center justify-between px-5">
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(resumoTransacao.saldoTotal)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(investimento.meta)}
                </p>
              </div>
            </div>
            <p className="text-start text-sm text-muted-foreground">
              {resumoTransacao.qtdTransacoes} transação(ões)
            </p>
          </Card>
        </DialogTrigger>
      </DialogHeader>
      <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-2xl">
        <DialogTitle className="flex items-center gap-3">
          <p className="rounded-lg bg-violet-500/20 p-2 text-violet-500">
            <ChartSpline />
          </p>
          <span className="flex flex-col text-start">
            <p className="font-bold">{investimento.nome}</p>
          </span>
        </DialogTitle>
        <Card className="space-y-3 bg-azulMuted p-6">
          <div className="flex w-full">
            <div className="w-full">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-2xl font-black text-green-500">
                {formatCurrency(resumoTransacao.saldoTotal)}
              </div>
            </div>
            <div className="w-full">
              <div className="text-sm text-muted-foreground">Transações</div>
              <div className="text-2xl font-black">
                {resumoTransacao.qtdTransacoes}
              </div>
            </div>
          </div>
          <p className="border-b pb-5 text-sm text-muted-foreground">
            {investimento.descricao}
          </p>
          <div className="flex items-center justify-between px-4">
            <div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex gap-2">
                  <Target size={20} /> Meta:
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(investimento.meta)}
                </span>
              </p>
            </div>
            <Button
              variant={"ghost"}
              className="flex gap-3 text-sm text-muted-foreground"
              onClick={() => {
                editInvestimento(investimento);
                setOpen(false);
              }}
            >
              <EditIcon size={20} /> Editar
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Progresso</p>

            <div className="relative">
              <div
                className={`absolute h-2 rounded-lg bg-green-500`}
                style={{ width: `${resumoProgresso}%` }}
              />
              <div className="absolute h-2 w-full rounded-lg bg-muted-foreground/20" />
            </div>
          </div>
        </Card>
        <div className="flex w-full gap-2">
          <Button
            onClick={() => setAdicionarTransacao("DEPOSITAR")}
            className={`w-full ${adicionarTransacao === "DEPOSITAR" ? "bg-green-500 hover:bg-green-600" : "border border-green-500 bg-muted/20 text-green-500"} font-bold hover:bg-green-600 hover:text-green-100`}
          >
            <Plus /> Depositar
          </Button>
          <Button
            onClick={() => setAdicionarTransacao("SACAR")}
            className={`w-full border ${adicionarTransacao === "SACAR" ? "bg-red-500 font-bold text-red-100 hover:bg-red-500 hover:text-red-100" : "border-red-500 bg-muted/20 font-bold text-red-500 hover:bg-red-500 hover:text-red-100"} `}
          >
            <Minus /> Sacar
          </Button>
        </div>
        <div className="space-y-4 py-4">
          <p>Histórico de Transações</p>
          {/* formulario de transação por investimento */}
          {adicionarTransacao && (
            <>
              <FormTransacaoInvestimentos
                onSubmit={onSubmitTransacao}
                cancelar={() => setAdicionarTransacao("")}
                depositarOuSacar={adicionarTransacao}
                investimentoSelecionado={investimento}
              />
            </>
          )}
          <div className="space-y-2">
            {data?.map((transacao: TypeTransacaoInvestimento) => (
              <CardTransacaoInvestimento
                key={transacao.id}
                transacao={transacao}
              />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center">
            {data?.length < 1 && (
              <InfoSemDados
                titulo="Nenhuma transação realizada ainda"
                subtitulo="faça seu primeiro depósito para começar"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
