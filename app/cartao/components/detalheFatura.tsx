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
import { dataFormatada } from "@/app/_utils/functions";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { pegarTransacaoPorCartao } from "@/app/fetche/transacaoCartao";
import { TypeTransacaoCartao } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  cartaoId: string | null | undefined;
}

export const DetalheFatura = ({ cartaoId }: Props) => {
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

  return (
    <div className="space-y-5">
      {/* menu de calendario e faturas */}
      <div className="w-full rounded-lg border">
        <div className="flex items-center justify-center gap-3 p-5 text-center">
          <Button variant={"ghost"}>
            <ChevronLeft />
          </Button>
          <div className="">
            <p className="flex items-center justify-center gap-3 text-xl font-bold">
              <Calendar size={25} /> <p>Janeiro 2026</p>
            </p>
            <p>
              <Badge variant={"outline"}>Fatura aberta</Badge>
            </p>
          </div>
          <Button variant={"ghost"}>
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
            <span>Fatura Jan/2026</span>
            <span className="text-xl font-black md:text-3xl">R$ 333,50</span>
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
                  <TableHead>Parcela</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <Loading />}
                {transacaoCartao?.map((transacao: TypeTransacaoCartao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{dataFormatada(transacao.dataCompra)}</TableCell>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>{transacao.parcelaAtual}</TableCell>
                    <TableCell>{transacao.valor}</TableCell>
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
