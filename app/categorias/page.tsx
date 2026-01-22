"use client";
import { Filter, Plus } from "lucide-react";
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
  const [filtroSelecionado, setFiltroSelecionado] = useState("TODOS");
  const { data, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategoria,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  const categoriasFiltradas = data?.filter((cat: TypeCategoria) =>
    filtroSelecionado === "TODOS" ? true : cat.tipo === filtroSelecionado,
  );

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

      <div className="flex-1 flex-col justify-center gap-4 rounded-md border bg-muted/50 p-3 md:flex md:flex-row md:justify-start">
        <p className="hidden items-center justify-center gap-2 text-center text-sm text-muted-foreground md:flex">
          {" "}
          <Filter size={20} /> Filtro por tipo:
        </p>
        <div className="flex items-center justify-center gap-4 text-muted-foreground md:justify-start">
          <Button
            onClick={() => setFiltroSelecionado("TODOS")}
            variant={`${filtroSelecionado === "TODOS" ? "default" : "ghost"}`}
          >
            Todos
          </Button>
          <Button
            onClick={() => setFiltroSelecionado("DESPESA")}
            variant={`${filtroSelecionado === "DESPESA" ? "default" : "ghost"}`}
          >
            Despesas
          </Button>
          <Button
            onClick={() => setFiltroSelecionado("DEPOSITO")}
            variant={`${filtroSelecionado === "DEPOSITO" ? "default" : "ghost"}`}
          >
            Receitas
          </Button>
        </div>
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
          subtitulo="Comece adicionando sua primeira categoria"
          tituloBotao="Adicionar Categoria"
          onClick={() => setAbrirFormCategoria(true)}
        />
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoriasFiltradas?.map((categoria: TypeCategoria) => (
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
