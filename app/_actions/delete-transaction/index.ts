"use server";

import { db } from "@/app/_lib/prisma";

import { revalidatePath } from "next/cache";
import { obterUsuarioPorToken } from "@/app/_lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const excluirTransacao = async (id: string) => {
  const armazenadorCookie = cookies();
  const token = armazenadorCookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }

  await db.transaction.delete({
    where: {
      id,
    },
  });

  revalidatePath("/transaction");
};
