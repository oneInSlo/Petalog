const CLINIC_TIME_ZONE = "Europe/Ljubljana";

/** Today's calendar date at the clinic as YYYY-MM-DD. */
export function todayAtClinic() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(new Date());
}

/** Formats a YYYY-MM-DD date in Slovene notation, e.g. 10. 3. 2026. */
export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return `${day}. ${month}. ${year}`;
}
