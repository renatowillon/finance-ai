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
import { useAuth } from "../context/AuthContext";
import SeletorMes from "../_components/seletorMes";

const Bancos = () => {
  const { criarMutation, atualizarMutation } = useMutations();
  const [abrirFormBanco, setAbrirFormBanco] = useState(false);
  const [bancoSelecionado, setBancoSelecionado] = useState<TypeBanco>();
  const [mesSelecionado, setMesSelecionado] = useState("2025-11");
  const { userId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["bancos"],
    queryFn: fetchBanco,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  function AdicionarBanco(values: Omit<TypeBanco, "id" | "saldoAtual">) {
    if (bancoSelecionado) {
      const bancoParaAtualizar = bancoSelecionado;
      atualizarMutation.mutate({
        id: bancoSelecionado.id,
        banco: {
          id: bancoParaAtualizar.id,
          nome: values.nome,
          cor: values.cor,
          tipo: values.tipo,
          saldoInicial: values.saldoInicial,
          saldoAtual: 0,
          userId: Number(userId),
        },
      });
    } else {
      const bancoNovo: TypeBancoInput = {
        ...values,
      };
      criarMutation.mutate(bancoNovo);
    }
  }
  function EditarBanco(values: TypeBanco) {
    setBancoSelecionado(values);
    setAbrirFormBanco(true);
    console.log(values);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Bancos</h1>
        <Button
          onClick={() => {
            setBancoSelecionado(undefined);
            setAbrirFormBanco(true);
          }}
        >
          <Plus /> Adicionar Banco
        </Button>
      </div>
      <div className="flex w-full items-center justify-center">
        <SeletorMes value={mesSelecionado} onChange={setMesSelecionado} />
      </div>
      <Formbanco
        open={abrirFormBanco}
        onOpenChange={setAbrirFormBanco}
        onSubmit={AdicionarBanco}
        bancoSelecionado={bancoSelecionado}
      />
      {isLoading && <Loading />}
      {data?.length < 1 && (
        <InfoSemDados
          titulo="Nenhum banco cadastrado"
          subtitulo="Comece adicionando sua primeira conta bancária"
          tituloBotao="Adicionar Banco"
          onClick={() => setAbrirFormBanco(true)}
        />
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((banco: TypeBanco) => (
          <CardBanco
            key={banco.id}
            dataBanco={banco}
            editBanco={EditarBanco}
            mes={mesSelecionado}
          />
        ))}
      </div>
    </div>
  );
};
export default Bancos;
