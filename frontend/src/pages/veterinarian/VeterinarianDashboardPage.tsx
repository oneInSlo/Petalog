import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AppFrame } from "../../components/ui/AppFrame";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Note } from "../../components/ui/Note";
import { Table } from "../../components/ui/Table";
import { api } from "../../lib/api";
import { formatDate, todayAtClinic } from "../../lib/dates";
import { fullName } from "../../lib/medicalRecords";
import { statusLabels, statusTones, type DueVaccination } from "../../lib/vaccinations";
import { PatientSearch } from "./PatientSearch";

function AnimalLink({ animal }: { animal: DueVaccination["animal"] }) {
  return (
    <Link to={`/animals/${animal.id}`} className="font-semibold text-primary hover:underline">
      {animal.name}
    </Link>
  );
}

function StatusBadge({ vaccination }: { vaccination: DueVaccination }) {
  return <Badge tone={statusTones[vaccination.status]}>{statusLabels[vaccination.status]}</Badge>;
}

function ownerPhone({ animal }: DueVaccination) {
  return animal.owner.phone ?? "Ni telefona";
}

function DueVaccinations({ vaccinations }: { vaccinations: DueVaccination[] }) {
  if (vaccinations.length === 0) {
    return <p className="text-muted-foreground">Ni zapadlih cepljenj.</p>;
  }

  return (
    <>
      <Table
        className="hidden md:block"
        head={["Žival", "Lastnik", "Telefon", "Cepivo", "Rok", "Status"]}
        rows={vaccinations.map((vaccination) => [
          <AnimalLink animal={vaccination.animal} />,
          fullName(vaccination.animal.owner),
          ownerPhone(vaccination),
          vaccination.vaccine.name,
          formatDate(vaccination.nextDueDate),
          <StatusBadge vaccination={vaccination} />,
        ])}
      />
      <div className="flex flex-col gap-3 md:hidden">
        {vaccinations.map((vaccination) => (
          <div
            key={vaccination.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-4 text-[14px]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AnimalLink animal={vaccination.animal} />
              <StatusBadge vaccination={vaccination} />
            </div>
            <span className="break-words">
              {vaccination.vaccine.name} · {formatDate(vaccination.nextDueDate)}
            </span>
            <span className="break-words text-muted-foreground">
              {fullName(vaccination.animal.owner)} · {ownerPhone(vaccination)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function VeterinarianDashboardPage() {
  const [vaccinations, setVaccinations] = useState<DueVaccination[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    api<{ vaccinations: DueVaccination[] }>("/vaccinations/due")
      .then((data) => {
        if (!cancelled) setVaccinations(data.vaccinations);
      })
      .catch((caught: Error) => {
        if (!cancelled) setError(caught.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppFrame title="Nadzorna plošča" subtitle={formatDate(todayAtClinic())}>
      <PatientSearch />
      <Card title="Cepljenja, ki zapadejo">
        <span className="-mt-2 text-[13px] text-muted-foreground">
          Razvrščeno po najstarejšem roku
        </span>
        {error && <Note tone="bad">{error}</Note>}
        {vaccinations === null && !error && (
          <p className="text-muted-foreground">Nalaganje ...</p>
        )}
        {vaccinations && <DueVaccinations vaccinations={vaccinations} />}
      </Card>
    </AppFrame>
  );
}
