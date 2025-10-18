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

  // Atualiza o form quando o modal abre ou categoriaSelecionada muda
  useEffect(() => {
    if (userId) {
      // Garante que o formData tenha o userId correto
      setFormData((prev) => ({ ...prev, userId: Number(userId) }));

      // Se o modal estava aberto antes do userId existir, resetamos ele
      if (!open) return; // não faz nada se modal fechado
      setFormData({
        nome: categoriaSelecionada?.nome || "",
        tipo: categoriaSelecionada?.tipo || "DESPESA",
        userId: Number(userId),
      });
    } else {
      // Logout: fecha o modal e limpa o form
      setFormData({
        nome: "",
        tipo: "DESPESA",
        userId: undefined,
      });
      onOpenChange(false);
    }
  }, [userId, open, categoriaSelecionada, onOpenChange]);

  // Garante que o userId no formData seja atualizado se mudar depois
  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, userId: Number(userId) }));
    }
  }, [userId]);

  if (!userId) {
    return <div>Carregando...</div>; // Spinner ou outra UI enquanto espera
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;

    onSubmit({
      nome: formData.nome,
      tipo: formData.tipo,
      userId: Number(userId),
    });

    // Reset form
    setFormData({
      nome: "",
      tipo: "DESPESA",
      userId: Number(userId),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoriaSelecionada ? "Atualizar Banco" : "Adicionar Novo Banco"}
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
  );
};
