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

const Usuarios = () => {
  function addUsuario() {
    toast.info("Em breve");
  }

  const { data } = useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
  });

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <TituloPadrao
        titulo="Gerenciamento de Usuários"
        descricao="Gerencie todos os usuários cadastrados no wFinance"
        onClick={addUsuario}
        tituloButao="Novo Usuário"
      />
      <Card className="space-y-4 p-6">
        <p className="text-2xl font-bold">Usuários Cadastrados</p>
        <div className="relative flex items-center justify-center gap-3 rounded-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-azulEscuro pl-9 focus:border-none focus:outline-none"
            placeholder={`buscar por nome ou email...`}
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
              {data?.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plano}</TableCell>
                  <TableCell>
                    {user.plano === "PREMIUM" ? "R$ 49,00" : "-"}
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
                    <Button className="bg-azulEscuro hover:bg-azulEscuro">
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
