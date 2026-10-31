import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../../components/ui/Logo";
import { Tabs } from "../../components/ui/Tabs";

const tabPaths = ["/login", "/register"];

export function AuthShell({ tab, children }: { tab: number; children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-5 md:py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size="lg" />
        <p className="text-[16px] text-muted-foreground">Zdravstveni karton za vaše živali</p>
      </div>
      <div className="flex w-full max-w-[440px] flex-col gap-6 rounded-lg border border-border bg-card p-6 shadow-soft md:p-8">
        <Tabs
          items={["Prijava", "Registracija"]}
          active={tab}
          onSelect={(index) => navigate(tabPaths[index])}
        />
        {children}
      </div>
      <p className="text-center text-[13px] text-muted-foreground">
        Veterinarska ambulanta Petalog · Celovška cesta 25, Ljubljana
      </p>
    </div>
  );
}
