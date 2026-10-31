import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { toneClasses, type Tone } from "./tones";

export function Note({
  tone = "warn",
  icon: Icon,
  children,
}: {
  tone?: Tone;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-md px-4 py-3 text-[14px] font-semibold",
        toneClasses[tone],
      )}
    >
      {Icon && <Icon size={18} className="mt-0.5 shrink-0" />}
      <div>{children}</div>
    </div>
  );
}
