"use client";
import { fetchBanco } from "@/app/fetche/bancoFetch";
import { useQuery } from "@tanstack/react-query";
import { TypeBanco } from "@/app/types";
import { CardBancoPequeno } from "./cardBancoPequeno";

export const CardBancosDashboard = () => {
  const { data } = useQuery({
    queryKey: ["bancos"],
    queryFn: fetchBanco,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(200px,2fr))]">
      {data?.map((banco: TypeBanco) => (
        <CardBancoPequeno key={banco.id} dataBanco={banco} />
      ))}
    </div>
  );
};
