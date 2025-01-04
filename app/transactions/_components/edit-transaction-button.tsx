"use client";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import UpsertTransacionDialog from "@/app/_components/upsert-transaction-dialog";
import { Button } from "@/app/_components/ui/button";
import { Transaction } from "@prisma/client";

interface EditTransactionButtonProps {
  transaction: Transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setDialogIsOpen(true)}>
        <EditIcon />
      </Button>
      <UpsertTransacionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultvalues={{
          ...transaction,
          amount: Number(transaction.amount),
        }}
        transactionId={transaction.id}
      />
    </>
  );
};
export default EditTransactionButton;
