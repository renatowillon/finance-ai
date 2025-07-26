import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Interface para o payload do seu token
interface UserJWTPayload {
  userId: string;
  email: string;
  subscriptionPlan: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}

interface UserPayload {
  userId: number;
  email: string;
  subscriptionPlan?: string;
}
/**
 * Verifica o cookie de sessão e retorna o payload do usuário se for válido.
 * Esta função substitui o `auth()` do Clerk no lado do servidor.
 */
export async function getSession() {
  const tokenCookie = cookies().get("session_token")?.value;
  if (!tokenCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify<UserJWTPayload>(tokenCookie, secret);
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Token inválido (expirado, malformado, etc.)
    return null;
  }
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function pegarUsuarioToken(
  token: string,
): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserPayload; // faz cast seguro
  } catch {
    return null;
  }
}
