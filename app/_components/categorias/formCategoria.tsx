import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TypeCategoria } from "@/app/types";
import { useAuth } from "@/app/context/AuthContext";

interface FormCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (banco: Omit<TypeCategoria, "id">) => void;
  categoriaSelecionada?: TypeCategoria;
}

export const FormCategoria = ({
  open,
  onOpenChange,
  onSubmit,
  categoriaSelecionada,
}: FormCategoriaProps) => {
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "DESPESA" as TypeCategoria["tipo"],
    userId: undefined as number | undefined,
  });

  useEffect(() => {
    if (open) {
      if (categoriaSelecionada) {
        // Editar: preenche com os dados
        setFormData({
          nome: categoriaSelecionada.nome,
          tipo: categoriaSelecionada.tipo,
          userId: Number(userId),
        });
      } else {
        // Criar: limpa o formulário
        setFormData({
          nome: "",
          tipo: "DESPESA",
          userId: Number(userId),
        });
      }
    }
  }, [open, categoriaSelecionada, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome) return;

    onSubmit({
      nome: formData.nome,
      tipo: formData.tipo,
      userId: Number(userId),
    });
    setFormData({
      nome: "",
      tipo: "DESPESA" as TypeCategoria["tipo"],
      userId: Number(userId),
    });
    onOpenChange(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoriaSelecionada
                ? "Atualizar Banco"
                : "Adicionar Novo Banco"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Mercado"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TypeCategoria["tipo"]) =>
                  setFormData((prev) => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESPESA">Despesas</SelectItem>
                  <SelectItem value="DEPOSITO">Receitas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {categoriaSelecionada ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
