import { baixarTransacaoAction } from "@/app/_actions/baixar-transaction";
import { Button } from "@/app/_components/ui/button";
import { CardContent } from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/_components/ui/dialog";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction } from "@prisma/client";
import { Banknote } from "lucide-react";
import { useState } from "react";

interface Props {
  transacao: Transaction;
}

export const ConfirmarBaixa = ({ transacao }: Props) => {
  const [dialogAberto, setDialogAberto] = useState(false);
  return (
    <>
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDialogAberto(true)}
          //
        >
          <Banknote />
        </Button>

        <DialogContent>
          <DialogHeader>Confirmação de Baixa</DialogHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="">
                <p>Deseja realmente baixar a transação de:</p>
                <p className="pl-6 text-muted-foreground">
                  {transacao.name} - {formatCurrency(Number(transacao.amount))}
                </p>
              </div>
              <div className="flex justify-between gap-6 px-6">
                <Button variant="ghost" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    baixarTransacaoAction(transacao.id);
                    setDialogAberto(false);
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </DialogContent>
      </Dialog>
    </>
  );
};
