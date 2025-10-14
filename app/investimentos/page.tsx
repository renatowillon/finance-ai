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

const Investimentos = () => {
  const [openFormInvestimento, setOpenFormInvestimento] = useState(false);
  const [investimentoSelecionado] = useState<TypeInvestimento>();
  const { criarMutation, atualizarMutation } = useMutations();
  const { userId } = useAuth();
  function alerta() {
    toast.info("implementação em andamento 🥳");
    setOpenFormInvestimento(true);
  }

  const { data } = useQuery({
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

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Investimentos</h1>
        <Button onClick={alerta}>
          <Plus /> Adicionar Investimento
        </Button>
      </div>
      <p className="animate-pulse text-center font-bold text-muted-foreground">
        PEDIMOS PERDÃO PELO TRANSTORNO, ESSA TELA ESTÁ EM DESENVOLVIMENTO, TODOS
        OS DADOS NO MOMENTO DESSA TELA SÃO FICTICIOS
      </p>
      <InfoSemDados
        titulo="Nenhum investimento cadastrado"
        subtitulo="Comece adicionando seu primeira plano de investimento"
        tituloBotao="Adicionar Investimento"
        onClick={alerta}
      />

      {/* inicio de implementação de card de investimento */}
      <div className="grid-cols-1 gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {data?.map((investimento: TypeInvestimento) => (
          <CardInvestimento key={investimento.id} investimento={investimento} />
        ))}
      </div>

      <FormInvestimentos
        open={openFormInvestimento}
        onOpenChange={setOpenFormInvestimento}
        onSubmit={AdicionarInvestimento}
      />
    </div>
  );
};
export default Investimentos;
