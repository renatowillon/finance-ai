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

import AddTransactionMobile from "./add-transactions-mobile";

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
    ],
  },
  {
    id: "assinatura",
    label: "Assinatura",
    icon: FileText,
    href: "/subscription",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["carteira"]);
  const [, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

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
            <AddTransactionMobile />

            {/* Aqui você adiciona seu componente de adicionar transação */}
          </div>

          {/* Carteira com dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("carteira")}
              className="flex w-full flex-col items-center justify-center py-2"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors",
                  (isPathActive("/bancos") || isPathActive("/investimentos")) &&
                    "text-primary",
                )}
              >
                <Wallet
                  className={cn(
                    "mb-1 h-5 w-5",
                    isPathActive("/bancos") || isPathActive("/investimentos")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    isPathActive("/bancos") || isPathActive("/investimentos")
                      ? "font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  Carteira
                </span>
              </div>
            </button>

            {/* Dropdown Menu para Carteira */}
            {activeDropdown === "carteira" && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div className="absolute bottom-full left-1/2 z-50 mb-2 min-w-[140px] -translate-x-1/2 transform rounded-lg border bg-background shadow-lg">
                  <Link
                    href="/bancos"
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      "flex items-center rounded-t-lg px-4 py-3 transition-colors hover:bg-muted",
                      isPathActive("/bancos") && "font-medium text-primary",
                    )}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">Bancos</span>
                  </Link>
                  <Link
                    href="/investimentos"
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      "flex items-center rounded-b-lg px-4 py-3 transition-colors hover:bg-muted",
                      isPathActive("/investimentos") &&
                        "font-medium text-primary",
                    )}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span className="text-sm">Investimentos</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mais com dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("mais")}
              className="flex w-full flex-col items-center justify-center py-2"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors",
                  isPathActive("/subscription") && "text-primary",
                )}
              >
                <MoreHorizontal
                  className={cn(
                    "mb-1 h-5 w-5",
                    isPathActive("/subscription")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    isPathActive("/subscription")
                      ? "font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  Mais
                </span>
              </div>
            </button>

            {/* Dropdown Menu para Mais */}
            {activeDropdown === "mais" && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div className="absolute bottom-full right-0 z-50 mb-2 min-w-[140px] rounded-lg border bg-background shadow-lg">
                  <Link
                    href="/subscription"
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-muted",
                      isPathActive("/subscription") &&
                        "font-medium text-primary",
                    )}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="text-sm">Assinatura</span>
                  </Link>
                  {/* Adicione mais opções aqui se necessário */}
                  <div className="my-1 border-t" />
                  <div className="px-4 py-3">
                    <UserMenu />
                  </div>
                </div>
              </>
            )}
          </div>
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
