import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
//import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();

    // 1. Encontrar o usuário pelo email
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // 2. Comparar a senha fornecida com o hash salvo no banco (de forma segura)
    // PARA QUANDO FOR USAR HASH
    // const isPasswordValid = await bcrypt.compare(senha, user.senha); // Assumindo que user.senha é o hash

    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { error: "Credenciais inválidas" },
    //     { status: 401 },
    //   );
    // }

    //  2. Comparar a senha simples (SEM HASH)
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // 3. Criar o token JWT com os dados do usuário
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      plano: user.plano,
      // IMPORTANTE: Inclua os dados que você precisa na sessão!
      // Você mencionou 'subscriptionPlan' antes. Adicione-o aqui.
      // Supondo que esteja em `publicMetadata` como no Clerk. Adapte se necessário.
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token expira em 7 dias
      .sign(secret);

    // 4. Criar a resposta e definir o cookie com o token
    const response = NextResponse.json({
      message: "Login bem-sucedido",
      userId: user.id,
    });

    response.cookies.set("session_token", token, {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript no cliente
      secure: process.env.NODE_ENV === "production", // Usar apenas em HTTPS em produção
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno." },
      { status: 500 },
    );
  }
}
