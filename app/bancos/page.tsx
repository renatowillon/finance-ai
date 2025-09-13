"use client";
import { Plus } from "lucide-react";
import { Button } from "../_components/ui/button";
import { useState } from "react";
import { Formbanco } from "../_components/bancos/formBanco";
import { TypeBanco } from "../types";

export const CorBanco = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#8B5CF6", // violet
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
];

const Bancos = () => {
  const [abrirFormBanco, setAbrirFormBanco] = useState(false);
  const [banco, setBanco] = useState<TypeBanco[]>([]);

  function AdicionarBanco(values: Omit<TypeBanco, "id" | "saldoAtual">) {
    const bancoNovo: TypeBanco = {
      ...values,
      id: "1",
      saldoAtual: values.saldoInicial,
    };

    setBanco((prev) => [...prev, bancoNovo]);
    localStorage.setItem("bancos", JSON.stringify(bancoNovo));

    console.log(localStorage.getItem("bancos"));
    console.log(banco);
  }

  return (
    <div className="space-y-6 p-6">
      {/* titulo e botão */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Bancos</h1>
        <Button onClick={() => setAbrirFormBanco(true)}>
          <Plus /> Adicionar Banco
        </Button>
      </div>
      <Formbanco
        open={abrirFormBanco}
        onOpenChange={setAbrirFormBanco}
        onSubmit={AdicionarBanco}
      />
    </div>
  );
};
export default Bancos;
