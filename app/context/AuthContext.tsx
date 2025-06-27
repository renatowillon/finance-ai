"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userId: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/eu", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId) {
          router.push("/login");
        }
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <--- necessário para salvar o cookie no navegador
    });

    if (res.ok) {
      const data = await res.json();
      setUserId(data);
    } else {
      throw new Error("Erro ao fazer login");
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
