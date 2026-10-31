import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "dangerOutline" | "tint";

const variantClasses: Record<BtnVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "text-primary hover:bg-primary-tint",
  danger: "bg-bad-fg text-primary-foreground",
  dangerOutline: "border border-bad-fg bg-card text-bad-fg hover:bg-bad",
  tint: "bg-primary-tint text-primary",
};

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: "sm" | "md";
  icon?: LucideIcon;
};

export function Btn({
  variant = "primary",
  size = "md",
  icon: Icon,
  type = "button",
  className,
  children,
  ...props
}: BtnProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-[14px]",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}
