"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./nav-bar";

interface Props {
  usuarioPodeAdicionarTransacao: boolean;
}

export function SidebarClient({ usuarioPodeAdicionarTransacao }: Props) {
  const pathname = usePathname();

  // Esconde a sidebar na página de login
  if (pathname === "/login") return null;

  return (
    <Sidebar usuarioPodeAdicionarTransacao={usuarioPodeAdicionarTransacao} />
  );
}
