import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import { InvestimentoSchema } from "@/app/schemas/investimentoSchema";
import { TypeInvestimento, TypeInvestimentoInput } from "@/app/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormInvestimentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (Investimento: TypeInvestimentoInput) => void;
  investimentoSelecionado?: TypeInvestimento;
}

export const FormInvestimentos = ({
  open,
  onOpenChange,
  onSubmit,
  investimentoSelecionado,
}: FormInvestimentoProps) => {
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    meta: "",
    descricao: "",
    userId: undefined as number | undefined,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = InvestimentoSchema.safeParse({
      ...formData,
      userId: Number(userId),
    });

    if (!result.success) {
      const mensagem = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      toast.error("Erro ao salvar investimento!", {
        description:
          mensagem.join("\n") || "Preencha todos os campos corretamente.",
        className: "font-bold whitespace-pre-line", // 👈 respeita o \n
      });
      return;
    }

    onSubmit(result.data!);

    setFormData({
      nome: "",
      meta: "",
      descricao: "",
      userId: undefined as number | undefined,
    });
    onOpenChange(false);
    //console.log(formData) //consultar se esta chegando os dados corretamente
  };

  useEffect(() => {
    if (open) {
      if (investimentoSelecionado) {
        setFormData({
          descricao: investimentoSelecionado.descricao,
          meta: String(investimentoSelecionado.meta),
          nome: investimentoSelecionado.nome,
          userId: Number(userId),
        });
      } else {
        setFormData({
          nome: "",
          meta: "",
          descricao: "",
          userId: Number(userId),
        });
      }
    }
  }, [open, userId, investimentoSelecionado]);
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {investimentoSelecionado
                ? "Atualizar Investimento"
                : "Criar Novo Investimento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Titulo do Investimento</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Ex: Reserva de Emêrgencia"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Para que serve este investimento?"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta">Meta (R$) - Opcional</Label>
              <Input
                id="meta"
                step="0.01"
                value={formData.meta}
                type="number"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, meta: e.target.value }))
                }
                placeholder="Quanto você quer alcançar?"
              />
            </div>
            <div className="flex w-full gap-3">
              <Button
                className="flex-1"
                variant={"outline"}
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" variant={"default"}>
                {investimentoSelecionado ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
