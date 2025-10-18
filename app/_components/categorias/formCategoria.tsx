"use client";

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
import { categoriaSchema } from "@/app/schemas/categoriaSchema";
import { toast } from "sonner";

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
    if (!open) return; // só atualiza se o modal abrir

    if (categoriaSelecionada) {
      // Editar categoria existente
      setFormData({
        nome: categoriaSelecionada.nome,
        tipo: categoriaSelecionada.tipo,
        userId: Number(userId),
      });
    } else {
      // Criar nova categoria
      setFormData({
        nome: "",
        tipo: "DESPESA",
        userId: Number(userId),
      });
    }
  }, [open, categoriaSelecionada, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = categoriaSchema.safeParse({
      ...formData,
      userId: Number(userId),
    });

    if (!result.success) {
      const mensagem = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      toast.error("Erro ao salvar categoria!", {
        description:
          mensagem.join("\n") || "Preencha todos os campos corretamente.",
        className: "font-bold whitespace-pre-line", // 👈 respeita o \n
      });
      return;
    }

    if (!formData.nome || !userId) return;

    onSubmit(result.data!);

    // reset após criar/editar
    setFormData({
      nome: "",
      tipo: "DESPESA",
      userId: Number(userId),
    });

    onOpenChange(false);
    toast.success("Categoria adicionada com sucesso");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoriaSelecionada
              ? "Atualizar Categoria"
              : "Adicionar Nova Categoria"}
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
              type="button"
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
  );
};
