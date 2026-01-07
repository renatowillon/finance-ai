"use client";
import SumaryCard from "@/app/(home)/_components/summary-card";
import { Loading } from "@/app/_components/loading";
import { Button } from "@/app/_components/ui/button";
import { TituloPadrao } from "@/app/configuracao/_components/tituloPadrao";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { TypeCartaoCredito } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, DollarSign } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
      <div className="flex w-full items-center gap-3">
        <Button onClick={voltarCartao} variant={"ghost"}>
          <ArrowLeft />
        </Button>
        <TituloPadrao titulo={cartao?.nome} descricao="Gerencie suas faturas" />
        {/* <h1 className="text-2xl font-bold">{cartao?.nome}</h1> */}
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
    </div>
  );
};

export default FaturaDetalhada;
