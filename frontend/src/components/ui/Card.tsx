import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({
  title,
  className,
  children,
}: {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-soft",
        className,
      )}
    >
      {title && <h3 className="text-[17px] font-bold text-foreground">{title}</h3>}
      {children}
    </div>
  );
}
