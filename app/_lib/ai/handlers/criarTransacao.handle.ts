import { db } from "@/app/_lib/prisma";
import { setPending } from "@/app/_lib/ai/conversationState";
import { AiIntent } from "../schemas/aiIntent.schemas";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export async function criarTransacaoHandler({
  userId,
  intent,
}: {
  userId: number;
  intent: AiIntent;
}) {
  if (!intent.valor || !intent.tipo) {
    return {
      reply:
        "Faltam informacoes. Pode me dizer o valor e se foi no banco ou cartao?",
    };
  }

  if (intent.tipo === "cartao") {
    if (!intent.cartaoNome) {
      return {
        reply: "Qual cartao voce deseja usar para essa compra?",
      };
    }

    const cartao = await db.cartaoCredito.findFirst({
      where: {
        userId,
        nome: {
          equals: intent.cartaoNome,
          mode: "insensitive",
        },
      },
    });

    if (!cartao) {
      return { reply: "Nao encontrei esse cartao. Pode verificar o nome?" };
    }

    const descricao = intent.descricao?.trim() || "Compra no cartao";

    setPending(userId, {
      tipo: "cartao",
      descricao,
      valor: intent.valor,
      parcelada: intent.parcelada ?? false,
      totalParcelas: intent.parcelada ? (intent.totalParcelas ?? 2) : 1,
      cartaoId: cartao.id,
    });

    return {
      reply: `
💳 Movimentacao detectada!

📝 Descricao: ${descricao}
💰 Valor: ${formatBRL(intent.valor)}
💳 Cartao: ${cartao.nome}
📦 Forma: ${intent.parcelada ? `${intent.totalParcelas ?? 2}x` : "A vista"}

👉 Posso registrar essa movimentacao para voce? E so confirmar ✅
`,
      needsConfirmation: true,
    };
  }

  if (!intent.bancoNome) {
    return {
      reply: "Em qual banco deseja registrar essa movimentacao?",
    };
  }

  const banco = await db.banco.findFirst({
    where: {
      userId,
      nome: {
        equals: intent.bancoNome,
        mode: "insensitive",
      },
    },
  });

  if (!banco) {
    return { reply: "Nao encontrei esse banco. Pode verificar o nome?" };
  }

  const movimento = intent.movimento ?? "DESPESA";

  if (!intent.categoriaNome) {
    return {
      reply:
        movimento === "DEPOSITO"
          ? "Qual categoria de entrada devo usar nessa transacao?"
          : "Qual categoria de saida devo usar nessa transacao?",
    };
  }

  const categoria = await db.categoria.findFirst({
    where: {
      userId,
      tipo: movimento,
      nome: {
        equals: intent.categoriaNome,
        mode: "insensitive",
      },
    },
  });

  if (!categoria) {
    return {
      reply:
        movimento === "DEPOSITO"
          ? "Nao encontrei essa categoria de entrada. Pode escolher uma categoria valida?"
          : "Nao encontrei essa categoria de saida. Pode escolher uma categoria valida?",
    };
  }

  const descricao =
    intent.descricao?.trim() ||
    `${movimento === "DEPOSITO" ? "Receita" : "Despesa"} ${categoria.nome}`;

  setPending(userId, {
    tipo: "banco",
    descricao,
    valor: intent.valor,
    movimento,
    bancoId: banco.id,
    categoriaId: categoria.id,
    categoriaNome: categoria.nome,
  });

  return {
    reply: `
💳 Movimentacao detectada!

📝 Descricao: ${descricao}
💰 Valor: ${formatBRL(intent.valor)}
🏦 Banco: ${banco.nome}
📌 Tipo: ${movimento === "DEPOSITO" ? "Entrada" : "Despesa"}
🛒 Categoria: ${categoria.nome}

👉 Posso registrar essa movimentacao para voce? E so confirmar ✅
`,
    needsConfirmation: true,
  };
}
