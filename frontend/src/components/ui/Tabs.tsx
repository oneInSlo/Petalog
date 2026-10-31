import { cn } from "../../lib/utils";

export function Tabs({
  items,
  active,
  onSelect,
}: {
  items: string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex gap-6 border-b border-border">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          aria-current={index === active ? "page" : undefined}
          onClick={() => onSelect(index)}
          className={cn(
            "-mb-px cursor-pointer border-b-2 pb-3 text-[14px] font-semibold",
            index === active
              ? "border-accent text-foreground"
              : "border-transparent text-muted-foreground",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
