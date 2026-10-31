import { PawPrint } from "lucide-react";
import { cn } from "../../lib/utils";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-primary text-primary-foreground",
          size === "lg" ? "h-10 w-10" : "h-8 w-8",
        )}
      >
        <PawPrint size={size === "lg" ? 20 : 16} />
      </div>
      <span
        className={cn(
          "font-display font-bold text-foreground",
          size === "lg" ? "text-[28px]" : "text-[21px]",
        )}
      >
        Petalog
      </span>
    </div>
  );
}
