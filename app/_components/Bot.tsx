"use client";
import animationData from "@/public/WillonBot.json";
import { usePathname, useRouter } from "next/navigation";
import Lottie from "lottie-react";

export const ButtonBot = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/willon-bot") return null;

  return (
    <div
      className="fixed -right-5 bottom-12 cursor-pointer md:-bottom-5 md:-right-5"
      onClick={() => router.push("/willon-bot")}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
};
