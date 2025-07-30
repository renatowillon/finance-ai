"use server";

import { db } from "@/app/_lib/prisma";

import { revalidatePath } from "next/cache";
import { pegarUsuarioToken } from "@/app/_lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const deleteTransaction = async (id: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await pegarUsuarioToken(token!);
  if (!user) {
    redirect("/login");
  }

  await db.transaction.delete({
    where: {
      id,
    },
  });

  revalidatePath("/transaction");
};
