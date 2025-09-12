import {
  TransactionCategory,
  TransactionPaymentMethods,
  TransactionType,
} from "@prisma/client";

export const ROTULOS_CATEGORIAS_TRANSACAO = {
  SALARIO: "Salário",
  INVESTIMENTOS: "Investimentos",
  FREELANCER: "Freelancer",
  VENDAS: "Vendas",
  REEMBOLSOS: "Reembolsos",
  EMPRESTIMOS: "Empréstimos",
  ALUGUEIS: "Alugueis",
  PREMIOS: "Prémios",
  DOACOES: "Doações",
  OUTROS: "Outros",
  ALIMENTACAO: "Alimentação",
  TRANSPORTE: "Transporte",
  MORADIA: "Moradia",
  SAUDE: "Saúde",
  EDUCACAO: "Educação",
  ENTRETENIMENTO: "Entertenimento",
  ROUPAS: "Roupas",
  VIAGENS: "Viagens",
  CONTAS: "contas",
  OUTRAS: "Outras",
};

export const ROTULOS_METODOS_PAGAMENTO_TRANSACAO = {
  PIX: "Pix",
  TRANSFERENCIA: "Transferência",
  BOLETO: "Boleto",
  DINHEIRO: "Dinheiro",
  CARTAO_DEBITO: "Cartão de Débito",
  CARTAO_CREDITO: "Cartão de Crédito",
};

export const ICONES_METODOS_PAGAMENTO_TRANSACAO = {
  [TransactionPaymentMethods.PIX]: "pix.svg",
  [TransactionPaymentMethods.TRANSFERENCIA]: "transferência.svg",
  [TransactionPaymentMethods.BOLETO]: "boleto.svg",
  [TransactionPaymentMethods.DINHEIRO]: "dinheiro.svg",
  [TransactionPaymentMethods.CARTAO_DEBITO]: "debito.svg",
  [TransactionPaymentMethods.CARTAO_CREDITO]: "credito.svg",
};

export const OPCOES_TIPOS_TRANSACAO = [
  {
    value: TransactionType.DEPOSITO,
    label: "Receita",
  },
  {
    value: TransactionType.DESPESA,
    label: "Despesa",
  },
  {
    value: TransactionType.INVESTIMENTO,
    label: "Investimento",
  },
];

export const OPCOES_METODOS_PAGAMENTO_TRANSACAO = [
  {
    value: TransactionPaymentMethods.DINHEIRO,
    label: "Dinheiro",
  },
  {
    value: TransactionPaymentMethods.PIX,
    label: "Pix",
  },
  {
    value: TransactionPaymentMethods.CARTAO_CREDITO,
    label: "Cartão de Crédito",
  },
  {
    value: TransactionPaymentMethods.CARTAO_DEBITO,
    label: "Cartão de Débito",
  },
  {
    value: TransactionPaymentMethods.TRANSFERENCIA,
    label: "Transferência",
  },
  {
    value: TransactionPaymentMethods.BOLETO,
    label: "Boleto",
  },
];

export const OPCOES_CATEGORIAS_TRANSACAO = [
  {
    value: TransactionCategory.ALIMENTACAO,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.ALIMENTACAO],
  },
  {
    value: TransactionCategory.SALARIO,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.SALARIO],
  },
  {
    value: TransactionCategory.INVESTIMENTOS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.INVESTIMENTOS],
  },
  {
    value: TransactionCategory.FREELANCER,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.FREELANCER],
  },
  {
    value: TransactionCategory.VENDAS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.VENDAS],
  },
  {
    value: TransactionCategory.REEMBOLSOS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.REEMBOLSOS],
  },
  {
    value: TransactionCategory.EMPRESTIMOS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.EMPRESTIMOS],
  },
  {
    value: TransactionCategory.ALUGUEIS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.ALUGUEIS],
  },
  {
    value: TransactionCategory.PREMIOS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.PREMIOS],
  },
  {
    value: TransactionCategory.DOACOES,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.DOACOES],
  },
  {
    value: TransactionCategory.OUTROS,
    label: ROTULOS_CATEGORIAS_TRANSACAO[TransactionCategory.OUTROS],
  },
];
