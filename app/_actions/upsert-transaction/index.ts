"use server";

import { db } from "@/app/_lib/prisma";

import {
  TransactionCategory,
  TransactionPaymentMethods,
  TransactionType,
} from "@prisma/client";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { pegarUsuarioToken } from "@/app/_lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface upsertTransactionParams {
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethods;
  date: Date;
}

export const upsertTransaction = async (params: upsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await pegarUsuarioToken(token!);
  if (!user) {
    redirect("/login");
  }
  const userId = user.userId;

  await db.transaction.upsert({
    update: { ...params, userId },
    create: { ...params, userId },
    where: {
      id: params.id ?? "",
    },
  });
  revalidatePath("/transaction");
};
