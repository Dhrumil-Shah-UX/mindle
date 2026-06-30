/** Current moment as ISO string for active-game comparison. */
export function getNowIsoString(date = new Date()): string {
  return date.toISOString();
}

export function isValidTimeZone(timeZone: string): boolean {
  const trimmed = timeZone.trim();
  if (!trimmed) return false;

  try {
    Intl.DateTimeFormat(undefined, { timeZone: trimmed });
    return true;
  } catch {
    return false;
  }
}

function getZonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** Combine admin date, time, and IANA timezone into a UTC ISO timestamptz string. */
export function combineResetDateTime(
  date: string,
  time: string,
  timeZone: string,
): string | null {
  if (!date || !time || !timeZone) return null;

  const tz = timeZone.trim();
  if (!isValidTimeZone(tz)) return null;

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) return null;

  const targetMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utcMs = targetMs;

  for (let i = 0; i < 3; i++) {
    const parts = getZonedParts(new Date(utcMs), tz);
    const zonedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    utcMs += targetMs - zonedAsUtc;
  }

  return new Date(utcMs).toISOString();
}

/** Split a stored reset_date into admin fields in the given IANA timezone. */
export function splitResetDateTime(
  iso: string,
  timeZone: string,
): { date: string; time: string } | null {
  if (!iso || !isValidTimeZone(timeZone)) return null;

  const parts = getZonedParts(new Date(iso), timeZone.trim());
  return {
    date: `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`,
    time: `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`,
  };
}
