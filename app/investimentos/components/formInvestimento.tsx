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
import { TypeInvestimentoInput } from "@/app/types";
import { useState } from "react";

interface FormInvestimentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (Investimento: TypeInvestimentoInput) => void;
}

export const FormInvestimentos = ({
  open,
  onOpenChange,
  onSubmit,
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
    if (!formData.nome || !formData.meta) return;

    onSubmit({
      nome: formData.nome,
      descricao: formData.descricao,
      meta: parseFloat(formData.meta),
      userId: Number(userId),
    });
    setFormData({
      nome: "",
      meta: "",
      descricao: "",
      userId: undefined as number | undefined,
    });
    onOpenChange(false);
    //console.log(formData) //consultar se esta chegando os dados corretamente
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Investimento</DialogTitle>
          </DialogHeader>
          <form onClick={handleSubmit} className="space-y-4">
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
                type={"button"}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button className="flex-1" variant={"default"}>
                Criar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
