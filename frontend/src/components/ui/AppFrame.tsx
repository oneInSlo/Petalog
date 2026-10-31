import { LogOut } from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { navItems, roleLabels } from "../../auth/roles";
import { cn } from "../../lib/utils";
import { Btn } from "./Btn";
import { Logo } from "./Logo";
import { Note } from "./Note";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const MAX_MOBILE_NAV_ITEMS = 4;

export function AppFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const [logoutFailed, setLogoutFailed] = useState(false);

  if (!user) return null;

  const items = navItems(user.role);

  function handleLogout() {
    setLogoutFailed(false);
    logout().catch(() => setLogoutFailed(true));
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={items} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          subtitle={subtitle}
          userName={`${user.firstName} ${user.lastName}`}
          roleLabel={roleLabels[user.role]}
          onLogout={handleLogout}
        />
        <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3 md:hidden">
          <Logo />
          <Btn variant="secondary" size="sm" icon={LogOut} onClick={handleLogout}>
            Odjava
          </Btn>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-5 md:gap-6 md:p-8">
          <h1 className="font-display text-[24px] font-bold leading-tight md:hidden">
            {title}
          </h1>
          {logoutFailed && <Note tone="bad">Odjava ni uspela. Poskusite znova.</Note>}
          {children}
        </main>
        <nav className="sticky bottom-0 flex border-t border-border bg-card px-2 pb-3 pt-2 md:hidden">
          {items.slice(0, MAX_MOBILE_NAV_ITEMS).map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-semibold",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full",
                      isActive && "bg-primary-tint",
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
