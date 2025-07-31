"use client";
import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ SW registrado", reg))
        .catch((err) => console.error("❌ Erro no SW", err));
    }
  }, []);

  return null;
}
