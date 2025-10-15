"use client";

import { Plus } from "lucide-react";
import { InfoSemDados } from "../_components/bancos/infoSemDados";
import { Button } from "../_components/ui/button";
import { toast } from "sonner";
import { CardInvestimento } from "./components/cardInvestimento";
import { FormInvestimentos } from "./components/formInvestimento";
import { useState } from "react";
import { TypeInvestimento, TypeInvestimentoInput } from "../types";
import { useMutations } from "../mutetions/investimentoMutation";
import { useAuth } from "../context/AuthContext";
import { fetchInvestimento } from "../fetche/investimentoFetch";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../_components/loading";

const Investimentos = () => {
  const [openFormInvestimento, setOpenFormInvestimento] = useState(false);
  const [investimentoSelecionado, setInvestimentoSelecionado] =
    useState<TypeInvestimento>();
  const { criarMutation, atualizarMutation } = useMutations();
  const { userId } = useAuth();
  function abrirForm() {
    toast.info("implementação em andamento 🥳");
    setOpenFormInvestimento(true);
    setInvestimentoSelecionado(undefined);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["investimento"],
    queryFn: fetchInvestimento,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  function AdicionarInvestimento(values: TypeInvestimentoInput) {
    if (investimentoSelecionado) {
      const investimentoAtualizado = investimentoSelecionado;
      atualizarMutation.mutate({
        id: investimentoAtualizado.id,
        investimento: {
          descricao: values.descricao,
          meta: values.meta,
          nome: values.nome,
          userId: Number(userId),
        },
      });
      toast.success("Investimento Atualizado com Sucesso");
      console.log(investimentoSelecionado);
    } else {
      const investimentoNovo: TypeInvestimentoInput = {
        ...values,
      };
      criarMutation.mutate(investimentoNovo);
      toast.success("Investimento Criado com Sucesso");
    }
    console.log(values);
  }
  function EditarInvestimento(values: TypeInvestimento) {
    setInvestimentoSelecionado(values);
    setOpenFormInvestimento(true);
    console.log(values);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Investimentos</h1>
        <Button onClick={abrirForm}>
          <Plus /> Adicionar Investimento
        </Button>
      </div>
      <p className="animate-pulse rounded-lg border border-orange-500 bg-orange-500/20 p-3 text-center font-bold text-muted-foreground">
        PEDIMOS PERDÃO PELO TRANSTORNO, ESSA TELA ESTÁ EM DESENVOLVIMENTO, TODOS
        OS DADOS NO MOMENTO DESSA TELA SÃO FICTICIOS
      </p>
      {data?.length < 1 && (
        <InfoSemDados
          titulo="Nenhum investimento cadastrado"
          subtitulo="Comece adicionando seu primeira plano de investimento"
          tituloBotao="Adicionar Investimento"
          onClick={abrirForm}
        />
      )}
      {isLoading && <Loading />}
      {/* inicio de implementação de card de investimento */}
      <div className="grid-cols-1 gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {data?.map((investimento: TypeInvestimento) => (
          <CardInvestimento
            key={investimento.id}
            investimento={investimento}
            editInvestimento={EditarInvestimento}
          />
        ))}
      </div>

      <FormInvestimentos
        open={openFormInvestimento}
        onOpenChange={setOpenFormInvestimento}
        onSubmit={AdicionarInvestimento}
        investimentoSelecionado={investimentoSelecionado}
      />
    </div>
  );
};
export default Investimentos;
