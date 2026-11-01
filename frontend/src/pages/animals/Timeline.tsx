import { Stethoscope, Syringe } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Chip } from "../../components/ui/Chip";
import { Note } from "../../components/ui/Note";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/dates";
import { fullName, type TimelineEntry, type TimelineType } from "../../lib/medicalRecords";
import { AddendaList, ReadOnlyRecord } from "../medical-records/ReadOnlyRecord";
import { RecordStatusBadge } from "../medical-records/RecordStatusBadge";

const filters: { label: string; type: TimelineType | null }[] = [
  { label: "Vse", type: null },
  { label: "Zapisi", type: "RECORD" },
  { label: "Cepljenja", type: "VACCINATION" },
];

function EntryDetails({ entry, canOpenRecords }: { entry: TimelineEntry; canOpenRecords: boolean }) {
  if (entry.type === "VACCINATION") {
    return (
      <>
        <span className="break-words font-bold">Cepljenje – {entry.vaccine.name}</span>
        <span className="text-[13px] text-muted-foreground">
          {fullName(entry.author)} · Naslednji rok: {formatDate(entry.nextDueDate)}
        </span>
      </>
    );
  }

  const title = `Zdravstveni zapis – ${entry.diagnosis}`;

  return (
    <>
      {canOpenRecords ? (
        <Link to={`/medical-records/${entry.id}`} className="break-words font-bold hover:text-primary">
          {title}
        </Link>
      ) : (
        <span className="break-words font-bold">{title}</span>
      )}
      <span className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
        {fullName(entry.author)}
        <RecordStatusBadge status={entry.status} />
      </span>
      {!canOpenRecords && (
        <details className="mt-2">
          <summary className="cursor-pointer text-[13px] font-semibold text-primary">
            Prikaži podrobnosti
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            <ReadOnlyRecord
              anamnesis={entry.anamnesis}
              diagnosis={entry.diagnosis}
              therapy={entry.therapy}
            />
            <AddendaList addenda={entry.addenda} />
          </div>
        </details>
      )}
    </>
  );
}

export function Timeline({
  animalId,
  canOpenRecords,
  action,
}: {
  animalId: number;
  canOpenRecords: boolean;
  action?: ReactNode;
}) {
  const [type, setType] = useState<TimelineType | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setEntries(null);
    setError(null);

    api<{ timeline: TimelineEntry[] }>(
      `/animals/${animalId}/timeline${type ? `?type=${type}` : ""}`,
    )
      .then((data) => {
        if (!cancelled) setEntries(data.timeline);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [animalId, type]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Chip
              key={filter.label}
              active={filter.type === type}
              onClick={() => setType(filter.type)}
            >
              {filter.label}
            </Chip>
          ))}
        </div>
        {action}
      </div>

      {error && <Note tone="bad">{error}</Note>}
      {entries === null && !error && <p className="text-muted-foreground">Nalaganje ...</p>}
      {entries?.length === 0 && <p className="text-muted-foreground">Ni vnosov.</p>}
      {entries && entries.length > 0 && (
        <div className="flex flex-col">
          {entries.map((entry, index) => {
            const Icon = entry.type === "RECORD" ? Stethoscope : Syringe;

            return (
              <div key={`${entry.type}-${entry.id}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <Icon size={16} />
                  </div>
                  {index < entries.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-6">
                  <span className="text-[13px] font-semibold text-muted-foreground">
                    {formatDate(entry.date)}
                  </span>
                  <EntryDetails entry={entry} canOpenRecords={canOpenRecords} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
