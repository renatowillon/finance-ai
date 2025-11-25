import { ChevronLeft, ChevronRight } from "lucide-react";

interface SeletorMesProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SeletorMes({ value, onChange }: SeletorMesProps) {
  function changeMonth(direction: "prev" | "next") {
    const [year, month] = value.split("-").map(Number);
    const date = new Date(year, month - 1, 1);

    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, "0");

    onChange(`${newYear}-${newMonth}`);
  }

  const [year, month] = value.split("-").map(Number);

  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => changeMonth("prev")}>
        <ChevronLeft />
      </button>

      <span className="w-[150px] text-center text-sm font-semibold">
        {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
      </span>

      <button onClick={() => changeMonth("next")}>
        <ChevronRight />
      </button>
    </div>
  );
}
