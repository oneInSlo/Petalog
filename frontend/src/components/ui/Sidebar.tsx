import { NavLink } from "react-router";
import type { NavItem } from "../../auth/roles";
import { cn } from "../../lib/utils";
import { Logo } from "./Logo";

export function Sidebar({ items }: { items: NavItem[] }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-8 border-r border-border bg-card px-4 py-6 md:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-[14px] font-semibold",
                isActive ? "bg-primary-tint text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-2 text-[12px] leading-snug text-muted-foreground">
        Veterinarska ambulanta Petalog
        <br />
        Celovška cesta 25, Ljubljana
      </div>
    </aside>
  );
}
