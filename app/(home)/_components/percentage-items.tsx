import { ReactNode } from "react";

interface PercentageItemProps {
  icon: ReactNode;
  title: string;
  value: number;
}

export const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="gap-2 rounded-lg bg-primary/5 p-3">{icon}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="text-sm font-bold">{value}%</div>
    </div>
  );
};
