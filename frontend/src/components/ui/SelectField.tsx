import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
};

export function SelectField({ label, options, error, className, ...props }: SelectFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? messageId : undefined}
        className={cn(
          "h-10 w-full cursor-pointer rounded-md border bg-card px-3 text-[14px] text-foreground outline-none focus:border-primary",
          error ? "border-bad-fg focus:border-bad-fg" : "border-border",
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={messageId} className="text-[13px] font-semibold text-bad-fg">
          {error}
        </span>
      )}
    </div>
  );
}
