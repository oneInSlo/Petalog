import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { toneClasses, type Tone } from "./tones";

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-semibold",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
