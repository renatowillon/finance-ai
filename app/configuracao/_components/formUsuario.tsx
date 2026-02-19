import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Switch } from "@/app/_components/ui/switch";
import {
  UsuarioFormData,
  usuarioSchema,
  UsuarioUpdateFormData,
  usuarioUpdateSchema,
} from "@/app/schemas/usuarioSchema";
import { TypeUsuario } from "@/app/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormUsuarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (usuario: UsuarioFormData | UsuarioUpdateFormData) => void;
  usuarioSelecionado: TypeUsuario;
}

export const FormUsuario = ({
  open,
  onOpenChange,
  onSubmit,
  usuarioSelecionado,
}: FormUsuarioProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    senha: "",
    status: true,
    plano: "FREE" as UsuarioFormData["plano"],
  });

  useEffect(() => {
    if (!open) return;
    if (usuarioSelecionado) {
      setFormData({
        name: usuarioSelecionado.name,
        email: usuarioSelecionado.email,
        senha: "",
        status: usuarioSelecionado.status,
        plano: usuarioSelecionado.plano,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        senha: "",
        status: true,
        plano: "FREE" as UsuarioFormData["plano"],
      });
    }
  }, [open, usuarioSelecionado]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = usuarioSelecionado
      ? usuarioUpdateSchema.safeParse(formData)
      : usuarioSchema.safeParse(formData);

    if (!result.success) {
      const mensagem = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      toast.error("Erro ao criar usuario!", {
        description:
          mensagem.join("\n") || "Preencha todos os campos corretamente.",
        className: "font-bold whitespace-pre-line", // 👈 respeita o \n
      });
      return;
    }

    onSubmit(result.data!);
    onOpenChange(false);
    console.log(formData);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {usuarioSelecionado ? "Atualizar Usuário" : "Criar Usuário"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nome do Usuário"
            />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Digite um email válido"
            />
          </div>
          <div className="space-y-1">
            <Label>Senha</Label>
            <Input
              type={"password"}
              value={formData.senha}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, senha: e.target.value }))
              }
            />
          </div>
          <div className="flex w-full gap-3 space-y-1">
            <div className="flex-1 space-y-1">
              <Label>Plano</Label>
              <Select
                value={formData.plano}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    plano: value as UsuarioFormData["plano"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"FREE"}>Free</SelectItem>
                  <SelectItem value={"PREMIUM"}>Premium</SelectItem>
                  <SelectItem value={"DEV"}>Desenvolvedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 items-center justify-center gap-3 space-y-1">
              <Label>Status</Label>
              <Switch
                id="baixado"
                checked={formData.status}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, status: checked }))
                }
              />
            </div>
          </div>
          <div className="flex w-full gap-3">
            <Button
              className="flex-1"
              variant={"ghost"}
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button className="flex-1" variant={"default"}>
              {usuarioSelecionado ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
