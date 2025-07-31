"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false); // começa como false

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as BeforeInstallPromptEvent;
      console.log("🔥 beforeinstallprompt disparado");
      evt.preventDefault();
      setDeferredPrompt(evt);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ Usuário aceitou instalar o app");
    } else {
      console.log("❌ Usuário recusou instalar o app");
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className="flex items-center justify-start px-1 py-3">
      <Button onClick={handleInstallClick}>
        <Download className="mr-2 h-4 w-4" /> Instalar app
      </Button>
    </div>
  );
}
