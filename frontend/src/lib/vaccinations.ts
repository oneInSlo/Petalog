import type { Tone } from "../components/ui/tones";

export type VaccinationStatus = "OVERDUE" | "DUE_SOON" | "VALID";

export type Vaccine = { id: number; name: string; intervalMonths: number };

export type CalendarEntry = {
  id: number;
  vaccine: { id: number; name: string };
  vaccinationDate: string;
  nextDueDate: string;
  status: VaccinationStatus;
};

export const statusLabels: Record<VaccinationStatus, string> = {
  OVERDUE: "Zapadlo",
  DUE_SOON: "Kmalu zapade",
  VALID: "Veljavno",
};

export const statusTones: Record<VaccinationStatus, Tone> = {
  OVERDUE: "bad",
  DUE_SOON: "warn",
  VALID: "ok",
};
