import type { Game } from "@/lib/types";
import { getNowIsoString } from "@/lib/game/resetDateTime";

export { getNowIsoString };

/**
 * From a list of games, pick the one that is live now:
 * the latest game whose reset_date is on or before the current datetime.
 */
export function selectActiveGame(games: Game[], nowIso = getNowIsoString()): Game | null {
  let active: Game | null = null;
  const nowMs = new Date(nowIso).getTime();

  for (const game of games) {
    const resetMs = new Date(game.reset_date).getTime();
    if (resetMs > nowMs) continue;

    if (
      !active ||
      resetMs > new Date(active.reset_date).getTime() ||
      (resetMs === new Date(active.reset_date).getTime() &&
        game.created_at > active.created_at)
    ) {
      active = game;
    }
  }

  return active;
}
