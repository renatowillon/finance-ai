"use client";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "@/public/AnimateFinance.json";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const TelaCarregamento = () => {
  const router = useRouter();
  const carregando = [
    "carregando dashboard",
    "carregando transações",
    "carregando bancos",
    "carregando categorias",
    "carregando investimentos",
  ];

  const [index, setIndex] = useState(0);

  // 🔁 Reseta o index toda vez que o componente monta
  useEffect(() => {
    setIndex(0);
  }, []);

  // ⏳ Troca de frases com animação
  useEffect(() => {
    if (index < carregando.length - 1) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // Redireciona depois da última frase
      const redirectTimer = setTimeout(() => {
        router.replace("/");
      }, 1200);
      return () => clearTimeout(redirectTimer);
    }
  }, [index, carregando.length, router]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#030712]">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: 400, height: 400 }}
      />

      <div className="mt-6 h-6 text-lg text-gray-700">
        <AnimatePresence mode="wait">
          <motion.p
            key={carregando[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="font-medium"
          >
            {carregando[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TelaCarregamento;
