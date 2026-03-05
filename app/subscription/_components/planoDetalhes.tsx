"use client";
import { PlanoComponente } from "./planoComponente";

interface PlanoDetalhesProps {
  planoUsuario: string;
}

export const PlanoDetalhes = ({ planoUsuario }: PlanoDetalhesProps) => {
  function ctaHref(plano: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=5583988332659&text=Ol%C3%A1%2C%20queria%20adquirir%20o%20Plano%20${plano}`,
      "_blank",
    );
  }

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      <PlanoComponente
        name="Denário"
        icon="🪙"
        price={<span className="text-4xl font-black text-white">Grátis</span>}
        description="Para quem quer começar a organizar as finanças sem custo."
        buttonText="Começar grátis"
        variant="denario"
        onClick={() => ctaHref("Denário")}
        features={[
          { ok: true, text: "Até 50 transações por mês" },
          { ok: true, text: "Dashboard básico" },
          { ok: true, text: "Controle de receitas e despesas" },
          { ok: false, text: "Controle de bancos" },
          { ok: false, text: "Controle de investimentos" },
          { ok: false, text: "Categorias personalizadas" },
          { ok: false, text: "Assistente com IA" },
        ]}
        toolTip={{
          title: "Denário",
          originalName: "Denarius (latim)",
          era: "~211 a.C. – século III d.C.",
          civilization: "Roma Antiga",
          history: [
            "Moeda de prata mais importante do Império Romano.",
            "Surgiu para padronizar comércio e pagar soldados.",
            "1 Denário ≈ pagamento diário de um soldado.",
            "Influenciou palavras como: dinheiro, denaro, dinero.",
          ],
          symbolicContext: [
            "Base, início, acesso",
            "O primeiro contato com a organização financeira",
          ],
        }}
        usuarioPlano={
          planoUsuario === "FREE" || planoUsuario === "Denario" ? true : false
        }
      />

      <PlanoComponente
        name="Dracma"
        icon="🪙"
        badge="⭐ Mais popular"
        variant="dracma"
        price={
          <div className="flex items-end gap-1">
            <span className="text-sm text-white/40">R$</span>
            <span className="text-5xl font-black text-white">19</span>
            <span className="text-lg text-white/60">,00</span>
            <span className="text-sm text-white/40">/mês</span>
          </div>
        }
        description="Acesso completo ao sistema."
        buttonText="Assinar Dracma"
        onClick={() => ctaHref("Dracma")}
        features={[
          { ok: true, text: "Transações ilimitadas" },
          { ok: true, text: "Dashboard completo" },
          { ok: true, text: "Controle de receitas e despesas" },
          { ok: true, text: "Controle de bancos" },
          { ok: true, text: "Controle de investimentos" },
          { ok: true, text: "Categorias personalizadas" },
          { ok: false, text: "Assistente com IA" },
        ]}
        toolTip={{
          title: "Dracma",
          originalName: "Drachmē (δραχμή – grego antigo)",
          era: "~600 a.C. – período helenístico",
          civilization: "Grécia Antiga",
          history: [
            "Uma das primeiras moedas padronizadas do mundo.",
            "Referência no comércio do Mediterrâneo.",
            "Base da economia grega clássica.",
            "Voltou a ser usada na Grécia moderna até o Euro.",
          ],
          symbolicContext: [
            "Equilíbrio, controle, racionalidade",
            "Representa análise e gestão consciente",
          ],
        }}
        usuarioPlano={
          planoUsuario === "PREMIUM" || planoUsuario === "Dracma" ? true : false
        }
      />

      <PlanoComponente
        name="Solidus"
        icon="🏆"
        variant="solidus"
        aiTag
        price={
          <div className="flex items-end gap-1">
            <span className="text-sm text-white/40">R$</span>
            <span className="text-5xl font-black text-white">49</span>
            <span className="text-lg text-white/60">,99</span>
            <span className="text-sm text-white/40">/mês</span>
          </div>
        }
        description="Experiência completa com inteligência artificial."
        buttonText="Assinar Solidus"
        onClick={() => ctaHref("Solidus")}
        features={[
          { ok: true, text: "Tudo do plano Dracma" },
          { ok: true, text: "Transações ilimitadas" },
          { ok: true, text: "Controle total de bancos e investimentos" },
          { ok: true, text: "Categorias personalizadas" },
          { ok: true, text: "Assistente financeiro com IA" },
          { ok: true, text: "Registro por linguagem natural" },
          { ok: true, text: "Categorização automática com IA" },
        ]}
        toolTip={{
          title: "Solidus",
          originalName: "Solidus (latim)",
          era: "~312 d.C. – mais de 700 anos circulando",
          civilization: "Império Bizantino/Romano Tardio",
          history: [
            "Criada por Constantino, uma das mais estáveis da história.",
            "Feita em ouro puro com valor inalterado por séculos.",
            "A palavra 'sold', 'saldo' e 'solid' vêm da mesma raiz.",
          ],
          symbolicContext: [
            "Solidez, segurança, inteligência estratégica",
            "Nível máximo de maturidade financeira",
          ],
        }}
        usuarioPlano={
          planoUsuario === "DEV" || planoUsuario === "Solidus" ? true : false
        }
      />
    </div>
  );
};
