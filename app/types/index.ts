export interface TypeBanco {
  id: string;
  nome: string;
  tipo: "polpanca" | "contaCorrente" | "cartaoCredito";
  saldoInicial: number;
  saldoAtual: number;
  cor: string;
}
