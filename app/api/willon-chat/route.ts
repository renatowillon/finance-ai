import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { obterUsuarioPorToken } from "@/app/_lib/session";
import { callGroq } from "@/app/_lib/ai/groqService";
import { criarTransacaoService } from "@/app/_services/transactionService";
import { AdicionarTransacaoCartao } from "@/app/controller/transacaoCartaoController";
import { db } from "@/app/_lib/prisma";
import {
  setPending,
  getPending,
  clearPending,
} from "@/app/_lib/ai/conversationState";

export async function POST(req: Request) {
  try {
    const { message, action } = await req.json();

    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const usuario = await obterUsuarioPorToken(token);
    if (!usuario) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }

    const userId = usuario.userId;

    // 🔁 VERIFICAR CONFIRMAÇÃO
    const pending = getPending(userId);

    if (action === "confirm" && !pending) {
      return NextResponse.json({
        reply: "⚠️ Não encontrei nenhuma operação pendente para confirmar.",
        needsConfirmation: false,
      });
    }

    if (action === "confirm" && pending) {
      if (pending.tipo === "cartao") {
        const result = await AdicionarTransacaoCartao({
          descricao: pending.descricao,
          valor: String(pending.valor),
          dataCompra: new Date(),
          parcelada: pending.parcelada ?? false,
          totalParcelas: pending.totalParcelas ?? 1,
          cartaoCreditoId: pending.cartaoId,
        });

        clearPending(userId);

        return NextResponse.json({
          reply: "✅ Pronto! Sua transação foi registrada com sucesso.",
          result,
          needsConfirmation: false,
        });
      }

      if (pending.tipo === "banco") {
        const result = await criarTransacaoService({
          nome: pending.descricao,
          tipo: pending.movimento,
          valor: String(pending.valor),
          categoriaId: 1,
          data: new Date(),
          bancoId: pending.bancoId,
          baixado: true,
          userId,
        });

        clearPending(userId);

        return NextResponse.json({
          reply: "Transação registrada com sucesso.",
          result,
          needsConfirmation: false,
        });
      }
    }

    // 🔍 Buscar cartões e bancos
    const cartoes = await db.cartaoCredito.findMany({
      where: { userId },
      select: { id: true, nome: true },
    });

    const bancos = await db.banco.findMany({
      where: { userId },
      select: { id: true, nome: true },
    });

    const listaCartoes = cartoes.map((c) => c.nome).join(", ");
    const listaBancos = bancos.map((b) => b.nome).join(", ");

    if (!message) {
      return NextResponse.json({
        reply: "Mensagem inválida.",
      });
    }

    // 🧠 MENSAGEM PARA IA (apenas interpretação)
    const messages = [
      {
        role: "system",
        content: `
Você é um assistente financeiro.

Cartões disponíveis: ${listaCartoes || "nenhum"}
Bancos disponíveis: ${listaBancos || "nenhum"}

Sua função é interpretar a mensagem do usuário e responder APENAS um JSON com a seguinte estrutura:

{
  "intencao": "criar_transacao" ou null,
  "tipo": "cartao" ou "banco" ou null,
  "descricao": string ou null,
  "valor": number ou null,
  "movimento": "DESPESA" ou "DEPOSITO" ou null,
  "cartaoNome": string ou null,
  "bancoNome": string ou null,
  "parcelada": boolean ou null,
  "totalParcelas": number ou null,
  "completo": boolean,
  "pergunta": string ou null
}

Regras:
- Nunca invente nomes.
- Se faltar informação, marque completo como false e preencha pergunta.
- Se estiver tudo correto, marque completo como true.
- NÃO escreva texto fora do JSON.
`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    const aiResponse = await callGroq(messages);

    console.log("IA COMPLETA:");
    console.dir(aiResponse, { depth: null });

    const content = aiResponse?.choices?.[0]?.message?.content;

    console.log("CONTENT:", content);

    let parsed;

    try {
      const clean = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(clean);
    } catch (err) {
      console.log("Resposta bruta da IA:", content, err);
      return NextResponse.json({
        reply: "Não consegui interpretar sua solicitação.",
      });
    }

    if (!parsed.completo) {
      return NextResponse.json({
        reply: parsed.pergunta || "Pode me dar mais detalhes?",
      });
    }

    // 🔎 Resolver ID real
    if (parsed.tipo === "cartao") {
      const cartao = cartoes.find(
        (c) => c.nome.toLowerCase() === parsed.cartaoNome?.toLowerCase(),
      );

      if (!cartao) {
        return NextResponse.json({
          reply: "Não encontrei esse cartão. Pode verificar o nome?",
        });
      }

      const preview = `
        💳 Compra no cartão detectada!

        📝 **${parsed.descricao}**
        💰 R$ ${Number(parsed.valor).toFixed(2)}
        💳 ${cartao.nome}
        📦 ${parsed.parcelada ? `${parsed.totalParcelas}x` : "À vista"}
        📅 ${new Date().toLocaleDateString("pt-BR")}

        Confirme para registrar a compra.
        `;

      setPending(userId, {
        tipo: "cartao",
        descricao: parsed.descricao,
        valor: parsed.valor,
        parcelada: parsed.parcelada,
        totalParcelas: parsed.totalParcelas,
        cartaoId: cartao.id,
      });

      return NextResponse.json({
        reply: preview,
        needsConfirmation: true,
      });
    }

    if (parsed.tipo === "banco") {
      const banco = bancos.find(
        (b) => b.nome.toLowerCase() === parsed.bancoNome?.toLowerCase(),
      );

      if (!banco) {
        return NextResponse.json({
          reply: "Não encontrei esse banco. Pode verificar o nome?",
        });
      }

      const preview = `
        ✅ Entendi! Vou cadastrar:

        📝 **${parsed.descricao}**
        💰 R$ ${Number(parsed.valor).toFixed(2)}
        🏦 ${banco.nome}
        📌 ${parsed.movimento === "DESPESA" ? "Despesa" : "Depósito"}
        📅 ${new Date().toLocaleDateString("pt-BR")}

        Confirme para concluir o cadastro.
        `;

      setPending(userId, {
        tipo: "banco",
        descricao: parsed.descricao,
        valor: parsed.valor,
        movimento: parsed.movimento,
        bancoId: banco.id,
      });

      return NextResponse.json({
        reply: preview,
        needsConfirmation: true,
      });
    }

    return NextResponse.json({
      reply: "Não consegui identificar a operação.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
