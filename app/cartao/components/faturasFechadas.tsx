"use client";

import { InfoSemDados } from "@/app/_components/bancos/infoSemDados";
import { MoneyInput } from "@/app/_components/money-input";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { formatCurrency } from "@/app/_utils/currency";
import { dataCompetenciaUtc, dataFormatada } from "@/app/_utils/functions";
import { fetchBanco } from "@/app/fetche/bancoFetch";
import { PegarFaturas } from "@/app/fetche/faturaFetch";
import { pegarTransacaoFatura } from "@/app/fetche/transacaoFaturaFetch";
import { useMutations } from "@/app/mutetions/fecharFaturaMutation";
import { TypeBanco, TypeFaturaCartao, TypeTransacaoCartao } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const FaturasFechadas = () => {
  const [faturaId, setFaturaId] = useState("");
  const [openModalTransacoes, setOpenModalTransacoes] = useState(false);
  const [openModalPagamento, setOpenModalPagamento] = useState(false);
  const [faturaSelecionada, setFaturaSelecionada] =
    useState<TypeFaturaCartao | null>(null);
  const [valorPagamento, setValorPagamento] = useState("");
  const [bancoId, setBancoId] = useState<number | null>(null);

  const params = useParams();
  const cartaoId = String(params.id);

  const { data: faturasCartao } = useQuery({
    queryKey: ["fatura-cartao", cartaoId],
    queryFn: () => PegarFaturas(cartaoId),
  });

  const { data: bancos } = useQuery({
    queryKey: ["bancos"],
    queryFn: fetchBanco,
    staleTime: 5 * 60 * 1000,
  });

  const { data: transacaoFatura } = useQuery({
    queryKey: ["transacao-fatura", faturaId],
    queryFn: () => pegarTransacaoFatura(faturaId),
    enabled: !!faturaId,
  });

  const { pagamentoFaturaMutation } = useMutations();

  const faturasAguardandoPagamento = useMemo(
    () =>
      (faturasCartao ?? []).filter(
        (fatura: TypeFaturaCartao) => fatura.fechada && !fatura.paga,
      ),
    [faturasCartao],
  );

  const valorPagamentoNumero = Number(
    String(valorPagamento || "0").includes(",")
      ? String(valorPagamento || "0")
          .replace(/\./g, "")
          .replace(",", ".")
      : String(valorPagamento || "0"),
  );

  const valorRestante = useMemo(() => {
    if (!faturaSelecionada) return 0;
    return Number(
      (
        Number(faturaSelecionada.valorTotal) -
        Number(faturaSelecionada.valorPago || 0)
      ).toFixed(2),
    );
  }, [faturaSelecionada]);

  const abrirModalPagamento = (fatura: TypeFaturaCartao) => {
    setFaturaSelecionada(fatura);
    setValorPagamento(
      String(Number(fatura.valorTotal) - Number(fatura.valorPago || 0)),
    );
    setBancoId(null);
    setOpenModalPagamento(true);
  };

  const confirmarPagamento = () => {
    if (!faturaSelecionada) return;

    if (!bancoId) {
      toast.error("Selecione o banco para lancar o pagamento.");
      return;
    }

    if (!valorPagamentoNumero || valorPagamentoNumero <= 0) {
      toast.error("Informe um valor valido para pagamento.");
      return;
    }

    if (valorPagamentoNumero > valorRestante) {
      toast.error("O valor nao pode ser maior que o restante da fatura.");
      return;
    }

    pagamentoFaturaMutation.mutate(
      {
        faturaId: faturaSelecionada.id,
        valorPago: String(valorPagamentoNumero),
        bancoId,
      },
      {
        onSuccess: () => {
          toast.success("Pagamento registrado com sucesso.");
          setOpenModalPagamento(false);
          setFaturaSelecionada(null);
          setValorPagamento("");
          setBancoId(null);
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao registrar pagamento.";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="w-full space-y-3 rounded-lg border p-5">
        {faturasAguardandoPagamento.length <= 0 ? (
          <InfoSemDados
            titulo="Nenhuma fatura aguardando pagamento"
            subtitulo="Quando houver faturas fechadas em aberto elas aparecerao aqui"
          />
        ) : (
          <>
            <p>Faturas aguardando pagamento</p>
            <div className="rounded-lg border-l-8 border-primary bg-azulMuted p-3">
              {faturasAguardandoPagamento.map((fatura: TypeFaturaCartao) => {
                const restante = Number(
                  (
                    Number(fatura.valorTotal) - Number(fatura.valorPago || 0)
                  ).toFixed(2),
                );

                return (
                  <div
                    key={fatura.id}
                    className="flex items-center justify-between border-b py-3 last:border-b-0"
                  >
                    <div className="flex space-x-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-lg font-black">
                          <Lock size={25} />{" "}
                          {dataCompetenciaUtc(fatura.competencia)}{" "}
                          <Badge>Fechada</Badge>
                        </div>
                        <div className="flex items-center gap-3 pl-3 text-xs text-muted-foreground">
                          <Calendar size={20} />
                          <p>
                            vencimento dia {dataFormatada(fatura.vencimento)}
                          </p>
                          <div className="text-2xl font-black md:hidden">
                            {formatCurrency(restante)}
                          </div>
                        </div>
                        <div className="pl-3 text-xs text-muted-foreground">
                          Pago: {formatCurrency(Number(fatura.valorPago || 0))}{" "}
                          de {formatCurrency(Number(fatura.valorTotal))}
                        </div>
                        <div className="flex w-full items-center justify-center gap-3 md:hidden">
                          <Button
                            variant={"outline"}
                            onClick={() => {
                              setFaturaId(fatura.id);
                              setOpenModalTransacoes(true);
                            }}
                          >
                            Ver Transacoes
                          </Button>
                          <Button onClick={() => abrirModalPagamento(fatura)}>
                            Pagar
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden items-center gap-3 md:flex">
                      <div className="text-right">
                        <div className="text-2xl font-black">
                          {formatCurrency(restante)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Restante
                        </div>
                      </div>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setFaturaId(fatura.id);
                          setOpenModalTransacoes(true);
                        }}
                      >
                        Ver Transacoes
                      </Button>
                      <Button onClick={() => abrirModalPagamento(fatura)}>
                        Pagar
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Dialog
                open={openModalTransacoes}
                onOpenChange={setOpenModalTransacoes}
              >
                <DialogContent className="max-h-[90vh] max-w-2xl">
                  <DialogTitle>Transacoes da Fatura</DialogTitle>
                  <ScrollArea className="max-h-[80vh] rounded-md py-1 pr-3">
                    {transacaoFatura?.map((transacao: TypeTransacaoCartao) => (
                      <div
                        key={transacao.id}
                        className="mt-3 flex items-center justify-between rounded-2xl border bg-azulMuted px-6 py-3 shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-muted-foreground">
                            {transacao.descricao}
                          </h3>

                          <span className="mt-1 text-sm text-gray-400">
                            {dataFormatada(transacao?.dataCompra as Date)}
                          </span>
                        </div>

                        <div className="text-lg font-bold text-muted-foreground">
                          {formatCurrency(transacao.valor)}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog
                open={openModalPagamento}
                onOpenChange={setOpenModalPagamento}
              >
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Registrar pagamento da fatura</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="rounded-md border bg-muted/30 p-3 text-sm">
                      <p>
                        Competencia:{" "}
                        {faturaSelecionada
                          ? dataCompetenciaUtc(faturaSelecionada.competencia)
                          : "-"}
                      </p>
                      <p>
                        Restante:{" "}
                        <strong>{formatCurrency(valorRestante)}</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Valor do pagamento</p>
                      <MoneyInput
                        value={valorPagamento}
                        placeholder="Digite o valor"
                        onValueChange={({ value }) =>
                          setValorPagamento(value ?? "")
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Banco</p>
                      <Select
                        value={bancoId ? String(bancoId) : ""}
                        onValueChange={(value) => setBancoId(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {(bancos ?? []).map((banco: TypeBanco) => (
                            <SelectItem key={banco.id} value={String(banco.id)}>
                              {banco.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpenModalPagamento(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={confirmarPagamento}
                      disabled={pagamentoFaturaMutation.isPending}
                    >
                      Confirmar pagamento
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
