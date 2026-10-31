export function PersonAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-[13px] font-bold text-warn-fg">
      {initials}
    </div>
  );
}
