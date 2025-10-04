"use client";
import { Button } from "@/app/_components/ui/button";
const redirecionar = () => {
  window.open("https://renatowillon.vercel.app/", "_blank");
};
const AcquirePlanButton = () => {
  return (
    <Button onClick={redirecionar} className="w-full rounded-full font-bold">
      Adquirir planos
    </Button>
  );
};
export default AcquirePlanButton;
