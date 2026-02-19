"use client";
import { useQuery } from "@tanstack/react-query";
import { TituloPadrao } from "../_components/tituloPadrao";
import { toast } from "sonner";
import { fetchUsuarios } from "@/app/fetche/usuarioFetch";
import { User } from "@prisma/client";
import { Input } from "@/app/_components/ui/input";
import { Edit, Search } from "lucide-react";
import { Card } from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { useState } from "react";
import { Loading } from "@/app/_components/loading";
import { FormUsuario } from "../_components/formUsuario";
import { TypeUsuario, TypeUsuarioInput } from "@/app/types";
import { useMutations } from "@/app/mutetions/usuarioMutation";

const Usuarios = () => {
  const [input, setInput] = useState("");
  const [filtrado, setFiltrado] = useState<User[] | null>(null);
  const [open, setOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<TypeUsuario>();
  const { criarMutation, atualizarMutation } = useMutations();
  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
  });

  if (isLoading) return <Loading />;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInput(value);
    if (value.trim() === "") {
      setFiltrado(null);
    }
  }

  function handleFiltro(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const palavraDigitada = input.toLowerCase();
      const resultado = usuarios.filter(
        (usuario: User) =>
          usuario.name.toLowerCase().includes(palavraDigitada) ||
          usuario.email.toLowerCase().includes(palavraDigitada),
      );
      if (resultado.length === 0) {
        toast.warning("Usuário não localizado");
      }
      setFiltrado(resultado);
    }

    if (e.key === "Escape") {
      setInput("");
      setFiltrado(null);
    }
  }
  function addUsuario() {
    setUsuarioSelecionado(undefined);
    setOpen(true);
    // toast.info("Em breve");
  }

  const listaDeUsuarios = filtrado ?? usuarios;

  const AdicionarUsuario = (values: Omit<TypeUsuarioInput, "id">) => {
    if (usuarioSelecionado) {
      const usuarioParaAtualizar = usuarioSelecionado;
      const usuarioAtualizado: TypeUsuario = {
        id: usuarioParaAtualizar.id,
        email: values.email,
        name: values.name,
        plano: values.plano,
        status: values.status,
        updateAt: new Date(),
      };
      if (values.senha && values.senha.trim() !== "") {
        usuarioAtualizado.senha = values.senha;
      }

      atualizarMutation.mutate({
        id: usuarioSelecionado.id,
        usuario: usuarioAtualizado,
      });
    } else {
      const usuarioNovo: TypeUsuarioInput = {
        ...values,
      };
      criarMutation.mutate(usuarioNovo);
    }

    console.log(values);
  };
  const EditarUsuario = (values: TypeUsuario) => {
    setUsuarioSelecionado(values);
    setOpen(true);
    console.log(values);
  };

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Gerenciamento de Usuários"
        descricao="Gerencie todos os usuários cadastrados no wFinance"
        onClick={addUsuario}
        tituloButao="Novo Usuário"
      />
      <FormUsuario
        open={open}
        onOpenChange={setOpen}
        onSubmit={AdicionarUsuario}
        usuarioSelecionado={usuarioSelecionado!}
      />

      <Card className="space-y-4 p-6">
        <p className="text-2xl font-bold">Usuários Cadastrados</p>
        <div className="relative flex items-center justify-center gap-3 rounded-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-azulEscuro pl-9 focus:border-none focus:outline-none"
            placeholder={`buscar por nome ou email e pressione "Enter"...`}
            onChange={handleChange}
            onKeyDown={handleFiltro}
          />
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black">Id</TableHead>
                <TableHead className="font-black">Nome</TableHead>
                <TableHead className="font-black">Email</TableHead>
                <TableHead className="font-black">Plano</TableHead>
                <TableHead className="font-black">Mensalidade</TableHead>
                <TableHead className="font-black">Data de Cadastro</TableHead>
                <TableHead className="font-black">Status</TableHead>
                <TableHead className="font-black">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listaDeUsuarios.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plano}</TableCell>
                  <TableCell>
                    {user.plano === "PREMIUM" ? "R$ 19,00" : "R$ 0,00"}
                  </TableCell>
                  <TableCell>
                    <p>
                      {new Date(user.createAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge>{user.status === true ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => EditarUsuario(user)}
                      className="bg-azulEscuro hover:bg-azulEscuro"
                    >
                      <Edit /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
export default Usuarios;
