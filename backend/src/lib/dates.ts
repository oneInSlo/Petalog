const CLINIC_TIME_ZONE = "Europe/Ljubljana";

/** Today's calendar date at the clinic as YYYY-MM-DD. */
export function todayAtClinic(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(now);
}
