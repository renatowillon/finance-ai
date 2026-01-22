export interface TypeBanco {
  id: number;
  nome: string;
  tipo: "POUPANCA" | "CONTA_CORRENTE" | "CARTAO_CREDITO";
  saldoInicial: number;
  saldoAtual: number;
  cor: string;
  userId: number;
}

export type TypeBancoInput = Omit<TypeBanco, "id" | "saldoAtual">;

export interface TypeCategoria {
  id: number;
  nome: string;
  tipo: "DEPOSITO" | "DESPESA";
  userId: number;
}

export interface TypeUsuarioLogado {
  userId: number;
  email: string;
  name: string;
  plano: string;
  status: boolean;
}

export interface TypeInvestimento {
  id: number;
  userId: number;
  nome: string;
  descricao: string;
  meta: number;
  cor?: string;
  status?: "ATIVO" | "CONCLUIDO" | "CANCELADO";
}
export type TypeInvestimentoInput = Omit<TypeInvestimento, "id">;

export interface TypeTransacaoInvestimento {
  id: number;
  investimentoId: number;
  tipo: "DEPOSITO" | "RETIRADA";
  valor: number;
  descricao?: string;
}
export type TypeTransacaoInvestimentoInput = Omit<
  TypeTransacaoInvestimento,
  "id"
>;

export interface TypeUsuario {
  id: number;
  name: string;
  email: string;
  senha: string;
  createAt?: Date;
  updateAt?: Date;
  status: boolean;
  plano: "FREE" | "PREMIUM" | "DEV";
}
export type TypeUsuarioInput = Omit<TypeUsuario, "id">;

export interface TypeCartaoCredito {
  id: string;
  userId: number;
  nome: string;
  limite: number;
  diaFechamento: number;
  diaVencimento: number;
  cor: string;
}
export type TypeCartaoCreditoInput = Omit<TypeCartaoCredito, "id">;

export interface TypeTransacaoCartao {
  id: string;
  descricao: string;
  valor: number;
  dataCompra: Date;
  parcelada: boolean;
  parcelaAtual?: number | null;
  totalParcelas?: number | null;
  competencia: Date;
  pago: boolean;
  dataPagamento?: Date | null;
  cartaoCreditoId: string;
}

export type TypeTransacaoCartaoInput = Omit<TypeTransacaoCartao, "id">;
