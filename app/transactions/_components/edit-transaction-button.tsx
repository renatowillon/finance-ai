"use client";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import DialogoInserirOuAtualizarTransacao from "@/app/_components/upsert-transaction-dialog";
import { Button } from "@/app/_components/ui/button";
import { Transaction } from "@prisma/client";

interface PropriedadesBotaoEditarTransacao {
  transacao: Transaction;
}

const EditTransactionButton = ({
  transacao,
}: PropriedadesBotaoEditarTransacao) => {
  const [dialogoEstaAberto, setDialogoEstaAberto] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDialogoEstaAberto(true)}
      >
        <EditIcon />
      </Button>
      <DialogoInserirOuAtualizarTransacao
        estaAberto={dialogoEstaAberto}
        definirSeEstaAberto={setDialogoEstaAberto}
        valoresPadrao={{
          nome: transacao.name,
          valor: Number(transacao.amount),
          tipo: transacao.type,
          categoriaId: Number(transacao.categoriaId),
          data: transacao.date,
          bancoId: transacao.bancoId,
          baixado: transacao.baixado,
        }}
        idTransacao={transacao.id}
      />
    </>
  );
};
export default EditTransactionButton;
