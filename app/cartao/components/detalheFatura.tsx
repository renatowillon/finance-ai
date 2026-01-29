import { Loading } from "@/app/_components/loading";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { formatCurrency } from "@/app/_utils/currency";
import { dataCompetencia, dataFormatada } from "@/app/_utils/functions";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { pegarTransacaoPorCartao } from "@/app/fetche/transacaoCartao";
import { TypeTransacaoCartao } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props {
  cartaoId: string | null | undefined;
}

const getMesAtual = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}`;
};

export const DetalheFatura = ({ cartaoId }: Props) => {
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(
    getMesAtual,
  );
  const enabled = !!cartaoId;
  const { data: transacaoCartao, isLoading } = useQuery({
    queryKey: ["transacaoCartao", cartaoId],
    queryFn: () => pegarTransacaoPorCartao(cartaoId as string),
    enabled,
  });

  const { data: Cartao } = useQuery({
    queryKey: ["cartaoCredito", cartaoId],
    queryFn: () => pegarUmCartao(cartaoId as string),
    enabled,
  });

  const transacaoFiltrada = transacaoCartao?.filter(
    (t: TypeTransacaoCartao) => {
      if (!mesSelecionado || !t.competencia) return null;

      const [anoSel, mesSel] = mesSelecionado.split("-").map(Number);

      const dataCompetencia = new Date(t.competencia);
      const anoComp = dataCompetencia.getFullYear();
      const mesComp = dataCompetencia.getMonth() + 1;

      return anoComp === anoSel && mesComp === mesSel;
    },
  );

  // Navegação de meses
  const navegarMes = (direcao: "anterior" | "proximo") => {
    if (!mesSelecionado) return;
    const [ano, mes] = mesSelecionado.split("-").map(Number);
    let novoAno = ano;
    let novoMes = mes;
    if (direcao === "anterior") {
      novoMes = mes - 1;
      if (novoMes < 1) {
        novoMes = 12;
        novoAno = ano - 1;
      }
    } else {
      novoMes = mes + 1;
      if (novoMes > 12) {
        novoMes = 1;
        novoAno = ano + 1;
      }
    }

    const novoMesRef = `${novoAno}-${String(novoMes).padStart(2, "0")}`;
    setMesSelecionado(novoMesRef);
  };

  const formatMesCompleto = (mesRef: string) => {
    const [ano, mes] = mesRef.split("-");
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  const formatMesReferencia = (mesRef: string) => {
    const [ano, mes] = mesRef.split("-");
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  };

  const totalFatura = transacaoFiltrada?.reduce(
    (total: number, transacao: TypeTransacaoCartao) =>
      total + Number(transacao.valor),
    0,
  );

  return (
    <div className="space-y-5">
      {/* menu de calendario e faturas */}
      <div className="w-full rounded-lg border">
        <div className="flex items-center justify-center gap-3 p-5 text-center">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => navegarMes("anterior")}
          >
            <ChevronLeft />
          </Button>
          <div className="w-48">
            <p className="flex items-center justify-center gap-3 text-xl font-bold">
              <Calendar size={25} />{" "}
              <p>
                {mesSelecionado
                  ? formatMesCompleto(mesSelecionado)
                  : "Selecione um mês"}
              </p>
            </p>
            <p>
              <Badge variant={"outline"}>Fatura aberta</Badge>
            </p>
          </div>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => navegarMes("proximo")}
          >
            <ChevronRight />{" "}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-3">
            <Button className="h-8">Jan/2026</Button>
            <Button className="h-8">Fev/2026</Button>
          </div>
          <p className="animate-pulse text-sm">
            BADGE DE MESES QUE JA EXISTEM FATURAS (LANÇAMENTOS DENTRO DE FATUAS)
          </p>
        </div>
      </div>
      <div className="rounded-lg border">
        <div className="flex h-[130px] justify-between rounded-t-lg bg-primary px-5 pt-6 text-white">
          <p className="flex flex-col">
            <span>Fatura {formatMesReferencia(String(mesSelecionado))}</span>
            <span className="text-xl font-black md:text-3xl">
              {formatCurrency(totalFatura)}
            </span>
          </p>
          <p>
            <Badge variant={"secondary"}>Aberta</Badge>
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-center">
            <div className="w-1/2 items-center text-sm text-muted-foreground">
              <p>Fechamento</p>
              <p className="flex items-center gap-2 font-bold">
                <Calendar /> {Cartao?.diaFechamento}
              </p>
            </div>
            <div className="w-1/2 items-center text-sm text-muted-foreground">
              <p>Vencimento</p>
              <p className="flex items-center gap-2 font-bold">
                <Calendar /> {Cartao?.diaVencimento}
              </p>
            </div>
          </div>

          {/* table */}
          <div className="py-5">
            <div className="text-sm text-muted-foreground">
              {transacaoCartao?.length}{" "}
              {transacaoCartao?.length <= 1 ? "transação" : "transações"}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descricão</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <Loading />}
                {transacaoFiltrada?.map((transacao: TypeTransacaoCartao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{dataFormatada(transacao.dataCompra)}</TableCell>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>
                      {dataCompetencia(transacao.competencia)}
                    </TableCell>
                    <TableCell>
                      {transacao.parcelada === false ? (
                        1
                      ) : (
                        <>
                          {transacao.parcelaAtual}/{transacao.totalParcelas}
                        </>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(transacao.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
