import { dateAtClinic, toIsoDate } from "../../lib/dates.js";

type Person = { id: number; firstName: string; lastName: string };

type TimelineRecord = {
  id: number;
  anamnesis: string;
  diagnosis: string;
  therapy: string | null;
  status: "DRAFT" | "CLOSED";
  closedAt: Date | null;
  createdAt: Date;
  veterinarian: Person;
  addenda: { id: number; content: string; createdAt: Date; author: Person }[];
};

type TimelineVaccination = {
  id: number;
  vaccinationDate: Date;
  nextDueDate: Date;
  batchNumber: string | null;
  createdAt: Date;
  vaccine: { id: number; name: string };
  veterinarian: Person;
};

/** Merges records and vaccinations, newest first. Within a day, the later entry comes first. */
export function mergeTimeline(records: TimelineRecord[], vaccinations: TimelineVaccination[]) {
  const entries = [
    ...records.map(({ veterinarian, createdAt, ...record }) => ({
      type: "RECORD" as const,
      date: dateAtClinic(createdAt),
      author: veterinarian,
      enteredAt: createdAt,
      createdAt,
      ...record,
    })),
    ...vaccinations.map(({ id, vaccine, veterinarian, batchNumber, createdAt, ...dates }) => ({
      type: "VACCINATION" as const,
      id,
      date: toIsoDate(dates.vaccinationDate),
      author: veterinarian,
      enteredAt: createdAt,
      vaccine,
      nextDueDate: toIsoDate(dates.nextDueDate),
      batchNumber,
    })),
  ];

  return entries
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.enteredAt.getTime() - a.enteredAt.getTime(),
    )
    .map(({ enteredAt: _enteredAt, ...entry }) => entry);
}
