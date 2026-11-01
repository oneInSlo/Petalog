import { CheckCircle2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { AppFrame } from "../../components/ui/AppFrame";
import { Badge } from "../../components/ui/Badge";
import { Btn } from "../../components/ui/Btn";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import { Table } from "../../components/ui/Table";
import { Tabs } from "../../components/ui/Tabs";
import type { Animal } from "../../lib/animals";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/dates";
import { statusLabels, statusTones, type CalendarEntry } from "../../lib/vaccinations";
import { AddVaccinationDialog } from "./AddVaccinationDialog";
import { AllergiesCard } from "./AllergiesCard";
import { AnimalHeader } from "./AnimalHeader";
import { Timeline } from "./Timeline";

const TABS = ["Časovnica", "Cepljenja"];
const TIMELINE_TAB = 0;

function StatusBadge({ entry }: { entry: CalendarEntry }) {
  return <Badge tone={statusTones[entry.status]}>{statusLabels[entry.status]}</Badge>;
}

function VaccinationCalendar({ calendar }: { calendar: CalendarEntry[] }) {
  if (calendar.length === 0) {
    return <p className="text-muted-foreground">Ni zabeleženih cepljenj.</p>;
  }

  return (
    <>
      <Table
        className="hidden md:block"
        head={["Cepivo", "Zadnje cepljenje", "Naslednji rok", "Status"]}
        rows={calendar.map((entry) => [
          <span className="font-semibold">{entry.vaccine.name}</span>,
          formatDate(entry.vaccinationDate),
          formatDate(entry.nextDueDate),
          <StatusBadge entry={entry} />,
        ])}
      />
      <div className="flex flex-col gap-3 md:hidden">
        {calendar.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 break-words font-semibold">{entry.vaccine.name}</span>
              <StatusBadge entry={entry} />
            </div>
            <div className="flex justify-between gap-4 text-[14px]">
              <span className="text-muted-foreground">Zadnje cepljenje</span>
              <span>{formatDate(entry.vaccinationDate)}</span>
            </div>
            <div className="flex justify-between gap-4 text-[14px]">
              <span className="text-muted-foreground">Naslednji rok</span>
              <span>{formatDate(entry.nextDueDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AddedNote({ added, calendar }: { added: CalendarEntry; calendar: CalendarEntry[] }) {
  const shown = calendar.find(({ vaccine }) => vaccine.id === added.vaccine.id);
  const newerDate =
    shown && shown.vaccinationDate > added.vaccinationDate ? shown.vaccinationDate : null;

  return (
    <Note tone="ok" icon={CheckCircle2}>
      Cepljenje je shranjeno: {added.vaccine.name}, {formatDate(added.vaccinationDate)}, naslednji
      rok {formatDate(added.nextDueDate)}.
      {newerDate && ` V koledarju ostaja novejše cepljenje z dne ${formatDate(newerDate)}.`}
    </Note>
  );
}

export function AnimalRecordPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(TIMELINE_TAB);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [calendar, setCalendar] = useState<CalendarEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<CalendarEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    Promise.all([
      api<{ animal: Animal }>(`/animals/${id}`),
      api<{ calendar: CalendarEntry[] }>(`/animals/${id}/vaccinations`),
    ])
      .then(([animalData, calendarData]) => {
        if (cancelled) return;
        setAnimal(animalData.animal);
        setCalendar(calendarData.calendar);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadCount]);

  function handleAdded(vaccination: CalendarEntry) {
    setAdding(false);
    setAdded(vaccination);
    setReloadCount((count) => count + 1);
  }

  function startAdding() {
    setAdded(null);
    setAdding(true);
  }

  const isVeterinarian = user?.role === "VETERINARIAN";
  // Receptionists only work with the vaccination calendar, not with medical data
  const seesMedicalData = user?.role !== "RECEPTIONIST";
  const showTimeline = seesMedicalData && tab === TIMELINE_TAB;

  return (
    <AppFrame title="Karton živali" subtitle={animal?.name}>
      {error && <Note tone="bad">{error}</Note>}
      {!animal && !error && <p className="text-muted-foreground">Nalaganje ...</p>}

      {animal && calendar && (
        <>
          <AnimalHeader animal={animal} />
          {seesMedicalData && <AllergiesCard animalId={animal.id} canAdd={isVeterinarian} />}
          <Card className="gap-6">
            {seesMedicalData && <Tabs items={TABS} active={tab} onSelect={setTab} />}
            {showTimeline ? (
              <Timeline
                animalId={animal.id}
                canOpenRecords={isVeterinarian}
                action={
                  isVeterinarian && (
                    <Btn
                      icon={Plus}
                      onClick={() => navigate(`/animals/${animal.id}/medical-records/new`)}
                    >
                      Nov zapis
                    </Btn>
                  )
                }
              />
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-[17px] font-bold text-foreground">Cepljenja</h3>
                  {isVeterinarian && (
                    <Btn icon={Plus} onClick={startAdding}>
                      Dodaj cepljenje
                    </Btn>
                  )}
                </div>
                {added && <AddedNote added={added} calendar={calendar} />}
                <VaccinationCalendar calendar={calendar} />
              </>
            )}
          </Card>
          {adding && (
            <AddVaccinationDialog
              animal={animal}
              onClose={() => setAdding(false)}
              onAdded={handleAdded}
            />
          )}
        </>
      )}
    </AppFrame>
  );
}
