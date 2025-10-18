"use client";
import { UserPlus } from "lucide-react";
import { Button } from "../_components/ui/button";

const Configuracao = () => {
  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Área Administrativa</h1>
        <Button
          onClick={() => {
            // setCategoriaSelecionado(undefined);
            // setAbrirFormCategoria(true);
          }}
        >
          <UserPlus /> Novo Usuário
        </Button>
      </div>
    </div>
  );
};
export default Configuracao;
