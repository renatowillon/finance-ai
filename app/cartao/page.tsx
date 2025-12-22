"use client";
import { Plus } from "lucide-react";
import { Button } from "../_components/ui/button";
import { useState } from "react";
import { FormCriarCartao } from "./components/formCriarCartao";
import { TypeCartaoCreditoInput } from "../types";

const Cartao = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function AdicionarCartaoCredito(values: TypeCartaoCreditoInput) {
    console.log(values);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Cartões de Crédito</h1>
        <Button onClick={() => setOpenModal(true)}>
          <Plus /> Adicionar Cartão
        </Button>
      </div>
      <FormCriarCartao
        open={openModal}
        onOpenChange={setOpenModal}
        onSubmit={AdicionarCartaoCredito}
      />
    </div>
  );
};
export default Cartao;
