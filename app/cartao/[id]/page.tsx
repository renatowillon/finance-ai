"use client";
import SumaryCard from "@/app/(home)/_components/summary-card";
import { Loading } from "@/app/_components/loading";
import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { TituloPadrao } from "@/app/configuracao/_components/tituloPadrao";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { TypeCartaoCredito } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, DollarSign } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DetalheFatura } from "../components/detalheFatura";

const FaturaDetalhada = () => {
  const params = useParams();
  const cartaoId = String(params.id);
  const route = useRouter();
  const { data: cartao, isLoading } = useQuery<TypeCartaoCredito | null>({
    queryKey: ["cartao", cartaoId],
    queryFn: () => pegarUmCartao(cartaoId),
    enabled: !!cartaoId,
  });

  function voltarCartao() {
    route.push("/cartao");
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between gap-3 md:justify-normal">
        <Button onClick={voltarCartao} variant={"ghost"}>
          <ArrowLeft />
        </Button>
        <div>
          <TituloPadrao
            titulo={cartao?.nome}
            descricao="Gerencie suas faturas"
          />
        </div>
      </div>
      {cartao && (
        <div className="flex flex-wrap gap-3 md:grid-cols-[repeat(auto-fit,minmax(200px,2fr))]">
          <SumaryCard
            className="w-full flex-grow basis-20 justify-between space-y-1 p-1"
            title="Limite Total"
            icon={
              <CreditCard
                size={16}
                className="text-end text-green-500 md:text-start"
              />
            }
            amount={cartao?.limite}
            size="small"
          />

          <SumaryCard
            className="w-full flex-grow basis-20 justify-between space-y-1 p-1"
            title="Limite Usado"
            icon={
              <DollarSign
                size={16}
                className="text-end text-red-500 md:text-start"
              />
            }
            amount={cartao?.limite}
            size="small"
          />

          <SumaryCard
            className="w-full flex-grow basis-20 justify-between space-y-1 p-1"
            title="Disponível"
            icon={
              <DollarSign
                size={16}
                className="text-end text-green-500 md:text-start"
              />
            }
            amount={cartao?.limite}
            size="small"
          />
        </div>
      )}
      <div>
        <Tabs defaultValue="fatAberta">
          <TabsList className="border bg-azulMuted">
            <TabsTrigger value="fatAberta">Fatura Aberta</TabsTrigger>
            <TabsTrigger value="fatPagamento">Aguardando Pagamento</TabsTrigger>
            <TabsTrigger value="fatHistorico">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="fatAberta">
            <DetalheFatura cartaoId={cartao?.id} />
          </TabsContent>
          <TabsContent value="fatPagamento">Aguardando Pagamento</TabsContent>
          <TabsContent value="fatHistorico">Histórico</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FaturaDetalhada;
