"use client";
import { pegarUmBanco } from "@/app/fetche/bancoFetch";
import { TypeBanco } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

interface BancosTransacaoProps {
  idBanco: number;
}

export const BancosTransacao = ({ idBanco }: BancosTransacaoProps) => {
  const { data } = useQuery<TypeBanco>({
    queryKey: ["bancos", idBanco],
    queryFn: () => pegarUmBanco(idBanco),
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  return (
    <>
      <p>{data?.nome}</p>
    </>
  );
};
