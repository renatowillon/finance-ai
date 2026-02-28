import { FinanceQueryService } from "@/app/_services/ai/queryServiceAi";
import { AiIntent } from "../schemas/aiIntent.schemas";

export async function consultarInsightsHandler({
  userId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  intent,
}: {
  userId: number;
  intent: AiIntent;
}) {
  const resumoMes = await FinanceQueryService.getResumoPeriodo(userId, "MES");
  const categoriaTop = await FinanceQueryService.getCategoriaMaisGasta(
    userId,
    "MES",
  );

  const insights: string[] = [];

  if (resumoMes.totalDespesas > resumoMes.totalEntradas) {
    insights.push(
      "Voce gastou mais do que ganhou neste mes. Priorize reduzir gastos nao essenciais.",
    );
  }

  if (resumoMes.totalDespesasCartao > resumoMes.totalDespesasBanco) {
    insights.push(
      "Seus gastos no cartao estao acima dos gastos em conta. Monitore parcelamentos para nao comprometer os proximos meses.",
    );
  }

  if (categoriaTop) {
    insights.push(
      `Sua categoria com maior gasto no mes e ${categoriaTop.categoriaNome} (R$ ${categoriaTop.total.toFixed(2)}). Comece por ela para economizar mais rapido.`,
    );
  }

  if (insights.length === 0) {
    insights.push("Seu mes esta equilibrado ate agora.");
  }

  return {
    reply: `
Insights financeiros do mes

${insights.map((insight, index) => `${index + 1}. ${insight}`).join("\n")}
`,
  };
}
