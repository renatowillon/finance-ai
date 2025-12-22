"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import { CorBanco } from "@/app/models";
import { CartaoSchema } from "@/app/schemas/cartaoSchema";
import { TypeCartaoCreditoInput } from "@/app/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (Cartao: TypeCartaoCreditoInput) => void;
}
export const FormCriarCartao = ({ open, onOpenChange, onSubmit }: Props) => {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    limite: "",
    diaFechamento: "",
    diaVencimento: "",
    cor: "",
    userId: undefined as number | undefined,
  });
  useEffect(() => {
    if (open) {
      setFormData({
        nome: "",
        limite: "",
        diaFechamento: "",
        diaVencimento: "",
        cor: "",
        userId: undefined as number | undefined,
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = CartaoSchema.safeParse({
      ...formData,
      userId,
    });
    if (!result.success) {
      const mensagem = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      toast.error("Erro ao salvar cartão de crédito!", {
        description:
          mensagem.join("\n") || "Preencha todos os campos corretamente.",
        className: "font-bold whitespace-pre-line", // 👈 respeita o \n
      });
      return;
    }

    onSubmit(result.data!);
    setFormData({
      nome: "",
      limite: "",
      diaFechamento: "",
      diaVencimento: "",
      cor: "",
      userId: undefined as number | undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Criar Cartão de Crédito</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-1">
            <Label>Nome do Cartão</Label>
            <Input
              id="nome"
              placeholder="Nubank Platinum"
              value={formData.nome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Limite</Label>
            <Input
              id="limite"
              placeholder="R$ 1500,00"
              type="number"
              value={formData.limite}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  limite: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Dia de Fechamento</Label>
            <Input
              id="diaFechamento"
              placeholder="10"
              type="number"
              value={formData.diaFechamento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  diaFechamento: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Dia de Vencimento</Label>
            <Input
              id="diaVencimento"
              placeholder="17"
              type="number"
              value={formData.diaVencimento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  diaVencimento: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cor">Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CorBanco.map((cor) => (
                <Button
                  key={cor}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 transition-all first-letter:${
                    formData.cor === cor
                      ? "scale-110 border-primary"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: cor }}
                  onClick={() => setFormData((prev) => ({ ...prev, cor }))}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1"
              variant="outline"
              type="button"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
