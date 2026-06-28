/** Current moment as ISO string for active-game comparison. */
export function getNowIsoString(date = new Date()): string {
  return date.toISOString();
}

/** Combine admin date (YYYY-MM-DD) and time (HH:MM) into an ISO timestamptz string. */
export function combineResetDateTime(date: string, time: string): string | null {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

/** Split a stored reset_date into admin date and time fields (local timezone). */
export function splitResetDateTime(iso: string): { date: string; time: string } {
  const parsed = new Date(iso);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
}
