import { DialogConfirm } from "@/app/_components/dialogConfirm";
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
import { dataFormatada, formatarCompetencia } from "@/app/_utils/functions";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { verificarFaturaFechada } from "@/app/fetche/faturaFetch";
import { pegarTransacaoPorCartao } from "@/app/fetche/transacaoCartao";
import {
  obterMesesComTransacoes,
  obterStatusFatura,
} from "@/app/functions/functions";
import { useMutations } from "@/app/mutetions/transacaoCartaoMutation";
import { useMutations as fecharFaturaMutation } from "@/app/mutetions/fecharFaturaMutation";
import { TypeTransacaoCartao } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  cartaoId: string | null | undefined;
  transacaoSelecionada: (transacaoSelecionada: TypeTransacaoCartao) => void;
}

const getMesAtual = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}`;
};

export const DetalheFatura = ({ cartaoId, transacaoSelecionada }: Props) => {
  const [openDialogFatura, setOpenDialogFatura] = useState(false);
  const [openDialogReabrirFatura, setOpenDialogReabrirFatura] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(
    getMesAtual,
  );
  const [transacaoSelecionadaDelete, setTransacaoSelecionadaDelete] = useState<
    TypeTransacaoCartao | undefined | null
  >();

  const enabled = !!cartaoId;
  const { data: transacaoCartao = [], isLoading } = useQuery({
    queryKey: ["transacaoCartao", cartaoId],
    queryFn: () => pegarTransacaoPorCartao(cartaoId as string),
    enabled,
  });

  const { data: Cartao } = useQuery({
    queryKey: ["cartaoCredito", cartaoId],
    queryFn: () => pegarUmCartao(cartaoId as string),
    enabled,
  });

  const { data: faturaFechada } = useQuery({
    queryKey: ["fatura-fechada", cartaoId, mesSelecionado],
    queryFn: () =>
      verificarFaturaFechada({
        competencia: competenciaEscolhida!,
        cartaoCreditoId: cartaoId!,
      }),
    enabled: !!cartaoId && !!mesSelecionado,
  });

  const { fechamentoFaturaMutation, reaberturaFaturaMutation } =
    fecharFaturaMutation();

  const competenciaEscolhida = mesSelecionado!;

  const transacaoFiltrada = transacaoCartao.filter((t: TypeTransacaoCartao) => {
    if (!mesSelecionado || !t.competencia) return false;

    let competenciaTransacao: string;

    if (typeof t.competencia === "string") {
      const [ano, mes] = t.competencia.split(" ")[0].split("-");
      competenciaTransacao = `${ano}-${mes}`;
    } else {
      const ano = t.competencia.getFullYear();
      const mes = String(t.competencia.getMonth() + 1).padStart(2, "0");
      competenciaTransacao = `${ano}-${mes}`;
    }

    return competenciaTransacao === mesSelecionado;
  });

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
    console.log(novoMesRef);
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

  const mesesDisponiveis = obterMesesComTransacoes(transacaoCartao);
  const statusFatura = obterStatusFatura(transacaoFiltrada);

  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const { deletarTransacaoCartaoMutation } = useMutations();

  function deletarTransacao(id: string) {
    try {
      deletarTransacaoCartaoMutation.mutate(id);
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar transação: ", error);
    }
  }
  function fecharFatura(competencia: string, cartaoCreditoId: string) {
    try {
      fechamentoFaturaMutation.mutate({ competencia, cartaoCreditoId });
      toast.success("Fatura fechada com sucesso.");
    } catch (error) {
      console.error("Erro ao fechar fatura: ", error);
    }

    console.log({ competencia, cartaoCreditoId });
    // falta criar o fetch apenas
  }

  function reabrirFatura(id: string) {
    try {
      reaberturaFaturaMutation.mutate({ id });
      toast.success("Fatura reaberta com sucesso.");
    } catch (error) {
      console.error("Erro ao reabrir fatura: ", error);
    }
  }
  return (
    <div className="space-y-5">
      {/* menu de calendario e faturas */}
      <div className="w-full space-y-3 rounded-lg border p-5">
        <div className="flex items-center justify-center gap-3 text-center">
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
              <Badge variant={"outline"}>{statusFatura}</Badge>
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
        <div className="w-full overflow-hidden">
          <div className="scrollbar-hide flex touch-pan-x gap-3 overflow-x-auto overscroll-x-contain scroll-smooth whitespace-nowrap px-2 md:items-center md:justify-center">
            {mesesDisponiveis.map((mes) => (
              <Button
                key={mes.value}
                variant={mesSelecionado === mes.value ? "default" : "outline"}
                onClick={() => setMesSelecionado(mes.value)}
                className="shrink-0"
              >
                {mes.label}
              </Button>
            ))}
          </div>
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
            {faturaFechada?.fechada === true ? (
              <Badge variant={"destructive"}>Fatura já fechada</Badge>
            ) : (
              <Badge variant={"secondary"}>Aberta</Badge>
            )}
          </p>
        </div>
        <div className="p-3 md:p-5">
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
              {transacaoFiltrada?.length}{" "}
              {transacaoFiltrada?.length <= 1 ? "transação" : "transações"}
            </div>
            {isLoading && (
              <div className="w-full">
                <Loading />
              </div>
            )}
            {/* aqui fica pra PC */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descricão</TableHead>
                    <TableHead>Competência</TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                  {transacaoFiltrada?.map((transacao: TypeTransacaoCartao) => (
                    <TableRow key={transacao.id}>
                      <TableCell>
                        {dataFormatada(transacao.dataCompra as Date)}
                      </TableCell>
                      <TableCell>{transacao.descricao}</TableCell>
                      <TableCell>
                        {formatarCompetencia(transacao.competencia as Date)}
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
                      <TableCell>
                        {transacao.pago === true ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                            <Check size={14} />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                            <X size={14} className="text-red-200" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={"ghost"}
                          onClick={() => transacaoSelecionada(transacao)}
                        >
                          <Edit size={20} />{" "}
                        </Button>
                        <Button
                          variant={"ghost"}
                          onClick={() => {
                            setTransacaoSelecionadaDelete(transacao);
                            setOpenDialogDelete(true);
                          }}
                        >
                          <Trash size={20} />{" "}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* aqui fica pra Mobile */}
            <div className="space-y-2 md:hidden">
              {transacaoFiltrada?.map((transacao: TypeTransacaoCartao) => (
                <div
                  key={transacao.id}
                  className="rounded-xl border p-2 shadow-sm"
                >
                  <div className="mt-2 flex justify-between">
                    <div className="flex flex-col text-sm">
                      <div className="">
                        {transacao.descricao}{" "}
                        {transacao.parcelada
                          ? `${transacao.parcelaAtual}/${transacao.totalParcelas}`
                          : ""}
                      </div>
                      <div className="flex items-start justify-start text-xs text-muted-foreground">
                        {dataFormatada(transacao.dataCompra as Date)}
                      </div>
                    </div>
                    <div className="">{formatCurrency(transacao.valor)}</div>
                  </div>

                  <div className="flex w-full items-center justify-end gap-2">
                    <Button
                      className=""
                      size="sm"
                      variant="secondary"
                      onClick={() => transacaoSelecionada(transacao)}
                    >
                      <Edit size={18} />
                    </Button>

                    <Button
                      className=""
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setTransacaoSelecionadaDelete(transacao);
                        setOpenDialogDelete(true);
                      }}
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {transacaoSelecionadaDelete && (
              <DialogConfirm
                titulo="Deseja Realmente deletar a transação?"
                subtitulo={`${transacaoSelecionadaDelete?.descricao} no valor de ${formatCurrency(transacaoSelecionadaDelete?.valor)}`}
                mensagem="Essa ação é irreversível"
                open={openDialogDelete}
                onOpenChange={setOpenDialogDelete}
                onClick={() => {
                  setOpenDialogDelete(false);
                  deletarTransacao(transacaoSelecionadaDelete?.id);
                }}
              />
            )}
            <DialogConfirm
              titulo="Deseja realmente fechar a fatura?"
              subtitulo="confira se já lançou todas as suas compras no cartão de crédito"
              open={openDialogFatura}
              onOpenChange={setOpenDialogFatura}
              onClick={() => {
                setOpenDialogFatura(false);
                fecharFatura(competenciaEscolhida, cartaoId as string);
              }}
            />
            <DialogConfirm
              titulo="Deseja realmente reabrir fatura?"
              open={openDialogReabrirFatura}
              onOpenChange={setOpenDialogReabrirFatura}
              onClick={() => {
                setOpenDialogReabrirFatura(false);
                reabrirFatura(faturaFechada?.faturaId as string);
              }}
            />
          </div>
          <div className="w-full">
            {faturaFechada?.fechada === true ? (
              <Button
                className="w-full"
                onClick={() => setOpenDialogReabrirFatura(true)}
                variant={"destructive"}
                disabled={!faturaFechada.fechada}
              >
                Reabrir Fatura - {competenciaEscolhida}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => setOpenDialogFatura(true)}
                disabled={faturaFechada?.fechada}
              >
                Fechar Fatura - {competenciaEscolhida}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
