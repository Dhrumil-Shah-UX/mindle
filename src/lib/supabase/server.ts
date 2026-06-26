import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/create-client";
import type { Game } from "@/lib/types";
import { getTodayDateString } from "@/lib/game/getActiveGame";

export { isSupabaseConfigured };

export function createServerClient() {
  return createSupabaseClient();
}

/**
 * Returns the game that should be shown today.
 * Queries games where reset_date <= today, picks the latest reset_date.
 */
export async function getActiveGame(today = getTodayDateString()): Promise<Game | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .lte("reset_date", today)
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
