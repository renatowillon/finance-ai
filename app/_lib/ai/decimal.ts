// /lib/finance/decimal.ts
import { Decimal } from "@prisma/client/runtime/library";

export function toNumber(value: Decimal | number | null | undefined) {
  if (!value) return 0;
  return Number(value);
}
