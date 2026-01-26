"use client";
import { Plus } from "lucide-react";
import { Button } from "../_components/ui/button";
import { useState } from "react";
import { FormCriarCartao } from "./components/formCriarCartao";
import { TypeCartaoCredito, TypeCartaoCreditoInput } from "../types";
import { useQuery } from "@tanstack/react-query";
import { pegarCartoes } from "../fetche/cartaoFetch";
import { useMutations } from "../mutetions/cartaoMutation";
import { CardCartao } from "./components/cardCartao";
import { Loading } from "../_components/loading";
import { useAuth } from "../context/AuthContext";
import { DialogConfirm } from "../_components/dialogConfirm";
import { InfoSemDados } from "../_components/bancos/infoSemDados";

const Cartao = () => {
  const { userId } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalDeleteCartao, setOpenModalDeleteCartao] =
    useState<boolean>(false);
  const [cartaoSelecionado, setcartaoSelecionado] =
    useState<TypeCartaoCredito>();
  const { criarMutation, atualizarMutation, deletarMutation } = useMutations();

  const { data, isLoading } = useQuery({
    queryKey: ["cartao"],
    queryFn: pegarCartoes,
    staleTime: 5 * (60 * 1000), //5 minutos
  });

  function AdicionarCartaoCredito(values: TypeCartaoCreditoInput) {
    if (cartaoSelecionado) {
      const cartaoParaAtualizar = cartaoSelecionado;
      atualizarMutation.mutate({
        id: cartaoSelecionado.id,
        cartao: {
          id: cartaoParaAtualizar.id,
          nome: values.nome,
          cor: values.cor,
          limite: values.limite,
          diaFechamento: values.diaFechamento,
          diaVencimento: values.diaVencimento,
          userId: Number(userId),
        },
      });
    } else {
      const cartaoNovo: TypeCartaoCreditoInput = { ...values };
      criarMutation.mutate(cartaoNovo);
    }
  }
  function EditarCartao(values: TypeCartaoCredito) {
    setcartaoSelecionado(values);
    setOpenModal(true);
    console.log(values);
  }

  function DeletarCartao(id: string) {
    deletarMutation.mutate(id);
    setOpenModalDeleteCartao(false);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Cartões de Crédito</h1>
        <Button
          onClick={() => {
            setOpenModal(true);
            setcartaoSelecionado(undefined);
          }}
        >
          <Plus /> Adicionar Cartão
        </Button>
      </div>
      <FormCriarCartao
        open={openModal}
        onOpenChange={setOpenModal}
        onSubmit={AdicionarCartaoCredito}
        cartaoSelecionado={cartaoSelecionado!}
      />
      {isLoading && <Loading />}
      {data?.length < 1 && (
        <InfoSemDados
          titulo="Nenhum cartão cadastrado"
          subtitulo="Comece adicionando sua primeira cartão"
        />
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {data?.map((cartao: TypeCartaoCredito) => (
          <CardCartao
            key={cartao.id}
            dataCartao={cartao}
            editCartao={EditarCartao}
            deleteCartao={() => {
              setcartaoSelecionado(cartao);
              setOpenModalDeleteCartao(!openModalDeleteCartao);
            }}
          />
        ))}
      </div>
      <DialogConfirm
        titulo="Confirmação de Exclusão"
        mensagem="Deseja realmente excluir o cartão: "
        subtitulo={`${cartaoSelecionado?.nome}`}
        open={openModalDeleteCartao}
        onOpenChange={setOpenModalDeleteCartao}
        onClick={() => {
          if (!cartaoSelecionado) return;
          DeletarCartao(cartaoSelecionado?.id);
        }}
      />
    </div>
  );
};
export default Cartao;
