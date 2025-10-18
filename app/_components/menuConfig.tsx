import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  BarChart3,
  Bell,
  Activity,
  Database,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { cn } from "../_lib/utils";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    url: "/configuracao",
    icon: LayoutDashboard,
  },
  {
    title: "Usuários",
    url: "/configuracao/usuarios",
    icon: Users,
  },
  {
    title: "Financeiro",
    url: "/configuracao/financeiro",
    icon: TrendingUp,
  },
  {
    title: "Relatórios",
    url: "/configuracao/relatorios",
    icon: BarChart3,
  },
  {
    title: "Notificações",
    url: "/configuracao/notificacoes",
    icon: Bell,
  },
  {
    title: "Atividades",
    url: "/configuracao/atividades",
    icon: Activity,
  },
  {
    title: "Configurações",
    url: "/configuracao/config",
    icon: Settings,
  },
  {
    title: "Sistema",
    url: "/configuracao/sistema",
    icon: Database,
  },
];

export function MenuConfig() {
  const pathname = usePathname();
  const isPathActive = (href?: string) => {
    return pathname === href;
  };
  return (
    <aside className="z-40 flex h-screen w-20 flex-col items-center gap-8 border-r border-border bg-[#061023] py-6">
      {/* Logo Area */}
      <div className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 border-primary/30 p-1 transition-colors">
        <div className="text-2xl font-bold text-primary transition-transform group-hover:scale-110">
          <img src="/logoW-1x1.png" alt="logoW" className="w-14" />
        </div>
      </div>

      {/* Menu Items */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-1 flex-col gap-3">
          {menuItems.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  className={cn(
                    "relative flex items-center justify-center rounded-lg px-4 py-4 transition-colors",
                    isPathActive(item.url)
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                      : "text-muted-foreground hover:bg-primary/40 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 transition-colors" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
