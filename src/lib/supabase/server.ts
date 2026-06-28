import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/create-client";
import type { Game } from "@/lib/types";
import { getNowIsoString } from "@/lib/game/resetDateTime";

export { isSupabaseConfigured };

export function createServerClient() {
  return createSupabaseClient();
}

/**
 * Returns the game that should be shown now.
 * Queries games where reset_date <= now, picks the latest reset_date.
 */
export async function getActiveGame(now = getNowIsoString()): Promise<Game | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .lte("reset_date", now)
    .order("reset_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchAllGames(): Promise<Game[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("reset_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
