"use client";
import { Plus } from "lucide-react";
import { Button } from "../_components/ui/button";
import { useState } from "react";
import { TypeCategoria } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useMutations } from "../mutetions/categoriaMutation";
import { InfoSemDados } from "../_components/bancos/infoSemDados";
import { Loading } from "../_components/loading";
import { useAuth } from "../context/AuthContext";
import { fetchCategoria } from "../fetche/categoriaFetch";
import { FormCategoria } from "../_components/categorias/formCategoria";
import { CardCategoria } from "../_components/categorias/cardCategoria";

const Categorias = () => {
  const { criarMutation, atualizarMutation } = useMutations();
  const [abrirFormCategoria, setAbrirFormCategoria] = useState(false);
  const [categoriaSelecionado, setCategoriaSelecionado] =
    useState<TypeCategoria>();
  const { userId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategoria,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  function AdicionarCategoria(values: Omit<TypeCategoria, "id">) {
    if (categoriaSelecionado) {
      const categoriaParaAtualizar = categoriaSelecionado;
      atualizarMutation.mutate({
        id: categoriaSelecionado.id,
        categorias: {
          id: categoriaParaAtualizar.id,
          nome: values.nome,
          tipo: values.tipo,
          userId: Number(userId),
        },
      });
    } else {
      const categoriaNova: Omit<TypeCategoria, "id"> = {
        ...values,
      };
      criarMutation.mutate(categoriaNova);
    }
  }
  function EditarCategoria(values: TypeCategoria) {
    setCategoriaSelecionado(values);
    setAbrirFormCategoria(true);
    console.log(values);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas Categorias</h1>
        <Button
          onClick={() => {
            setCategoriaSelecionado(undefined);
            setAbrirFormCategoria(true);
          }}
        >
          <Plus /> Adicionar Categorias
        </Button>
      </div>
      <FormCategoria
        open={abrirFormCategoria}
        onOpenChange={setAbrirFormCategoria}
        onSubmit={AdicionarCategoria}
        categoriaSelecionada={categoriaSelecionado}
      />
      {isLoading && <Loading />}
      {data?.length < 1 && (
        <InfoSemDados
          titulo="Nenhuma categoria cadastrado"
          subtitulo="Comece adicionando sua primeira ccategoria"
          tituloBotao="Adicionar Categoria"
          onClick={() => setAbrirFormCategoria(true)}
        />
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((categoria: TypeCategoria) => (
          <CardCategoria
            key={categoria.id}
            dataCategoria={categoria}
            editCategoria={EditarCategoria}
          />
        ))}
      </div>
    </div>
  );
};
export default Categorias;
