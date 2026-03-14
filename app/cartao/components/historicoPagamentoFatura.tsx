"use client";

import { excluirTransacao } from "@/app/_actions/delete-transaction";
import { InfoSemDados } from "@/app/_components/bancos/infoSemDados";
import { DialogConfirm } from "@/app/_components/dialogConfirm";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { formatCurrency } from "@/app/_utils/currency";
import { dataCompetenciaUtc, dataFormatada } from "@/app/_utils/functions";
import {
  AtualizarFaturaQuandoDeletarPagamento,
  pegarHistoricoFatura,
} from "@/app/fetche/faturaFetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PagamentoFaturaHistorico {
  id: string;
  name: string;
  amount: number;
  date: Date;
  transactionBanco: {
    id: number;
    nome: string;
  };
  faturaCartao: {
    id: string;
    competencia: Date;
    valorTotal: number;
    valorPago: number;
    paga: boolean;
  };
}

export const HistoricoPagamentoFatura = () => {
  const params = useParams();
  const cartaoId = String(params.id);
  const [openModal, setOpenModal] = useState(false);
  const queryCliente = useQueryClient();

  const { data: historico = [], isLoading } = useQuery({
    queryKey: ["historico-pagamento-fatura", cartaoId],
    queryFn: () => pegarHistoricoFatura(cartaoId),
  });

  if (isLoading) {
    return <div className="rounded-lg border p-5">Carregando historico...</div>;
  }

  if (historico.length === 0) {
    return (
      <div className="rounded-lg border p-5">
        <InfoSemDados
          titulo="Nenhum pagamento registrado"
          subtitulo="Pagamentos parciais e totais de fatura aparecerao aqui"
        />
      </div>
    );
  }

  async function deletarPagamento(id: string) {
    // Lógica para deletar o pagamento usando o ID
    try {
      await excluirTransacao(id);
      await queryCliente.invalidateQueries({
        queryKey: ["historico-pagamento-fatura", cartaoId],
      });
      console.log("Deletar pagamento com ID:", id);
      toast.success("Pagamento deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar pagamento: ", error);
      toast.error("Erro ao deletar pagamento.");
    }
  }
  async function atualizarFatura(faturaId: string) {
    // Lógica para atualizar a fatura usando o ID
    console.log("Atualizar fatura com ID:", faturaId);
    await AtualizarFaturaQuandoDeletarPagamento(faturaId);
    await queryCliente.invalidateQueries({
      queryKey: ["historico-pagamento-fatura", cartaoId],
    });
  }

  return (
    <div className="rounded-lg border p-5">
      <p className="mb-3">Historico de pagamentos de fatura</p>
      <div className="space-y-3">
        {historico.map((pagamento: PagamentoFaturaHistorico) => (
          <div
            key={pagamento.id}
            className="flex flex-col gap-2 rounded-lg border-l-8 border-primary bg-azulMuted p-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">{pagamento.name}</p>
              <p className="text-xs text-muted-foreground">
                Competência{" "}
                {dataCompetenciaUtc(pagamento.faturaCartao.competencia)} | Banco{" "}
                {pagamento.transactionBanco.nome}
              </p>
              <p className="text-xs text-muted-foreground">
                Pago em {dataFormatada(new Date(pagamento.date))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                {formatCurrency(pagamento.amount)}
              </p>
              <div className="flex items-center justify-start gap-2">
                <Badge
                  variant={pagamento.faturaCartao.paga ? "default" : "outline"}
                >
                  {pagamento.faturaCartao.paga
                    ? "Fatura quitada"
                    : "Pagamento parcial"}
                </Badge>
                <Button
                  onClick={() => setOpenModal(true)}
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
            <DialogConfirm
              titulo="Deseja Realmente deletar a transação?"
              subtitulo={`${pagamento.name} - ${formatCurrency(pagamento.amount)}`}
              mensagem="Essa ação é irreversível"
              open={openModal}
              onOpenChange={setOpenModal}
              onClick={() => {
                setOpenModal(false);
                deletarPagamento(pagamento.id);
                if (pagamento.faturaCartao.id) {
                  atualizarFatura(pagamento.faturaCartao.id);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
