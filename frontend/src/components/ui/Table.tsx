import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Table({
  head,
  rows,
  className,
}: {
  head: string[];
  rows: ReactNode[][];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <div className="flex gap-4 bg-muted px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
        {head.map((heading, index) => (
          <div key={index} className="min-w-0 flex-1">
            {heading}
          </div>
        ))}
      </div>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 border-t border-border bg-card px-4 py-3 text-[14px]"
        >
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="min-w-0 flex-1 break-words">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
