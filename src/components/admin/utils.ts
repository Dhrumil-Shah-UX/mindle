/** Format reset_date as "July 3, 2026 at 10:00 AM (America/New_York)" */
export function formatResetDate(dateStr: string, timeZone?: string): string {
  const date = dateStr.includes("T") ? new Date(dateStr) : parseDateOnly(dateStr);
  const zoneOptions = timeZone ? { timeZone } : {};
  const datePart = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...zoneOptions,
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...zoneOptions,
  });
  const base = `${datePart} at ${timePart}`;
  return timeZone ? `${base} (${timeZone})` : base;
}

function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export { inputClassName, labelClassName } from "@/components/ui/form";
