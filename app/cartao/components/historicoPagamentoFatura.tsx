"use client";

import { InfoSemDados } from "@/app/_components/bancos/infoSemDados";
import { Badge } from "@/app/_components/ui/badge";
import { formatCurrency } from "@/app/_utils/currency";
import { dataCompetenciaUtc, dataFormatada } from "@/app/_utils/functions";
import { pegarHistoricoFatura } from "@/app/fetche/faturaFetch";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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

  return (
    <div className="rounded-lg border p-5">
      <p className="mb-3">Historico de pagamentos de fatura</p>
      <div className="space-y-3">
        {historico.map((pagamento: PagamentoFaturaHistorico) => (
          <div
            key={pagamento.id}
            className="flex flex-col gap-2 rounded-lg border bg-azulMuted p-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">{pagamento.name}</p>
              <p className="text-xs text-muted-foreground">
                Competencia{" "}
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
              <Badge
                variant={pagamento.faturaCartao.paga ? "default" : "outline"}
              >
                {pagamento.faturaCartao.paga
                  ? "Fatura quitada"
                  : "Pagamento parcial"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
