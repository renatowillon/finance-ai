"use client";
interface FeatureItem {
  ok: boolean;
  text: string;
}

interface PricingCardProps {
  name: string;
  icon: React.ReactNode;
  price: React.ReactNode;
  description: string;
  features: FeatureItem[];
  buttonText: string;
  onClick: () => void;

  highlight?: boolean;
  badge?: string;
  aiTag?: boolean;

  variant?: "denario" | "dracma" | "solidus";

  toolTip: HistoryTooltipProps;
  usuarioPlano: boolean;
}

import { Check, X } from "lucide-react";
import { HistoryTooltipProps, PlanoTooltip } from "./planoTooltip";
import { Badge } from "@/app/_components/ui/badge";

export function PlanoComponente({
  name,
  icon,
  price,
  description,
  features,
  buttonText,
  onClick,

  badge,
  aiTag,
  variant = "denario",
  toolTip,
  usuarioPlano,
}: PricingCardProps) {
  const variants = {
    denario: {
      card: "bg-white/3 border-white/10 hover:border-white/20",
      button:
        "border border-white/15 text-white/70 hover:border-white/30 hover:text-white",
      falseIcon: "text-white/20",
      falseText: "text-white/30",
    },

    dracma: {
      card: "border-violet-500/50 bg-gradient-to-b from-violet-600/20 to-violet-600/5 hover:border-violet-400/60",
      button: "bg-violet-600 hover:bg-violet-500 text-white",
      falseIcon: "text-violet-400/30",
      falseText: "text-white/30",
    },

    solidus: {
      card: "border-indigo-500/30 bg-gradient-to-b from-indigo-600/15 to-indigo-600/5 hover:border-indigo-400/50",
      button:
        "border border-indigo-500/40 bg-indigo-600/20 text-indigo-200 hover:bg-indigo-600/40 hover:text-white",
      falseIcon: "text-white/20",
      falseText: "text-white/30",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition ${style.card}`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-violet-600 px-4 py-1.5 text-xs font-bold text-white">
            {badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>

          <h3 className="flex items-center text-xl font-black text-white">
            {name}
            <PlanoTooltip
              title={toolTip.title}
              symbolicContext={toolTip.symbolicContext}
              civilization={toolTip.civilization}
              era={toolTip.era}
              history={toolTip.history}
              originalName={toolTip.originalName}
            />
          </h3>

          {aiTag && (
            <span className="ml-1 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">
              ✦ IA
            </span>
          )}
          {usuarioPlano && (
            <div className="">
              <Badge>Plano Ativo</Badge>
            </div>
          )}
        </div>

        <div className="mb-3">{price}</div>

        <p className="text-sm text-white/50">{description}</p>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((item) => (
          <li key={item.text} className="flex items-center gap-3 text-sm">
            <span className={item.ok ? "text-emerald-400" : style.falseIcon}>
              {item.ok ? <Check size={16} /> : <X size={16} />}
            </span>

            <span className={item.ok ? "text-white/80" : style.falseText}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className={`block rounded-xl py-3 text-center text-sm font-bold transition ${style.button}`}
      >
        {buttonText}
      </button>
    </div>
  );
}
