"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./nav-bar";
import { MenuConfig } from "./menuConfig";

interface Props {
  usuarioPodeAdicionarTransacao: boolean;
}

export function SidebarClient({ usuarioPodeAdicionarTransacao }: Props) {
  const pathname = usePathname();

  // Esconde a sidebar na página de login
  if (pathname === "/login") return null;

  if (pathname === "/configuracao" || pathname.startsWith("/configuracao/")) {
    return <MenuConfig />;
  }

  return (
    <Sidebar usuarioPodeAdicionarTransacao={usuarioPodeAdicionarTransacao} />
  );
}
