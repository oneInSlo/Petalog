import { addDays } from "../../lib/dates.js";

const DUE_SOON_DAYS = 30;

export type VaccinationStatus = "OVERDUE" | "DUE_SOON" | "VALID";

/** Both dates are YYYY-MM-DD, so they compare correctly as strings. */
export function getVaccinationStatus(nextDueDate: string, today: string): VaccinationStatus {
  if (nextDueDate < today) return "OVERDUE";
  if (nextDueDate <= addDays(today, DUE_SOON_DAYS)) return "DUE_SOON";
  return "VALID";
}
