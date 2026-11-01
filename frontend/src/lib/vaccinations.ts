import type { Tone } from "../components/ui/tones";
import type { Species } from "./animals";

export type VaccinationStatus = "OVERDUE" | "DUE_SOON" | "VALID";

export type Vaccine = { id: number; name: string; intervalMonths: number };

export type CalendarEntry = {
  id: number;
  vaccine: { id: number; name: string };
  vaccinationDate: string;
  nextDueDate: string;
  status: VaccinationStatus;
};

export type DueVaccination = {
  id: number;
  vaccine: { id: number; name: string };
  animal: {
    id: number;
    name: string;
    species: Species;
    owner: { id: number; firstName: string; lastName: string; phone: string | null };
  };
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
