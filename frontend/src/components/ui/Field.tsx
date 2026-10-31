import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Field({ label, error, hint, className, ...props }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          "h-10 w-full rounded-md border bg-card px-3 text-[14px] text-foreground outline-none",
          "placeholder:text-muted-foreground focus:border-primary",
          error ? "border-bad-fg focus:border-bad-fg" : "border-border",
        )}
        {...props}
      />
      {message && (
        <span
          id={messageId}
          className={cn(
            "text-[13px]",
            error ? "font-semibold text-bad-fg" : "text-muted-foreground",
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
}
