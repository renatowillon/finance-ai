export type PendingAction =
  | {
      tipo: "banco";
      descricao: string;
      valor: number;
      movimento: "DESPESA" | "DEPOSITO";
      bancoId: number;
      categoriaId: number;
      categoriaNome: string;
    }
  | {
      tipo: "cartao";
      descricao: string;
      valor: number;
      parcelada: boolean;
      totalParcelas: number;
      cartaoId: string;
    };

const pendingActions = new Map<number, PendingAction>();

export function setPending(userId: number, data: PendingAction) {
  pendingActions.set(userId, data);
}

export function getPending(userId: number) {
  return pendingActions.get(userId);
}

export function clearPending(userId: number) {
  pendingActions.delete(userId);
}
