import { useEffect, useState } from "react";

type ApiStatus = "checking" | "ok" | "error";

const statusLabels: Record<ApiStatus, string> = {
  checking: "Preverjanje povezave ...",
  ok: "Strežnik in baza delujeta",
  error: "Strežnik ali baza ni dosegljiva",
};

const statusStyles: Record<ApiStatus, string> = {
  checking: "bg-neutral text-neutral-fg",
  ok: "bg-ok text-ok-fg",
  error: "bg-bad text-bad-fg",
};

export function HomePage() {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => setStatus(response.ok ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <div className="rounded-lg border border-border bg-card p-6 text-center shadow-soft">
        <h1 className="font-display text-2xl font-semibold text-primary">Petalog</h1>
        <p className="mt-2 text-muted-foreground">
          Veterinarska ambulanta Petalog · Celovška cesta 25, Ljubljana
        </p>
        <span
          className={`mt-4 inline-block rounded-md px-3 py-1 text-[13px] font-semibold ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>
    </main>
  );
}
