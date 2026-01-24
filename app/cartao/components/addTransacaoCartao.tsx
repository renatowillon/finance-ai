import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { TypeTransacaoCartaoInput } from "@/app/types";
import { AlertCircleIcon, CreditCard, Plus } from "lucide-react";
import React, { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mostrarBotao?: boolean;
}

export const AddTransacaoCartao = ({
  open,
  onOpenChange,
  mostrarBotao,
}: Props) => {
  // const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TypeTransacaoCartaoInput>({
    descricao: "",
    valor: 0,
    dataCompra: new Date(),
    parcelada: false,
    parcelaAtual: 0,
    totalParcelas: 0,
    competencia: new Date(),
    pago: false,
    dataPagamento: new Date(),
    cartaoCreditoId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <>
      {mostrarBotao && (
        <div>
          <Button
            onClick={() => onOpenChange(!open)}
            className="hidden lg:flex"
          >
            <Plus /> Adicionar Transação
          </Button>
          <Button
            onClick={() => onOpenChange(!open)}
            className="flex size-36 flex-col lg:hidden"
          >
            <CreditCard className="" /> <p className="">Cartão</p>
          </Button>
        </div>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Adicionar Transação Cartão</DialogTitle>
            </DialogHeader>
            <div>
              <form onSubmit={handleSubmit}>
                <Badge
                  variant={"destructive"}
                  className="animate-pulse space-x-3"
                >
                  <AlertCircleIcon /> <p>Em Desenvolvimento</p>
                </Badge>
                <div className="space-y-1">
                  <Label>Descrição</Label>
                  <Input
                    id="nome"
                    placeholder="Compra com mercado"
                    value={formData.descricao}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        nome: e.target.value,
                      }));
                    }}
                  />
                </div>
              </form>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
