"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Github, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── tiny icon components (inline SVG, zero deps) ──────────────────────────
const IconChat = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4-.837L3 20l1.088-3.808A7.64 7.64 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
    />
  </svg>
);
const IconBolt = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m13 2-9.5 12.5H12l-1 7.5 9.5-12.5H12l1-7.5Z"
    />
  </svg>
);
const IconShield = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);
const IconChart = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);
const IconCard = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);
const IconSparkle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);
const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5 flex-shrink-0"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);
const IconX = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5 flex-shrink-0"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);
const IconArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

// ─── typing animation component ────────────────────────────────────────────
const messages = [
  "Gastei R$ 45 no almoço hoje",
  "Paguei a fatura do cartão: R$ 1.230",
  "Recebi meu salário de R$ 5.000",
  "Comprei gasolina por R$ 180",
  "Recebi R$ 800 de freela",
];

function TypingDemo() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "deleting">(
    "typing",
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = messages[msgIdx];

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 55);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("waiting"), 1800);
      }
    } else if (phase === "waiting") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), 2500);
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 30);
      } else {
        setMsgIdx((i) => (i + 1) % messages.length);
        setPhase("typing");
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, msgIdx]);

  const responses = [
    { cat: "🍽️ Alimentação", val: "- R$ 45,00", color: "text-red-400" },
    {
      cat: "💳 Cartão de Crédito",
      val: "- R$ 1.230,00",
      color: "text-red-400",
    },
    { cat: "💰 Salário", val: "+ R$ 5.000,00", color: "text-emerald-400" },
    { cat: "⛽ Transporte", val: "- R$ 180,00", color: "text-red-400" },
    { cat: "💼 Renda Extra", val: "+ R$ 800,00", color: "text-emerald-400" },
  ];
  const r = responses[msgIdx];

  return (
    <div className="mx-auto min-h-80 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0D182E]/80 shadow-2xl backdrop-blur-md">
      {/* chat header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
          w
        </div>
        <div>
          <p className="text-sm font-semibold text-white">wFinance IA</p>
          <p className="text-xs text-emerald-400">● online</p>
        </div>
      </div>

      {/* messages body */}
      <div className="min-h-52 space-y-3 px-4 py-4">
        {/* user bubble */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-violet-600 px-3 py-2 text-sm text-white">
            {displayed}
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white/80 align-middle" />
          </div>
        </div>

        {/* bot response — only show when done typing */}
        {phase === "waiting" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] space-y-1 rounded-2xl rounded-tl-sm border border-white/10 bg-[#061023] px-3 py-2 text-sm text-white">
              <p className="text-xs text-white/50">
                Entendido! Registrado como:
              </p>
              <p className="font-semibold">{r.cat}</p>
              <p className={`text-base font-bold ${r.color}`}>{r.val}</p>
              <p className="text-xs text-white/60">✓ Dashboard atualizado</p>
            </div>
          </div>
        )}
      </div>

      {/* fake input */}
      <div className="border-t border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/40">
          <span className="flex-1">Digite aqui o que aconteceu...</span>
          <span className="rounded-lg bg-violet-600/30 px-2 py-1 text-violet-300">
            ↵
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── tooltip component for pricing history ──────────────────────────────────
interface HistoryTooltipProps {
  title: string;
  originalName: string;
  era: string;
  civilization: string;
  history: string[];
  symbolicContext: string[];
}

const HistoryTooltip = ({
  title,
  originalName,
  era,
  civilization,
  history,
  symbolicContext,
}: HistoryTooltipProps) => {
  return (
    <div className="group relative ml-2 flex cursor-help items-center justify-center">
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/50 transition-colors group-hover:border-violet-500/50 group-hover:bg-violet-500/10 group-hover:text-violet-300">
        i
      </span>

      <div className="absolute bottom-full left-1/2 z-50 mb-3 hidden w-[320px] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-white/10 bg-[#0f172a]/95 p-5 text-sm shadow-2xl shadow-black/50 backdrop-blur-xl group-hover:flex">
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#0f172a]" />

        <div>
          <h4 className="mb-2 font-black text-white">{title}</h4>
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white/80">Original:</span>{" "}
            {originalName}
            <br />
            <span className="font-semibold text-white/80">Época:</span> {era}
            <br />
            <span className="font-semibold text-white/80">
              Civilização:
            </span>{" "}
            {civilization}
          </p>
        </div>

        <div>
          <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-400">
            📖 História
          </h5>
          <ul className="space-y-1 text-xs text-white/70">
            {history.map((line, i) => (
              <li key={i} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            💡 Significado Simbólico
          </h5>
          <ul className="space-y-1 text-xs text-white/70">
            {symbolicContext.map((sym, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-emerald-400/70">👉</span>
                <span>{sym}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ─── main page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const router = useRouter();
  const githubLink = () => {
    router.replace("https://renatowillon.vercel.app/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/eu", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(!!d.userId))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const ctaHref = isLoggedIn ? "/" : "/login";
  const ctaLabel = isLoggedIn ? "Acessar dashboard" : "Login";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white selection:bg-violet-600/40">
      {/* ── floating nav ───────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/15 bg-[#030712]/85 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "border-white/6 bg-[#030712]/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* logo */}
          <a href="/lp" className="flex items-center">
            <Image
              src="/logo-wfinance.png"
              alt="wFinance"
              width={130}
              height={36}
              priority
            />
          </a>
          <nav className="hidden gap-8 text-sm text-white/70 md:flex">
            <a href="#como-funciona" className="transition hover:text-white">
              Como funciona
            </a>
            <a href="#beneficios" className="transition hover:text-white">
              Benefícios
            </a>
            <a href="#para-quem" className="transition hover:text-white">
              Para quem é
            </a>
            <a href="#planos" className="transition hover:text-white">
              Planos
            </a>
          </nav>
          <div className="flex items-center justify-center gap-3">
            <a
              href={ctaHref}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <LogIn size={20} />
              {isLoggedIn === null ? "..." : ctaLabel}
            </a>
          </div>
        </div>
      </header>

      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="relative mt-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
        {/* background glow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <IconSparkle />
          <span>Assistente financeiro com Inteligência Artificial</span>
        </div>
        <div className="flex">
          <div className="flex flex-col items-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
              <div className="absolute left-1/4 top-40 h-80 w-80 rounded-full bg-blue-700/10 blur-[80px]" />
              <div className="absolute right-1/4 top-60 h-80 w-80 rounded-full bg-indigo-700/10 blur-[80px]" />
            </div>

            {/* pill badge */}

            {/* headline */}
            <h1 className="relative mb-5 max-w-3xl text-balance text-5xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              Pare de perder{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                o controle
              </span>{" "}
              do seu dinheiro.
            </h1>

            <p className="relative mb-10 max-w-xl text-lg leading-relaxed text-white/60">
              Escreva o que aconteceu com seu dinheiro — a IA organiza,
              categoriza e atualiza tudo automaticamente. Sem planilhas. Sem
              formulários. Só resultado.
            </p>

            {/* CTAs */}
            <div className="relative mb-16 flex flex-col items-center gap-3 sm:flex-row">
              <a
                id="cta"
                href="/login"
                className="group flex items-center gap-2 rounded-2xl bg-violet-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/40 transition hover:bg-violet-500 hover:shadow-violet-500/50"
              >
                Teste grátis agora
                <span className="transition-transform group-hover:translate-x-1">
                  <IconArrow />
                </span>
              </a>
              <a
                href="#como-funciona"
                className="flex items-center gap-2 rounded-2xl border border-white/15 px-7 py-4 text-base font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          {/* hero demo card */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 rounded-3xl bg-violet-600/20 blur-xl" />
              <TypingDemo />
            </div>

            {/* social proof */}
            <p className="relative mt-10 text-sm text-white/40">
              Sem cartão de crédito · Plano gratuito disponível · Cancele quando
              quiser
            </p>
          </div>
        </div>
        {/* ── marquee ───────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden py-5">
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#030712] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#030712] to-transparent" />

          <style>{`
                    @keyframes marquee-ltr {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes marquee-rtl {
                        0%   { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .marquee-fwd { animation: marquee-ltr 62s linear infinite; }
                    .marquee-rev { animation: marquee-rtl 58s linear infinite; }
                    .marquee-fwd:hover, .marquee-rev:hover { animation-play-state: paused; }
                `}</style>

          {/* row 1 — goes left */}
          <div className="marquee-fwd mb-3 flex w-max gap-3">
            {[
              { icon: "⚡", label: "Registro instantâneo" },
              { icon: "🤖", label: "IA que entende você" },
              { icon: "📊", label: "Dashboard em tempo real" },
              { icon: "💳", label: "Cartão de crédito integrado" },
              { icon: "🎯", label: "Zero planilhas" },
              { icon: "🔒", label: "Dados seguros" },
              { icon: "✨", label: "Categorização automática" },
              { icon: "📈", label: "Visão clara das finanças" },
              { icon: "🤝", label: "Ideal para MEIs" },
              { icon: "🚀", label: "Simples e rápido" },
              { icon: "⚡", label: "Registro instantâneo" },
              { icon: "🤖", label: "IA que entende você" },
              { icon: "📊", label: "Dashboard em tempo real" },
              { icon: "💳", label: "Cartão de crédito integrado" },
              { icon: "🎯", label: "Zero planilhas" },
              { icon: "🔒", label: "Dados seguros" },
              { icon: "✨", label: "Categorização automática" },
              { icon: "📈", label: "Visão clara das finanças" },
              { icon: "🤝", label: "Ideal para MEIs" },
              { icon: "🚀", label: "Simples e rápido" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-shrink-0 items-center gap-2.5 rounded-full bg-violet-600/10 px-5 py-2 text-sm font-medium text-violet-300/70"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* row 2 — goes right */}
          <div className="marquee-rev flex w-max gap-3">
            {[
              { icon: "💬", label: "Controle por conversa" },
              { icon: "🧠", label: "Organização sem esforço" },
              { icon: "📱", label: "Funciona no celular" },
              { icon: "🏦", label: "Múltiplas contas" },
              { icon: "📅", label: "Controle mensal" },
              { icon: "💡", label: "Insights inteligentes" },
              { icon: "⏱️", label: "Economia de tempo" },
              { icon: "😌", label: "Tranquilidade financeira" },
              { icon: "🎨", label: "Interface moderna" },
              { icon: "✅", label: "Sem erros de lançamento" },
              { icon: "💬", label: "Controle por conversa" },
              { icon: "🧠", label: "Organização sem esforço" },
              { icon: "📱", label: "Funciona no celular" },
              { icon: "🏦", label: "Múltiplas contas" },
              { icon: "📅", label: "Controle mensal" },
              { icon: "💡", label: "Insights inteligentes" },
              { icon: "⏱️", label: "Economia de tempo" },
              { icon: "😌", label: "Tranquilidade financeira" },
              { icon: "🎨", label: "Interface moderna" },
              { icon: "✅", label: "Sem erros de lançamento" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-shrink-0 items-center gap-2.5 rounded-full bg-violet-600/10 px-5 py-2 text-sm font-medium text-violet-300/70"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── como funciona ──────────────────────────────────────────────── */}
      <section id="como-funciona" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
              Simples assim
            </p>
            <h2 className="text-4xl font-black text-white">
              Em 3 passos, suas finanças organizadas
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: <IconChat />,
                title: "Escreva naturalmente",
                desc: '"Gastei R$ 120 no mercado" ou "Recebi R$ 2.000 de freela" — escreva como quiser, a IA entende.',
                color: "from-violet-600/20 to-violet-600/5",
                border: "border-violet-500/20",
                iconBg: "bg-violet-600/20 text-violet-400",
              },
              {
                step: "02",
                icon: <IconSparkle />,
                title: "A IA processa tudo",
                desc: "Categorias, tipo de lançamento, data — tudo identificado e estruturado automaticamente em frações de segundo.",
                color: "from-indigo-600/20 to-indigo-600/5",
                border: "border-indigo-500/20",
                iconBg: "bg-indigo-600/20 text-indigo-400",
              },
              {
                step: "03",
                icon: <IconChart />,
                title: "Dashboard sempre atualizado",
                desc: "Visualize seu saldo, gastos por categoria e evolução financeira em tempo real — claro, limpo e objetivo.",
                color: "from-blue-600/20 to-blue-600/5",
                border: "border-blue-500/20",
                iconBg: "bg-blue-600/20 text-blue-400",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`group relative rounded-2xl border ${item.border} bg-gradient-to-b ${item.color} p-8 transition-all hover:scale-[1.02] hover:shadow-2xl`}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-4xl font-black text-white/10">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── benefícios ───────────────────────────────────────────────────── */}
      <section id="beneficios" className="relative px-5 py-24">
        {/* background subtle lines */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
              Vantagens reais
            </p>
            <h2 className="text-4xl font-black text-white">
              A IA trabalha para você,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                não o contrário
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Cada funcionalidade foi pensada para eliminar atrito e dar a você
              clareza sobre suas finanças.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <IconBolt />,
                iconBg: "bg-amber-500/10 text-amber-400",
                title: "Registro em segundos",
                desc: "Nada de abrir planilhas ou preencher formulários. É rápido como mandar uma mensagem.",
              },
              {
                icon: <IconSparkle />,
                iconBg: "bg-violet-500/10 text-violet-400",
                title: "Organização automática",
                desc: "Categorias criadas e organizadas pela IA. Seus lançamentos nunca mais ficarão bagunçados.",
              },
              {
                icon: <IconShield />,
                iconBg: "bg-emerald-500/10 text-emerald-400",
                title: "Menos erros e esquecimentos",
                desc: "A IA valida e estrutura cada entrada. Menos chance de lançamentos errados ou perdidos.",
              },
              {
                icon: <IconChart />,
                iconBg: "bg-blue-500/10 text-blue-400",
                title: "Visão clara das suas finanças",
                desc: "Dashboard limpo e objetivo. Saldo, gastos e tendências em uma só tela, sem ruído.",
              },
              {
                icon: <IconCard />,
                iconBg: "bg-pink-500/10 text-pink-400",
                title: "Cartão de crédito integrado",
                desc: "Controle de faturas e lançamentos no crédito de forma simples e centralizada.",
              },
              {
                icon: <IconChat />,
                iconBg: "bg-indigo-500/10 text-indigo-400",
                title: "Financeiro por conversa",
                desc: "Você não precisa aprender nada. Escreva como fala — a IA faz o resto.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-white/8 bg-white/3 group rounded-2xl border p-6 transition-all hover:border-violet-500/30 hover:bg-white/5"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── comparação ───────────────────────────────────────────────────── */}
      <section id="para-quem" className="px-5 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
              A diferença é clara
            </p>
            <h2 className="text-4xl font-black text-white">
              Por que trocar a planilha pelo wFinance?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* planilha */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-2xl">
                  📊
                </div>
                <h3 className="text-lg font-bold text-white/70">
                  Planilhas & apps antigos
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Precisa abrir e preencher manualmente",
                  "Fácil de esquecer ou errar o lançamento",
                  "Interface confusa e intimidadora",
                  "Sem inteligência, só tabelas",
                  "Você trabalha pela planilha",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-sm text-white/55"
                  >
                    <span className="text-red-400">
                      <IconX />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* wfinance */}
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-600/15 to-violet-600/5 p-7 shadow-lg shadow-violet-900/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30 text-2xl">
                  ✦
                </div>
                <h3 className="text-lg font-bold text-white">wFinance</h3>
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
                  NOVO
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  "Registro rápido em linguagem natural",
                  "IA organiza e valida automaticamente",
                  "Interface simples e elegante",
                  "Categorização e insights inteligentes",
                  "A IA trabalha para você",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <span className="text-emerald-400">
                      <IconCheck />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── para quem ────────────────────────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-white">
              Feito especialmente para você que...
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { emoji: "😩", text: "Odeia planilhas mas precisa de controle" },
              {
                emoji: "🏃",
                text: "Não tem tempo para preencher apps complicados",
              },
              { emoji: "💼", text: "É MEI ou pequeno empreendedor" },
              {
                emoji: "🎯",
                text: "Quer mais clareza sobre onde o dinheiro vai",
              },
              { emoji: "📱", text: "Prefere resolver tudo pelo celular" },
              { emoji: "🧠", text: "Quer organização sem esforço" },
            ].map((item) => (
              <div
                key={item.text}
                className="border-white/8 bg-white/3 flex items-center gap-4 rounded-xl border px-5 py-4 transition hover:border-violet-500/25 hover:bg-white/5"
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-medium text-white/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── planos ────────────────────────────────────────────────────────── */}
      <section id="planos" className="relative px-5 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
              Planos
            </p>
            <h2 className="text-4xl font-black text-white">
              Escolha o plano{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                ideal para você
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/55">
              Comece grátis e evolua conforme sua necessidade. Sem taxas
              ocultas.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* ── Denário (gratuito) ─────────────────────── */}
            <div className="bg-white/3 flex flex-col rounded-2xl border border-white/10 p-8 transition hover:border-white/20">
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <h3 className="flex items-center text-xl font-black text-white">
                    Denário
                    <HistoryTooltip
                      title="Denário"
                      originalName="Denarius (latim)"
                      era="~211 a.C. – século III d.C."
                      civilization="Roma Antiga"
                      history={[
                        "Moeda de prata mais importante do Império Romano.",
                        "Surgiu para padronizar comércio e pagar soldados.",
                        "1 Denário ≈ pagamento diário de um soldado.",
                        "Influenciou palavras como: dinheiro, denaro, dinero.",
                      ]}
                      symbolicContext={[
                        "Base, início, acesso",
                        "O primeiro contato com a organização financeira",
                      ]}
                    />
                  </h3>
                </div>
                <div className="mb-4 flex items-end gap-1">
                  <span className="text-4xl font-black text-white">Grátis</span>
                </div>
                <p className="text-sm text-white/50">
                  Para quem quer começar a organizar as finanças sem custo.
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {[
                  { ok: true, text: "Até 50 transações por mês" },
                  { ok: true, text: "Dashboard básico" },
                  { ok: true, text: "Controle de receitas e despesas" },
                  { ok: false, text: "Controle de bancos" },
                  { ok: false, text: "Controle de investimentos" },
                  { ok: false, text: "Categorias personalizadas" },
                  { ok: false, text: "Assistente com IA" },
                ].map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className={item.ok ? "text-emerald-400" : "text-white/20"}
                    >
                      {item.ok ? <IconCheck /> : <IconX />}
                    </span>
                    <span
                      className={item.ok ? "text-white/80" : "text-white/30"}
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={ctaHref}
                className="block rounded-xl border border-white/15 py-3 text-center text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Começar grátis
              </a>
            </div>

            {/* ── Dracma (popular) ───────────────────────── */}
            <div className="relative flex flex-col rounded-2xl border border-violet-500/50 bg-gradient-to-b from-violet-600/20 to-violet-600/5 p-8 shadow-2xl shadow-violet-900/30 transition hover:border-violet-400/60">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-600/40">
                  ⭐ Mais popular
                </span>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <h3 className="flex items-center text-xl font-black text-white">
                    Dracma
                    <HistoryTooltip
                      title="Dracma"
                      originalName="Drachmē (δραχμή – grego antigo)"
                      era="~600 a.C. – período helenístico"
                      civilization="Grécia Antiga"
                      history={[
                        "Uma das primeiras moedas padronizadas do mundo.",
                        "Referência no comércio do Mediterrâneo.",
                        "Base da economia grega clássica.",
                        "Voltou a ser usada na Grécia moderna até o Euro.",
                      ]}
                      symbolicContext={[
                        "Equilíbrio, controle, racionalidade",
                        "Representa análise e gestão consciente",
                      ]}
                    />
                  </h3>
                </div>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-sm font-medium text-white/40">R$</span>
                  <span className="text-5xl font-black leading-none text-white">
                    19
                  </span>
                  <span className="mb-1 text-lg font-semibold text-white/60">
                    ,00
                  </span>
                  <span className="mb-1 text-sm text-white/40">/mês</span>
                </div>
                <p className="text-sm text-white/50">
                  Acesso completo ao sistema, sem limitações de transações.
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {[
                  { ok: true, text: "Transações ilimitadas" },
                  { ok: true, text: "Dashboard completo" },
                  { ok: true, text: "Controle de receitas e despesas" },
                  { ok: true, text: "Controle de bancos" },
                  { ok: true, text: "Controle de investimentos" },
                  { ok: true, text: "Categorias personalizadas" },
                  { ok: false, text: "Assistente com IA" },
                ].map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className={
                        item.ok ? "text-emerald-400" : "text-violet-400/30"
                      }
                    >
                      {item.ok ? <IconCheck /> : <IconX />}
                    </span>
                    <span className={item.ok ? "text-white" : "text-white/30"}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={ctaHref}
                className="block rounded-xl bg-violet-600 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-500"
              >
                Assinar Dracma
              </a>
            </div>

            {/* ── Solidus (completo + IA) ────────────────── */}
            <div className="flex flex-col rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-600/15 to-indigo-600/5 p-8 transition hover:border-indigo-400/50">
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <h3 className="flex items-center text-xl font-black text-white">
                    Solidus
                    <HistoryTooltip
                      title="Solidus"
                      originalName="Solidus (latim)"
                      era="~312 d.C. – mais de 700 anos circulando"
                      civilization="Império Bizantino/Romano Tardio"
                      history={[
                        "Criada por Constantino, uma das mais estáveis da história.",
                        "Feita em ouro puro com valor inalterado por séculos.",
                        "A palavra 'sold', 'saldo' e 'solid' vêm da mesma raiz.",
                      ]}
                      symbolicContext={[
                        "Solidez, segurança, inteligência estratégica",
                        "Nível máximo de maturidade financeira",
                      ]}
                    />
                  </h3>
                  <span className="ml-1 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">
                    ✦ IA
                  </span>
                </div>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-sm font-medium text-white/40">R$</span>
                  <span className="text-5xl font-black leading-none text-white">
                    49
                  </span>
                  <span className="mb-1 text-lg font-semibold text-white/60">
                    ,99
                  </span>
                  <span className="mb-1 text-sm text-white/40">/mês</span>
                </div>
                <p className="text-sm text-white/50">
                  Experiência completa com inteligência artificial integrada.
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {[
                  { ok: true, text: "Tudo do plano Dracma" },
                  { ok: true, text: "Transações ilimitadas" },
                  {
                    ok: true,
                    text: "Controle total de bancos e investimentos",
                  },
                  { ok: true, text: "Categorias personalizadas" },
                  { ok: true, text: "Assistente financeiro com IA" },
                  { ok: true, text: "Registro por linguagem natural" },
                  { ok: true, text: "Categorização automática com IA" },
                ].map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-emerald-400">
                      <IconCheck />
                    </span>
                    <span className="text-white">{item.text}</span>
                  </li>
                ))}
              </ul>

              <a
                href={ctaHref}
                className="block rounded-xl border border-indigo-500/40 bg-indigo-600/20 py-3 text-center text-sm font-bold text-indigo-200 transition hover:bg-indigo-600/40 hover:text-white"
              >
                Assinar Solidus
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-white/30">
            Todos os planos pagos incluem período de teste. Cancele quando
            quiser.
          </p>
        </div>
      </section>

      {/* ── final CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/25 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Comece agora
          </p>
          <h2 className="mb-5 text-5xl font-black leading-[1.1] text-white">
            Sua tranquilidade{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              financeira
            </span>{" "}
            começa aqui.
          </h2>
          <p className="mb-10 text-lg text-white/60">
            Junte-se a quem já usa inteligência artificial para controlar as
            finanças sem esforço. Teste grátis — sem cartão de crédito.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={ctaHref}
              className="group flex items-center gap-2 rounded-2xl bg-violet-600 px-9 py-4 text-lg font-bold text-white hover:bg-violet-500"
            >
              {isLoggedIn === null
                ? "Carregando..."
                : isLoggedIn
                  ? "Acessar dashboard"
                  : "Começar gratuitamente"}
              <span className="transition-transform group-hover:translate-x-1">
                <IconArrow />
              </span>
            </a>
          </div>
          <p className="mt-5 text-sm text-white/35">
            Sem cartão · Sem compromisso · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── footer ───────────────────────────────────────────────────────── */}
      <footer className="border-white/8 border-t bg-[#030712] px-5 pb-8 pt-16">
        <div className="mx-auto max-w-6xl">
          {/* top grid */}
          <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* brand column */}
            <div className="lg:col-span-2">
              <a href="/lp" className="mb-5 inline-block">
                <Image
                  src="/logo-wfinance.png"
                  alt="wFinance"
                  width={150}
                  height={40}
                  className="brightness-110"
                />
              </a>
              <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/50">
                Assistente financeiro com inteligência artificial. Registre
                gastos em segundos, sem planilhas e sem complicações.
              </p>
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                {isLoggedIn ? "Acessar dashboard" : "Começar grátis"}
                <IconArrow />
              </a>
            </div>

            {/* produto column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Produto
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <a
                    href="#como-funciona"
                    className="transition hover:text-white"
                  >
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="transition hover:text-white">
                    Benefícios
                  </a>
                </li>
                <li>
                  <a href="#para-quem" className="transition hover:text-white">
                    Para quem é
                  </a>
                </li>
                <li>
                  <a href={ctaHref} className="transition hover:text-white">
                    {isLoggedIn ? "Meu dashboard" : "Criar conta grátis"}
                  </a>
                </li>
              </ul>
            </div>

            {/* legal column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <a href="#" className="transition hover:text-white">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Segurança dos dados
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* bottom bar */}
          <div className="border-white/8 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} wFinance. Todos os direitos
              reservados.
            </p>
            <p className="flex items-center gap-2 text-xs text-white/25">
              Feito por{" "}
              <Github
                className="cursor-pointer text-violet-600"
                onClick={() => githubLink()}
              />{" "}
              para quem quer clareza financeira
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
