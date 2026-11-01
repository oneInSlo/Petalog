import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextareaField({ label, error, className, ...props }: TextareaFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? messageId : undefined}
        className={cn(
          "w-full rounded-md border bg-card px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary",
          error ? "border-bad-fg focus:border-bad-fg" : "border-border",
        )}
        {...props}
      />
      {error && (
        <span id={messageId} className="text-[13px] font-semibold text-bad-fg">
          {error}
        </span>
      )}
    </div>
  );
}
