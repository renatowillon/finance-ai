// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pendingActions = new Map<number, any>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setPending(userId: number, data: any) {
  pendingActions.set(userId, data);
}

export function getPending(userId: number) {
  return pendingActions.get(userId);
}

export function clearPending(userId: number) {
  pendingActions.delete(userId);
}
