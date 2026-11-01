import { addDays, toIsoDate } from "../../lib/dates.js";

const DUE_SOON_DAYS = 30;

export type VaccinationStatus = "OVERDUE" | "DUE_SOON" | "VALID";

/** Both dates are YYYY-MM-DD, so they compare correctly as strings. */
export function getVaccinationStatus(nextDueDate: string, today: string): VaccinationStatus {
  if (nextDueDate < today) return "OVERDUE";
  if (nextDueDate <= addDays(today, DUE_SOON_DAYS)) return "DUE_SOON";
  return "VALID";
}

type DatedVaccination = { animalId: number; vaccineId: number; nextDueDate: Date };

/**
 * The latest vaccination of each vaccine per animal, oldest due date first. Expects the newest
 * vaccination first, because a later dose replaces an expired one.
 */
function latestByDueDate<T extends DatedVaccination>(newestFirst: T[]) {
  const latest = new Map<string, T>();
  for (const vaccination of newestFirst) {
    const key = `${vaccination.animalId}-${vaccination.vaccineId}`;
    if (!latest.has(key)) {
      latest.set(key, vaccination);
    }
  }

  return [...latest.values()].sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
}

/** Keeps the overdue or soon due vaccinations, oldest due date first. */
export function selectDueVaccinations<T extends DatedVaccination>(newestFirst: T[], today: string) {
  return latestByDueDate(newestFirst).filter(
    ({ nextDueDate }) => getVaccinationStatus(toIsoDate(nextDueDate), today) !== "VALID",
  );
}

/** The vaccination whose due date comes first, which is an expired one if there is any. */
export function findNearestDueVaccination<T extends DatedVaccination>(newestFirst: T[]) {
  return latestByDueDate(newestFirst)[0] ?? null;
}
