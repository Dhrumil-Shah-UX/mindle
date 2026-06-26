import type { Game } from "@/lib/types";

/** Today's date as YYYY-MM-DD (local timezone). */
export function getTodayDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * From a list of games, pick the one that is live today:
 * the latest game whose reset_date is on or before today.
 *
 * Example (today = July 12):
 *   July 3  → Affordance        ✓ eligible
 *   July 10 → Heuristic Eval    ✓ eligible  ← wins (latest)
 *   July 17 → Cognitive Load    ✗ future
 */
export function selectActiveGame(games: Game[], today: string): Game | null {
  let active: Game | null = null;

  for (const game of games) {
    if (game.reset_date > today) continue;

    if (
      !active ||
      game.reset_date > active.reset_date ||
      (game.reset_date === active.reset_date && game.created_at > active.created_at)
    ) {
      active = game;
    }
  }

  return active;
}
