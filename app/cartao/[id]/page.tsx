"use client";
import { Loading } from "@/app/_components/loading";
import { Button } from "@/app/_components/ui/button";
import { TituloPadrao } from "@/app/configuracao/_components/tituloPadrao";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { TypeCartaoCredito } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
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
    </div>
  );
};

export default FaturaDetalhada;
