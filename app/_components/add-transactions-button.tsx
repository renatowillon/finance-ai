"use client";
import { ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransacionDialog from "./upsert-transaction-dialog";

const AddTransactionButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setDialogIsOpen(true)}
      >
        Adicionar Transação <ArrowDownUp />
      </Button>
      <UpsertTransacionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};
export default AddTransactionButton;
