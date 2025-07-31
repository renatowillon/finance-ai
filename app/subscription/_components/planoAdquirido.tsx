import { Button } from "@/app/_components/ui/button";
import { Check } from "lucide-react";

const PlanoAdquirido = () => {
  return (
    <Button className="w-full rounded-full font-bold" disabled={true}>
      <Check /> Plano Adquirido
    </Button>
  );
};
export default PlanoAdquirido;
