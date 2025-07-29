"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserMenu() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/eu", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data?.name || null); // Pode ser nome se quiser
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    router.replace("/login");
  };

  if (!userName) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded px-4 py-2 text-sm font-medium hover:bg-gray-100/10"
      >
        {userName}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white/15 shadow-lg">
          <button
            onClick={handleLogout}
            className="flex w-full gap-3 px-4 py-2 text-left text-sm text-red-500 hover:rounded-md hover:bg-gray-100/10"
          >
            <LogOut /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
