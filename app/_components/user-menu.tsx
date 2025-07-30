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
    <div className="relative w-full">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded px-4 py-2 text-sm font-medium hover:bg-gray-100/10"
      >
        {userName}
      </button>
      {open && (
        <div className="absolute -top-14 right-0 z-50 mt-2 w-full rounded-md border bg-slate-900 shadow-lg">
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
