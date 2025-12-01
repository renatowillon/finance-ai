"use client";

import { useState } from "react";
import {
  Home,
  CreditCard,
  Building2,
  FileText,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Wallet,
  MoreHorizontal,
  Tags,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import { cn } from "../_lib/utils";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import InstallButton from "./InstallButton";
import * as pacote from "@/package.json";

import AddTransactionMobile from "./add-transactions-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "transacoes",
    label: "Transações",
    icon: CreditCard,
    href: "/transactions",
  },
  {
    id: "carteira",
    label: "Carteira",
    icon: Wallet,
    children: [
      {
        id: "bancos",
        label: "Bancos",
        icon: Building2,
        href: "/bancos",
      },
      {
        id: "investimentos",
        label: "Investimentos",
        icon: TrendingUp,
        href: "/investimentos",
      },
      {
        id: "categorias",
        label: "Categorias",
        icon: Tags,
        href: "/categorias",
      },
    ],
  },
  {
    id: "assinatura",
    label: "Assinatura",
    icon: FileText,
    href: "/subscription",
  },
];

interface props {
  usuarioPodeAdicionarTransacao: boolean;
}

export function Sidebar({ usuarioPodeAdicionarTransacao }: props) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["carteira"]);
  const [, setIsMobileMenuOpen] = useState(false);
  // const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openCarteira, setOpenCarteira] = useState(false);

  const toggleExpanded = async (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // const toggleDropdown = (dropdownId: string) => {
  //   setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  // };

  const isPathActive = (href?: string) => {
    return pathname === href;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isPathActive(item.href);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      const anyChildActive = item.children?.some((child) =>
        isPathActive(child.href),
      );

      return (
        <Collapsible
          key={item.id}
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground",
                level > 0 && "pl-8",
                anyChildActive && "font-semibold text-primary",
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 overflow-hidden transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link href={item.href!} key={item.id} onClick={closeMobileMenu}>
        <Button
          variant="ghost"
          className={cn(
            "h-auto w-full justify-start px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground",
            level > 0 && "pl-8",
            isActive && "font-semibold text-primary",
          )}
        >
          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="text-left font-medium">{item.label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-5 items-center">
          {/* Home */}
          <Link
            href="/"
            className="relative flex flex-col items-center justify-center py-2"
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors",
                isPathActive("/") && "text-primary",
              )}
            >
              <Home
                className={cn(
                  "mb-1 h-5 w-5",
                  isPathActive("/") ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  isPathActive("/")
                    ? "font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                Principal
              </span>
            </div>
          </Link>

          {/* Transações */}
          <Link
            href="/transactions"
            className="relative flex flex-col items-center justify-center py-2"
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors",
                isPathActive("/transactions") && "text-primary",
              )}
            >
              <CreditCard
                className={cn(
                  "mb-1 h-5 w-5",
                  isPathActive("/transactions")
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  isPathActive("/transactions")
                    ? "font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                Transações
              </span>
            </div>
          </Link>

          {/* Botão Adicionar - Espaço reservado para o componente */}
          <div className="-mt-10 flex items-center justify-center">
            <AddTransactionMobile
              usuarioPodeAdicionarTransacao={usuarioPodeAdicionarTransacao}
            />

            {/* Aqui você adiciona seu componente de adicionar transação */}
          </div>

          {/* Carteira com dropdown */}
          <Sheet open={openCarteira} onOpenChange={setOpenCarteira}>
            <SheetTrigger asChild>
              <button className="flex w-full flex-col items-center justify-center py-2">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors",
                    open ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Wallet className="mb-1 h-5 w-5" />
                  <span
                    className={cn(
                      "text-xs",
                      open
                        ? "font-medium text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Carteira
                  </span>
                </div>
              </button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="rounded-t-2xl border-t bg-background pb-8"
            >
              <SheetHeader className="flex items-center justify-between">
                <SheetTitle className="w-full text-center text-muted-foreground">
                  Carteira
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-2 px-2">
                <Link
                  href="/bancos"
                  onClick={() => setOpenCarteira(false)}
                  className={cn(
                    "flex items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted",
                    isPathActive("/bancos") && "font-medium text-primary",
                  )}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="text-sm">Bancos</span>
                </Link>
                <Link
                  href="/investimentos"
                  onClick={() => setOpenCarteira(false)}
                  className={cn(
                    "flex items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted",
                    isPathActive("/investimentos") &&
                      "font-medium text-primary",
                  )}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span className="text-sm">Investimentos</span>
                </Link>
                <Link
                  href="/categorias"
                  onClick={() => setOpenCarteira(false)}
                  className={cn(
                    "flex items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted",
                    isPathActive("/categorias") && "font-medium text-primary",
                  )}
                >
                  <Tags className="mr-2 h-4 w-4" />
                  <span className="text-sm">Categorias</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mais com dropdown */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex w-full flex-col items-center justify-center py-2">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors",
                    open ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <MoreHorizontal className="mb-1 h-5 w-5" />
                  <span
                    className={cn(
                      "text-xs",
                      open
                        ? "font-medium text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Mais
                  </span>
                </div>
              </button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="rounded-t-2xl border-t bg-background pb-8"
            >
              <SheetHeader className="flex items-center justify-between">
                <SheetTitle className="w-full text-center text-muted-foreground">
                  Mais opções
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-2 px-2">
                <Link
                  href="/subscription"
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-lg bg-azulMuted px-4 py-3 transition-colors hover:bg-muted"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  Assinatura
                </Link>

                <div className="rounded-xl bg-muted/30 p-4">
                  <UserMenu />
                  <div className="flex items-center justify-center gap-3 px-3 text-[12px] text-muted-foreground">
                    <p>Versão: {pacote.version}</p>
                    <p>Build: {pacote.builder}</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar - Mantido sem alterações */}
      <div className="hidden h-screen w-64 flex-col rounded-md border shadow-sm md:flex">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-center">
            <Image
              src="/logo-wfinance.png"
              width={173}
              height={39}
              alt="Wfinance"
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <UserMenu />
          <div className="flex items-center justify-center gap-3 px-3 text-[10px] text-muted-foreground">
            <p>Versão: {pacote.version}</p>
            <p>Build: {pacote.builder}</p>
          </div>
        </div>

        <div className="border-t">
          <InstallButton />
        </div>
      </div>

      {/* Padding inferior para compensar o menu fixo no mobile */}
      {/* <div className="h-16 md:hidden" /> */}
    </>
  );
}
