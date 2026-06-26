/** Format YYYY-MM-DD as "July 3, 2026" */
export function formatResetDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export { inputClassName, labelClassName } from "@/components/ui/form";
