const CLINIC_TIME_ZONE = "Europe/Ljubljana";

export type Age = { years: number; months: number };

/** Today's calendar date at the clinic as YYYY-MM-DD. */
export function todayAtClinic(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(now);
}

/** Completed years and months between two YYYY-MM-DD dates. */
export function calculateAge(dateOfBirth: string, today: string): Age {
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split("-").map(Number);
  const [year, month, day] = today.split("-").map(Number);

  const totalMonths = (year - birthYear) * 12 + (month - birthMonth) - (day < birthDay ? 1 : 0);

  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}
