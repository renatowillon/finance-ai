"use client";
import { Button } from "@/app/_components/ui/button";
import { TituloPadrao } from "@/app/configuracao/_components/tituloPadrao";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { TypeCartaoCredito } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const FaturaDetalhada = () => {
  const params = useParams();
  const cartaoId = Number(params.id);
  const route = useRouter();
  const { data: cartao } = useQuery<TypeCartaoCredito | null>({
    queryKey: ["cartao", cartaoId],
    queryFn: () => pegarUmCartao(Number(cartaoId)),
    enabled: !!cartaoId,
  });

  function voltarCartao() {
    route.push("/cartao");
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
