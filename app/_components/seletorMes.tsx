import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

export function MonthYearCalendar({
  onSelect,
}: {
  onSelect: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date
            ? format(date, "MMMM yyyy", { locale: ptBR })
            : "Selecione mês e ano"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (!d) return;
            setDate(d);
            setOpen(false);
            onSelect(d);
          }}
          captionLayout="dropdown"
          fromYear={2024}
          toYear={2100}
        />
      </PopoverContent>
    </Popover>
  );
}
