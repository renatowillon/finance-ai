"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./nav-bar";

export function SidebarClient() {
  const pathname = usePathname();

  // Esconde a sidebar na página de login
  if (pathname === "/login") return null;

  return <Sidebar />;
}
