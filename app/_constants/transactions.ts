import { TransactionPaymentMethods, TransactionType } from "@prisma/client";

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

export const ROTULOS_TIPO_CONTA = {
  POUPANCA: "Poupança",
  CONTA_CORRENTE: "Conta Corrente",
  CARTAO_CREDITO: "Cartão de Crédito",
};

export const ROTULO_TIPO_CATEGORIA = {
  DEPOSITO: "Receitas",
  DESPESA: "Despesas",
};
