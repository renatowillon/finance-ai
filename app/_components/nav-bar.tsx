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
  Menu,
  X,
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
        href: "/carteira/bancos",
      },
      {
        id: "investimentos",
        label: "Investimentos",
        icon: TrendingUp,
        href: "/carteira/investimentos",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
                anyChildActive && "font-semibold text-purple-700",
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
            isActive && "font-semibold text-purple-700",
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
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b bg-background p-4 md:hidden">
        <div className="flex items-center">
          <Image
            src="/logo-wfinance.png"
            width={120}
            height={27}
            alt="Wfinance"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="h-9 w-9 p-0"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
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

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background shadow-lg transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center">
            <Image
              src="/logo-wfinance.png"
              width={120}
              height={27}
              alt="Wfinance"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileMenu}
            className="h-9 w-9 p-0"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </nav>

        {/* Mobile Footer */}
        <div>
          <InstallButton />
        </div>
        <div className="border-t p-4">
          <UserMenu />
        </div>
      </div>
    </>
  );
}
