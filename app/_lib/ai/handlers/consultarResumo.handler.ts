import { FinanceQueryService } from "@/app/_services/ai/queryServiceAi";
import { AiIntent } from "../schemas/aiIntent.schemas";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPeriodoLabel(periodo: AiIntent["periodo"]) {
  const labels: Record<string, string> = {
    HOJE: "hoje",
    SEMANA: "esta semana",
    MES: "este mes",
    MES_PASSADO: "mes passado",
    ANO: "este ano",
  };
  if (!periodo) return "periodo informado";
  return labels[periodo] ?? periodo;
}

export async function consultarResumoHandler({
  userId,
  intent,
}: {
  userId: number;
  intent: AiIntent;
}) {
  const consulta = intent.consulta ?? "RESUMO_GERAL";

  if (consulta === "LISTAR_CATEGORIAS") {
    const categorias = await FinanceQueryService.getCategorias(userId);
    const entradas = categorias.filter((item) => item.tipo === "DEPOSITO");
    const saidas = categorias.filter((item) => item.tipo === "DESPESA");

    const listaEntradas =
      entradas.length > 0
        ? entradas.map((item) => item.nome).join("\n")
        : "Sem categorias de entrada cadastradas";

    const listaSaidas =
      saidas.length > 0
        ? saidas.map((item) => item.nome).join("\n")
        : "Sem categorias de saida cadastradas";

    return {
      reply: `
💰 Entrada

${listaEntradas}

💸 Saida

${listaSaidas}
`,
    };
  }

  if (consulta === "SALDO_BANCO") {
    if (!intent.bancoNome) {
      return {
        reply: "Qual banco voce deseja consultar?",
      };
    }

    try {
      const saldo = await FinanceQueryService.getSaldoBancoPorNome(
        userId,
        intent.bancoNome,
      );

      return {
        reply: `🏦 Saldo atual do banco ${saldo.bancoNome}: ${formatBRL(saldo.saldoAtual)}`,
      };
    } catch {
      return {
        reply: "Nao encontrei esse banco. Pode confirmar o nome?",
      };
    }
  }

  if (consulta === "FATURA_CARTAO") {
    if (!intent.cartaoNome) {
      return {
        reply: "Qual cartao voce deseja consultar?",
      };
    }

    try {
      const fatura = await FinanceQueryService.getFaturaCartaoPorMes({
        userId,
        cartaoNome: intent.cartaoNome,
        competenciaMes: intent.competenciaMes ?? null,
      });

      return {
        reply: `
💳 Fatura do cartao ${fatura.cartaoNome} (${fatura.competencia})

💰 Valor atual: ${formatBRL(fatura.valorTotal)}
📊 Limite: ${formatBRL(fatura.limite)}
📌 Status: ${fatura.fechada ? "Fechada" : "Aberta"}${fatura.paga ? " e paga" : ""}
🧾 Transacoes no periodo: ${fatura.quantidadeTransacoes}
${fatura.vencimento ? `📅 Vencimento: ${new Date(fatura.vencimento).toLocaleDateString("pt-BR")}` : ""}
`,
      };
    } catch {
      return {
        reply: "Nao consegui localizar essa fatura. Pode validar cartao e mes?",
      };
    }
  }

  if (consulta === "CATEGORIA_MAIS_GASTA") {
    if (!intent.periodo) {
      return {
        reply: "Qual periodo voce quer usar para analisar categorias?",
      };
    }

    const topCategoria = await FinanceQueryService.getCategoriaMaisGasta(
      userId,
      intent.periodo,
    );

    if (!topCategoria) {
      return {
        reply: "Nao encontrei despesas com categoria nesse periodo.",
      };
    }

    return {
      reply: `📌 Categoria com maior gasto em ${formatPeriodoLabel(intent.periodo)}: ${topCategoria.categoriaNome} (${formatBRL(topCategoria.total)})`,
    };
  }

  if (!intent.periodo) {
    return {
      reply: "Qual periodo voce deseja consultar?",
    };
  }

  const detalhe = await FinanceQueryService.getDetalhePeriodoPorBanco(
    userId,
    intent.periodo,
  );
  const periodoLabel = formatPeriodoLabel(intent.periodo);

  if (intent.movimento === "DEPOSITO") {
    const linhasBancos = detalhe.detalhamentoBancos
      .filter((item) => item.entradas > 0)
      .map((item) => `🏦 ${item.bancoNome}: ${formatBRL(item.entradas)}`)
      .join("\n");

    return {
      reply: `
💰 Receitas em ${periodoLabel}

✅ Total recebido: ${formatBRL(detalhe.totalEntradas)}

📊 Por banco
${linhasBancos || "Sem entradas registradas nos bancos nesse periodo."}
`,
    };
  }

  if (intent.movimento === "DESPESA" || consulta === "GASTO_PERIODO") {
    const linhasBancos = detalhe.detalhamentoBancos
      .filter((item) => item.despesas > 0)
      .map((item) => `🏦 ${item.bancoNome}: ${formatBRL(item.despesas)}`)
      .join("\n");

    return {
      reply: `
💸 Despesas em ${periodoLabel}

✅ Total de despesas: ${formatBRL(detalhe.totalDespesas)}
🏦 Despesas em bancos: ${formatBRL(detalhe.totalDespesasBanco)}
💳 Despesas em cartao: ${formatBRL(detalhe.totalDespesasCartao)}

📊 Por banco
${linhasBancos || "Sem despesas registradas em bancos nesse periodo."}
`,
    };
  }

  return {
    reply: `
📊 Resumo financeiro em ${periodoLabel}

💰 Entradas: ${formatBRL(detalhe.totalEntradas)}
💸 Despesas (Bancos): ${formatBRL(detalhe.totalDespesasBanco)}
💳 Despesas (Cartao): ${formatBRL(detalhe.totalDespesasCartao)}
📉 Total de Despesas: ${formatBRL(detalhe.totalDespesas)}
📈 Saldo Liquido: ${formatBRL(detalhe.totalEntradas - detalhe.totalDespesas)}

🏦 Detalhe por banco
${
  detalhe.detalhamentoBancos
    .map(
      (item) =>
        `• ${item.bancoNome}: Entradas ${formatBRL(item.entradas)} | Despesas ${formatBRL(item.despesas)}`,
    )
    .join("\n") || "Sem movimentacoes bancarias no periodo."
}
`,
  };
}
