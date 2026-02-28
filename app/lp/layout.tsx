import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "wFinance — Controle financeiro por inteligência artificial",
  description:
    "Registre gastos apenas escrevendo. A IA organiza tudo automaticamente. Sem planilhas, sem complicações. Experimente grátis.",
  openGraph: {
    title: "wFinance — Controle financeiro por inteligência artificial",
    description:
      "Registre gastos apenas escrevendo. A IA organiza tudo automaticamente.",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
