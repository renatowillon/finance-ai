"use server";
import { obterUsuarioPorToken } from "@/app/_lib/session";
import {
  BaixarTransacao,
  EstornarTransacao,
} from "@/app/controller/baixarTransacaoController";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const baixarTransacaoAction = async (idTransacao: string) => {
  const armazenadorCookie = cookies();
  const token = armazenadorCookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }

  await BaixarTransacao(idTransacao);
  revalidatePath("/transaction");
};

export const estornarTransacaoAction = async (idTransacao: string) => {
  const armazenadorCookie = cookies();
  const token = armazenadorCookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const usuario = await obterUsuarioPorToken(token!);
  if (!usuario) {
    redirect("/login");
  }

  await EstornarTransacao(idTransacao);
  revalidatePath("/transaction");
};
