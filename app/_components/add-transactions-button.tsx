"use client";
import { ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransacionDialog from "./upsert-transaction-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}
const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Adicionar Transação <ArrowDownUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              "Você atingiu o limite de transações. Atualize seu plano para transações ilimitadas"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertTransacionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};
export default AddTransactionButton;
