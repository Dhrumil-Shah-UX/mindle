/** Format reset_date as "July 3, 2026 at 10:00 AM" */
export function formatResetDate(dateStr: string): string {
  const date = dateStr.includes("T") ? new Date(dateStr) : parseDateOnly(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} at ${timePart}`;
}

function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export { inputClassName, labelClassName } from "@/components/ui/form";
