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
