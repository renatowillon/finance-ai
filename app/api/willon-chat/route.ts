import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { obterUsuarioPorToken } from "@/app/_lib/session";
import { callGroq } from "@/app/_lib/ai/groqService";
import { getAiPrompt } from "@/app/_lib/ai/prompt.v2";
import { db } from "@/app/_lib/prisma";
import { AiIntentSchema } from "@/app/_lib/ai/schemas/aiIntent.schemas";
import { orchestrateAiIntent } from "@/app/_lib/ai/orquestrador";
import { clearPending, getPending } from "@/app/_lib/ai/conversationState";
import { AdicionarTransacaoCartao } from "@/app/controller/transacaoCartaoController";

function unauthorized() {
  return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isConversationClosing(message: string) {
  const normalized = normalizeText(message);
  const shortWords = normalized.split(/\s+/).filter(Boolean).length;

  const exactClosings = new Set([
    "ok",
    "ok obrigado",
    "obrigado",
    "brigado",
    "valeu",
    "tchau",
    "ate mais",
    "falou",
    "encerrar",
    "encerrar conversa",
  ]);

  if (exactClosings.has(normalized)) return true;
  if (normalized.includes("?")) return false;

  if (
    shortWords <= 6 &&
    (normalized.startsWith("ok obrigado") ||
      normalized.startsWith("ok valeu") ||
      normalized.startsWith("obrigado") ||
      normalized.startsWith("valeu") ||
      normalized.startsWith("ate mais") ||
      normalized.startsWith("tchau"))
  ) {
    return true;
  }

  return false;
}

function isLikelyTransactionCommand(message: string) {
  const normalized = normalizeText(message);

  const commandHints = [
    "lancar",
    "cadastre",
    "cadastrar",
    "registrar",
    "registre",
    "adicionar",
    "adicione",
    "incluir",
    "inclua",
    "criar despesa",
    "criar receita",
    "paguei",
    "recebi",
  ];

  const hasCommandHint = commandHints.some((hint) => normalized.includes(hint));
  const hasAmount = /\b\d+(?:[.,]\d{1,2})?\b/.test(normalized);
  const hasMovementWord =
    normalized.includes("despesa") ||
    normalized.includes("receita") ||
    normalized.includes("deposito");
  const isLikelyQuestion =
    normalized.includes("?") ||
    normalized.startsWith("qual ") ||
    normalized.startsWith("quanto ") ||
    normalized.startsWith("como ");

  if (isLikelyQuestion) return false;

  return hasCommandHint && (hasAmount || hasMovementWord);
}

function isExplicitBalanceQuery(message: string) {
  const normalized = normalizeText(message);
  return (
    normalized.includes("saldo") ||
    normalized.includes("disponivel") ||
    normalized.includes("tenho no banco")
  );
}

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

function isTransactionFollowup(history: ChatHistoryMessage[]) {
  if (!history.length) return false;

  const lastAssistant = [...history]
    .reverse()
    .find((item) => item.role === "assistant");

  if (!lastAssistant) return false;

  const text = normalizeText(lastAssistant.content);
  return (
    text.includes("em qual banco") ||
    text.includes("qual categoria") ||
    text.includes("qual cartao") ||
    text.includes("faltam informacoes") ||
    text.includes("confirma para registrar")
  );
}

async function resolveUserId() {
  const token = cookies().get("session_token")?.value;
  if (!token) return null;

  const usuario = await obterUsuarioPorToken(token);
  if (!usuario) return null;

  return usuario.userId;
}

async function confirmPendingAction(userId: number) {
  const pending = getPending(userId);

  if (!pending) {
    return {
      reply: "Nao encontrei nenhuma acao pendente para confirmar.",
    };
  }

  if (pending.tipo === "banco") {
    await db.transaction.create({
      data: {
        name: pending.descricao,
        amount: pending.valor,
        type: pending.movimento,
        userId,
        bancoId: pending.bancoId,
        categoriaId: pending.categoriaId,
        baixado: true,
        date: new Date(),
      },
    });
  } else {
    await AdicionarTransacaoCartao({
      cartaoCreditoId: pending.cartaoId,
      descricao: pending.descricao,
      valor: String(pending.valor),
      dataCompra: new Date(),
      parcelada: pending.parcelada,
      totalParcelas: pending.totalParcelas,
    });
  }

  clearPending(userId);

  return { reply: "Transacao registrada com sucesso." };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { message, action, history } = body;

  const userId = await resolveUserId();
  if (!userId) return unauthorized();

  if (action === "confirm") {
    const result = await confirmPendingAction(userId);
    return NextResponse.json(result);
  }

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Mensagem invalida" }, { status: 400 });
  }

  if (isConversationClosing(message)) {
    clearPending(userId);
    return NextResponse.json({
      reply: "Tudo bem, qualquer coisa e so chamar.",
    });
  }

  const [cartoes, bancos, categorias] = await Promise.all([
    db.cartaoCredito.findMany({ where: { userId } }),
    db.banco.findMany({ where: { userId } }),
    db.categoria.findMany({ where: { userId } }),
  ]);

  const validHistory: ChatHistoryMessage[] = Array.isArray(history)
    ? history
        .filter(
          (item): item is ChatHistoryMessage =>
            item &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.content === "string" &&
            item.content.trim().length > 0,
        )
        .slice(-8)
    : [];

  const prompt = getAiPrompt({
    cartoes: cartoes.map((c) => c.nome).join(", "),
    bancos: bancos.map((b) => b.nome).join(", "),
    categoriasEntrada: categorias
      .filter((c) => c.tipo === "DEPOSITO")
      .map((c) => c.nome)
      .join(", "),
    categoriasSaida: categorias
      .filter((c) => c.tipo === "DESPESA")
      .map((c) => c.nome)
      .join(", "),
  });

  const aiResponse = await callGroq([
    { role: "system", content: prompt },
    ...validHistory.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: "user", content: message },
  ]);

  const content = aiResponse?.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { reply: "Nao consegui processar sua mensagem agora. Tente novamente." },
      { status: 502 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { reply: "Nao consegui interpretar a resposta da IA. Tente reformular." },
      { status: 502 },
    );
  }

  const intent = AiIntentSchema.safeParse(parsed);
  if (!intent.success) {
    return NextResponse.json(
      {
        reply:
          "Nao consegui estruturar sua solicitacao com seguranca. Pode reformular em uma frase objetiva?",
      },
      { status: 400 },
    );
  }

  let finalIntent = intent.data;
  const shouldForceCreate =
    isLikelyTransactionCommand(message) || isTransactionFollowup(validHistory);

  if (shouldForceCreate && finalIntent.intencao !== "criar_transacao") {
    finalIntent = {
      ...finalIntent,
      intencao: "criar_transacao",
      consulta: null,
    };
  }

  const normalizedMessage = normalizeText(message);
  const bancoMatch = bancos.find(
    (banco) => normalizeText(banco.nome) === normalizedMessage,
  );

  if (shouldForceCreate && bancoMatch) {
    finalIntent = {
      ...finalIntent,
      intencao: "criar_transacao",
      consulta: null,
      tipo: "banco",
      bancoNome: bancoMatch.nome,
    };
  }

  if (finalIntent.intencao === "criar_transacao" && !finalIntent.movimento) {
    finalIntent = {
      ...finalIntent,
      movimento:
        normalizedMessage.includes("receita") ||
        normalizedMessage.includes("deposito") ||
        normalizedMessage.includes("entrada")
          ? "DEPOSITO"
          : "DESPESA",
    };
  }

  if (finalIntent.intencao === "consultar_resumo" && !finalIntent.movimento) {
    if (
      normalizedMessage.includes("receita") ||
      normalizedMessage.includes("recebi") ||
      normalizedMessage.includes("entrada")
    ) {
      finalIntent = {
        ...finalIntent,
        movimento: "DEPOSITO",
      };
    }

    if (
      normalizedMessage.includes("despesa") ||
      normalizedMessage.includes("gastei") ||
      normalizedMessage.includes("gasto")
    ) {
      finalIntent = {
        ...finalIntent,
        movimento: "DESPESA",
      };
    }
  }

  if (finalIntent.intencao === "criar_transacao" && !finalIntent.tipo) {
    finalIntent = {
      ...finalIntent,
      tipo: normalizedMessage.includes("cartao") ? "cartao" : "banco",
    };
  }

  if (
    finalIntent.intencao === "criar_transacao" &&
    finalIntent.consulta === "SALDO_BANCO"
  ) {
    finalIntent = { ...finalIntent, consulta: null };
  }

  if (
    finalIntent.intencao === "consultar_resumo" &&
    finalIntent.consulta === "SALDO_BANCO" &&
    !isExplicitBalanceQuery(message)
  ) {
    finalIntent = {
      ...finalIntent,
      consulta: "RESUMO_GERAL",
      bancoNome: null,
    };
  }

  if (!finalIntent.completo) {
    return NextResponse.json({
      reply:
        finalIntent.pergunta ??
        "Preciso de mais detalhes para continuar. Pode complementar?",
    });
  }

  const result = await orchestrateAiIntent({ intent: finalIntent, userId });
  return NextResponse.json(result);
}
