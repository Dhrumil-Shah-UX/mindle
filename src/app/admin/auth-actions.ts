"use server";

import { adminSecretRequired, verifyAdminPassword } from "@/lib/admin/auth";
import { fetchAllGames } from "@/lib/supabase/server";
import type { Game } from "@/lib/types";

export async function checkAdminPassword(
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!adminSecretRequired()) {
    return { ok: false, error: "Admin password is not configured." };
  }

  if (!verifyAdminPassword(password)) {
    return { ok: false, error: "Incorrect password." };
  }

  return { ok: true };
}

export async function fetchAdminGames(password: string): Promise<Game[] | null> {
  if (!verifyAdminPassword(password)) return null;
  return fetchAllGames();
}
