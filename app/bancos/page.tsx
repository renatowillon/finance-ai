"use client";
import { Plus } from "lucide-react";
import { Button } from "../_components/ui/button";
import { useState } from "react";
import { Formbanco } from "../_components/bancos/formBanco";
import { TypeBanco, TypeBancoInput } from "../types";
import { fetchBanco } from "../fetche/bancoFetch";
import { useQuery } from "@tanstack/react-query";
import { useMutations } from "../mutetions/bancoMutation";
import { CardBanco } from "../_components/bancos/cardBanco";
import { InfoSemDados } from "../_components/bancos/infoSemDados";
import { Loading } from "../_components/loading";

const Bancos = () => {
  const { criarMutation } = useMutations();
  const [abrirFormBanco, setAbrirFormBanco] = useState(false);
  //const [banco, setBanco] = useState<TypeBanco[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["bancos"],
    queryFn: fetchBanco,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  function AdicionarBanco(values: Omit<TypeBanco, "id" | "saldoAtual">) {
    const bancoNovo: TypeBancoInput = {
      ...values,
      saldoAtual: values.saldoInicial,
    };
    criarMutation.mutate(bancoNovo);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Bancos</h1>
        <Button onClick={() => setAbrirFormBanco(true)}>
          <Plus /> Adicionar Banco
        </Button>
      </div>
      <Formbanco
        open={abrirFormBanco}
        onOpenChange={setAbrirFormBanco}
        onSubmit={AdicionarBanco}
      />
      {isLoading && <Loading />}
      {data?.lenght < 1 && (
        <InfoSemDados
          titulo="Nenhum banco cadastrado"
          subtitulo="Comece adicionando sua primeira conta bancária"
          tituloBotao="Adicionar Banco"
          onClick={() => setAbrirFormBanco(true)}
        />
      )}
      {data?.map((banco: TypeBanco) => (
        <CardBanco key={banco.id} data={banco} />
      ))}
    </div>
  );
};
export default Bancos;
