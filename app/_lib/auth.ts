import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface AuthUser {
  userId: number;
  email: string;
  name: string;
  status: boolean;
  plano: string;
}

export async function auth(): Promise<AuthUser | null> {
  try {
    const token = cookies().get("session_token")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    // Você pode adaptar isso dependendo do payload real do seu token
    const user = payload as unknown as AuthUser;
    return user;
  } catch (error) {
    console.error("[auth] Token inválido ou expirado:", error);
    return null;
  }
}
