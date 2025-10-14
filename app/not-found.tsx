"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-6 text-zinc-100">
      {/* Efeito de fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="mb-4 text-8xl font-bold tracking-tight text-emerald-400">
          404
        </h1>

        <p className="mb-8 font-mono text-lg text-zinc-400">
          {"// Oops... parece que essa rota foi de férias 🏖️"}
        </p>

        <div className="mx-auto max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left font-mono text-sm shadow-lg">
          <p className="text-emerald-400">$ cd /home</p>
          <p className="text-zinc-400">→ Página não encontrada</p>
          <p className="text-zinc-600">
            {"// Tente novamente ou volte ao início"}
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-zinc-900 transition hover:bg-emerald-400"
        >
          Voltar ao início
        </Link>
      </motion.div>

      {/* Fundo com “código” sutil */}
      <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-xs text-zinc-700">
        &lt;404 | Page Not Found /&gt;
      </div>
    </div>
  );
}
