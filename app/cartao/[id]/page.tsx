"use client";
import { pegarUmCartao } from "@/app/fetche/cartaoFetch";
import { TypeCartaoCredito } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const FaturaDetalhada = () => {
  const params = useParams();
  const cartaoId = Number(params.id);

  const { data: cartao } = useQuery<TypeCartaoCredito | null>({
    queryKey: ["cartao", cartaoId],
    queryFn: () => pegarUmCartao(Number(cartaoId)),
    enabled: !!cartaoId,
  });

  return (
    <div>
      <p className="">{cartao?.nome}</p>
    </div>
  );
};

export default FaturaDetalhada;
