export const tools = [
  {
    type: "function",
    function: {
      name: "cadastrar_transacao",
      description: "Cadastrar despesa ou receita em uma conta bancária",
      parameters: {
        type: "object",
        properties: {
          descricao: { type: "string" },
          valor: { type: "number" },
          tipo: { type: "string", enum: ["DEPOSITO", "DESPESA"] },
          bancoId: { type: "string" },
        },
        required: ["descricao", "valor", "tipo", "bancoId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cadastrar_transacao_cartao",
      description: "Cadastrar compra no cartão de crédito",
      parameters: {
        type: "object",
        properties: {
          descricao: { type: "string" },
          valor: { type: "number" },
          cartaoCreditoId: { type: "string" },
          parcelada: { type: "boolean" },
          totalParcelas: { type: "number" },
        },
        required: ["descricao", "valor", "cartaoCreditoId"],
      },
    },
  },
];
