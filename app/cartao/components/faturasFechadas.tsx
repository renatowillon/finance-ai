"use client";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { formatCurrency } from "@/app/_utils/currency";
import { dataFormatada, formatarCompetencia } from "@/app/_utils/functions";
// import { dataFormatada } from "@/app/_utils/functions";
import { PegarFaturas } from "@/app/fetche/faturaFetch";
import { pegarTransacaoFatura } from "@/app/fetche/transacaoFaturaFetch";
import { TypeFaturaCartao, TypeTransacaoCartao } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export const FaturasFechadas = () => {
  const [faturaId, setFaturaId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const params = useParams();
  const cartaoId = String(params.id);

  const { data: faturasCartao } = useQuery({
    queryKey: ["fatura-cartao"],
    queryFn: () => PegarFaturas(cartaoId),
  });

  const { data: transacaoFatura } = useQuery({
    queryKey: ["transacao-fatura", faturaId],
    queryFn: () => pegarTransacaoFatura(faturaId),
    enabled: !!faturaId,
  });

  return (
    <div className="space-y-5">
      <div className="w-full space-y-3 rounded-lg border p-5">
        <p>Faturas Fechadas</p>
        <div className="rounded-lg border bg-azulMuted p-3">
          {faturasCartao?.map((fatura: TypeFaturaCartao) => (
            <div key={fatura.id} className="flex items-center justify-between">
              <div className="flex space-x-3">
                <div className="rounded-full bg-primary p-1" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-lg font-black">
                    <Lock size={25} /> {formatarCompetencia(fatura.competencia)}{" "}
                    <Badge>Fechada</Badge>
                  </div>
                  <div className="flex items-center gap-3 pl-3 text-xs text-muted-foreground">
                    <Calendar size={20} />{" "}
                    <p>vencimento dia {dataFormatada(fatura.vencimento)}</p>
                    <div className="text-2xl font-black">
                      {formatCurrency(fatura.valorTotal)}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center gap-3 md:hidden">
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setFaturaId(fatura.id);
                        setOpenModal(!openModal);
                      }}
                    >
                      Ver Transações
                    </Button>
                    <Button>Pagar</Button>
                  </div>
                </div>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <div className="text-2xl font-black">
                  {formatCurrency(fatura.valorTotal)}
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setFaturaId(fatura.id);
                    setOpenModal(!openModal);
                  }}
                >
                  Ver Transações
                </Button>
                <Button>Pagar</Button>
              </div>
            </div>
          ))}
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="max-h-[90vh] max-w-2xl">
              <DialogTitle>Transações da Fatura</DialogTitle>
              {transacaoFatura?.map((transacao: TypeTransacaoCartao) => (
                <div
                  key={transacao.id}
                  className="flex items-center justify-between rounded-2xl border bg-azulMuted px-6 py-3 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      {transacao.descricao}
                    </h3>

                    <span className="mt-1 text-sm text-gray-400">
                      {dataFormatada(transacao?.dataCompra as Date)}
                    </span>
                  </div>

                  <div className={`text-lg font-bold text-muted-foreground`}>
                    {formatCurrency(transacao.valor)}
                  </div>
                </div>
              ))}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
