const CLINIC_TIME_ZONE = "Europe/Ljubljana";

export type Age = { years: number; months: number };

/** The calendar date of a moment at the clinic as YYYY-MM-DD. */
export function dateAtClinic(moment: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(moment);
}

/** Today's calendar date at the clinic as YYYY-MM-DD. */
export function todayAtClinic(now: Date = new Date()): string {
  return dateAtClinic(now);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Adds calendar months to a YYYY-MM-DD date. A day missing in the target month becomes its last day. */
export function addMonths(date: string, months: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const lastDayOfTargetMonth = new Date(Date.UTC(year, month - 1 + months + 1, 0)).getUTCDate();

  return toIsoDate(
    new Date(Date.UTC(year, month - 1 + months, Math.min(day, lastDayOfTargetMonth))),
  );
}

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);

  return toIsoDate(new Date(Date.UTC(year, month - 1, day + days)));
}

/** Completed years and months between two YYYY-MM-DD dates. */
export function calculateAge(dateOfBirth: string, today: string): Age {
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split("-").map(Number);
  const [year, month, day] = today.split("-").map(Number);

  const totalMonths = (year - birthYear) * 12 + (month - birthMonth) - (day < birthDay ? 1 : 0);

  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}
