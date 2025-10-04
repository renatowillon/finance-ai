import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Interface para o payload do token do usuário
interface PayloadJWTUsuario {
  userId: string;
  email: string;
  name: string;
  status: boolean;
  plano: string;
  subscriptionPlan: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}

interface PayloadUsuario {
  userId: number;
  name: string;
  status: boolean;
  plano: string;
  email: string;
}
/**
 * Verifica o cookie de sessão e retorna o payload do usuário se for válido.
 * Esta função substitui o `auth()` do Clerk no lado do servidor.
 */
export async function obterSessao() {
  const cookieToken = cookies().get("session_token")?.value;
  if (!cookieToken) return null;

  try {
    const chaveSecreta = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify<PayloadJWTUsuario>(
      cookieToken,
      chaveSecreta,
    );
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (erro) {
    // Token inválido (expirado, malformado, etc.)
    return null;
  }
}

const chaveSecreta = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function obterUsuarioPorToken(
  token: string,
): Promise<PayloadUsuario | null> {
  try {
    const { payload } = await jwtVerify(token, chaveSecreta);
    return payload as unknown as PayloadUsuario; // faz cast seguro
  } catch {
    return null;
  }
}
