const CLINIC_TIME_ZONE = "Europe/Ljubljana";

function dateAtClinic(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE }).format(date);
}

/** Today's calendar date at the clinic as YYYY-MM-DD. */
export function todayAtClinic() {
  return dateAtClinic(new Date());
}

/** Formats a YYYY-MM-DD date in Slovene notation, e.g. 10. 3. 2026. */
export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return `${day}. ${month}. ${year}`;
}

/** Formats a timestamp as the clinic's calendar date, e.g. 10. 3. 2026. */
export function formatTimestampDate(timestamp: string) {
  return formatDate(dateAtClinic(new Date(timestamp)));
}

/** Formats a timestamp at the clinic, e.g. 10. 3. 2026 ob 09:30. */
export function formatDateTime(timestamp: string) {
  const time = new Intl.DateTimeFormat("sl-SI", {
    timeZone: CLINIC_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

  return `${formatTimestampDate(timestamp)} ob ${time}`;
}
