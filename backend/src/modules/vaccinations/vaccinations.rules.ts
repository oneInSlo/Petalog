import { addDays, toIsoDate } from "../../lib/dates.js";

const DUE_SOON_DAYS = 30;

export type VaccinationStatus = "OVERDUE" | "DUE_SOON" | "VALID";

/** Both dates are YYYY-MM-DD, so they compare correctly as strings. */
export function getVaccinationStatus(nextDueDate: string, today: string): VaccinationStatus {
  if (nextDueDate < today) return "OVERDUE";
  if (nextDueDate <= addDays(today, DUE_SOON_DAYS)) return "DUE_SOON";
  return "VALID";
}

/**
 * Keeps the overdue or soon due vaccinations, oldest due date first. Expects the newest vaccination
 * first, because only the latest one of each vaccine counts: a later dose replaces an expired one.
 */
export function selectDueVaccinations<
  T extends { animalId: number; vaccineId: number; nextDueDate: Date },
>(newestFirst: T[], today: string) {
  const latest = new Map<string, T>();
  for (const vaccination of newestFirst) {
    const key = `${vaccination.animalId}-${vaccination.vaccineId}`;
    if (!latest.has(key)) {
      latest.set(key, vaccination);
    }
  }

  return [...latest.values()]
    .filter(({ nextDueDate }) => getVaccinationStatus(toIsoDate(nextDueDate), today) !== "VALID")
    .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
}
