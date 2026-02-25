"use client";

import { Bot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function RouteGuardListener() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Esconde a sidebar na página de login

  useEffect(() => {
    const erro = searchParams.get("erro");

    if (erro === "sem_permissao") {
      setOpen(true);
    }
  }, [searchParams]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="rounded-lg bg-azulEscuro p-6 shadow-lg">
        <div className="flex flex-col items-center text-muted-foreground">
          <Bot size={50} />
          <p className="mb-4">ChatBot não disponivel para esse usuário!</p>
        </div>
        <Button onClick={() => setOpen(false)} className="" variant={"outline"}>
          Fechar
        </Button>
      </div>
    </div>
  );
}
