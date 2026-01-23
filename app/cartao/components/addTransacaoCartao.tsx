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
import { Plus } from "lucide-react";
import React, { useState } from "react";

export const AddTransacaoCartao = () => {
  const [open, setOpen] = useState(false);
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
      <Button onClick={() => setOpen(!open)} className="hidden lg:flex">
        <Plus /> Adicionar Transação
      </Button>
      <Button
        onClick={() => setOpen(!open)}
        className="size-11 rounded-full font-bold lg:hidden"
      >
        <Plus />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Transação Cartão</DialogTitle>
            </DialogHeader>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <Label>Descrição</Label>
                  <Input
                    id="nome"
                    placeholder="Compra com mercado"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome: e.target.value }))
                    }
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
