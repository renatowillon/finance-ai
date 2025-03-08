import {
  TransactionCategory,
  TransactionPaymentMethods,
  TransactionType,
} from "@prisma/client";

export const TRANSACTION_CATEGORY_LABELS = {
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

export const TRANSACTION_PAYMENT_METHOD_LABEL = {
  PIX: "Pix",
  TRANSFERENCIA: "Transferência",
  BOLETO: "Boleto",
  DINHEIRO: "Dinheiro",
  CARTAO_DEBITO: "Cartão de Débito",
  CARTAO_CREDITO: "Cartão de Crédito",
};

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethods.PIX]: "pix.svg",
  [TransactionPaymentMethods.TRANSFERENCIA]: "transferência.svg",
  [TransactionPaymentMethods.BOLETO]: "boleto.svg",
  [TransactionPaymentMethods.DINHEIRO]: "dinheiro.svg",
  [TransactionPaymentMethods.CARTAO_DEBITO]: "debito.svg",
  [TransactionPaymentMethods.CARTAO_CREDITO]: "credito.svg",
};

export const TRANSACTION_TYPE_OPTIONS = [
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

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
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

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: TransactionCategory.ALIMENTACAO,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.ALIMENTACAO],
  },
  {
    value: TransactionCategory.SALARIO,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.SALARIO],
  },
  {
    value: TransactionCategory.INVESTIMENTOS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.INVESTIMENTOS],
  },
  {
    value: TransactionCategory.FREELANCER,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.FREELANCER],
  },
  {
    value: TransactionCategory.VENDAS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.VENDAS],
  },
  {
    value: TransactionCategory.REEMBOLSOS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.REEMBOLSOS],
  },
  {
    value: TransactionCategory.EMPRESTIMOS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.EMPRESTIMOS],
  },
  {
    value: TransactionCategory.ALUGUEIS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.ALUGUEIS],
  },
  {
    value: TransactionCategory.PREMIOS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.PREMIOS],
  },
  {
    value: TransactionCategory.DOACOES,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.DOACOES],
  },
  {
    value: TransactionCategory.OUTROS,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.OUTROS],
  },
];
