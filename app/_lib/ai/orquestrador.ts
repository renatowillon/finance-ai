import { consultarInsightsHandler } from "./handlers/consultarInsights.handler";
import { consultarResumoHandler } from "./handlers/consultarResumo.handler";
import { criarTransacaoHandler } from "./handlers/criarTransacao.handle";
import { encerrarConversaHandler } from "./handlers/encerrarConversa.handler";
import { AiIntent } from "./schemas/aiIntent.schemas";

export async function orchestrateAiIntent({
  intent,
  userId,
}: {
  intent: AiIntent;
  userId: number;
}) {
  switch (intent.intencao) {
    case "criar_transacao":
      return criarTransacaoHandler({ intent, userId });

    case "consultar_resumo":
      return consultarResumoHandler({ intent, userId });

    case "consultar_insights":
      return consultarInsightsHandler({ intent, userId });

    case "encerrar_conversa":
      return encerrarConversaHandler(userId);

    default:
      return {
        reply: "Nao consegui entender o que voce deseja fazer.",
      };
  }
}
