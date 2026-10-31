import { LogOut } from "lucide-react";
import { Btn } from "./Btn";
import { PersonAvatar } from "./PersonAvatar";

export function TopBar({
  title,
  subtitle,
  userName,
  roleLabel,
  onLogout,
}: {
  title: string;
  subtitle?: string;
  userName: string;
  roleLabel: string;
  onLogout: () => void;
}) {
  return (
    <header className="hidden h-[76px] shrink-0 items-center gap-6 border-b border-border bg-card px-8 md:flex">
      <div className="flex flex-col">
        <h1 className="font-display text-[24px] font-bold leading-tight text-foreground">
          {title}
        </h1>
        {subtitle && <span className="text-[13px] text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-3">
          <PersonAvatar name={userName} />
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold">{userName}</span>
            <span className="text-[12px] text-muted-foreground">{roleLabel}</span>
          </div>
        </div>
        <Btn variant="secondary" size="sm" icon={LogOut} onClick={onLogout}>
          Odjava
        </Btn>
      </div>
    </header>
  );
}
