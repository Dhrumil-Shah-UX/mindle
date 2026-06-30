"use server";

import { revalidatePath } from "next/cache";
import { assertAdminPassword } from "@/lib/admin/auth";
import { parsePrefilledLetters } from "@/lib/game/engine";
import { combineResetDateTime, isValidTimeZone } from "@/lib/game/resetDateTime";
import { createSupabaseClient } from "@/lib/supabase/create-client";

export type GameFormInput = {
  word: string;
  reset_date: string;
  reset_time: string;
  reset_timezone: string;
  prefilled_letters: string;
  hint1: string;
  hint2: string;
  hint3: string;
  lesson: string;
};

function toPayload(input: GameFormInput) {
  const resetAt = combineResetDateTime(
    input.reset_date,
    input.reset_time,
    input.reset_timezone,
  );
  if (!resetAt) {
    throw new Error("Invalid reset date, time, or timezone.");
  }

  return {
    word: input.word.trim().toUpperCase(),
    reset_date: resetAt,
    reset_timezone: input.reset_timezone.trim(),
    prefilled_letters: parsePrefilledLetters(input.prefilled_letters, input.word),
    hints: [input.hint1.trim(), input.hint2.trim(), input.hint3.trim()],
    lesson: input.lesson.trim(),
  };
}

function validate(input: GameFormInput): string | null {
  if (!input.word.trim()) return "UX word is required.";
  if (!input.reset_date) return "Reset date is required.";
  if (!input.reset_time) return "Reset time is required.";
  if (!input.reset_timezone.trim()) return "Reset timezone is required.";
  if (!isValidTimeZone(input.reset_timezone)) return "Reset timezone is invalid.";
  if (!combineResetDateTime(input.reset_date, input.reset_time, input.reset_timezone)) {
    return "Reset date, time, or timezone is invalid.";
  }
  if (!input.hint1.trim() || !input.hint2.trim() || !input.hint3.trim()) {
    return "All three hints are required.";
  }
  if (!input.lesson.trim()) return "Lesson is required.";
  return null;
}

function revalidateGamePaths() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/play");
}

export async function createGame(
  input: GameFormInput,
  adminPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    assertAdminPassword(adminPassword);
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const error = validate(input);
  if (error) return { ok: false, error };

  const supabase = createSupabaseClient();
  const { error: dbError } = await supabase.from("games").insert(toPayload(input));

  if (dbError) return { ok: false, error: dbError.message };

  revalidateGamePaths();
  return { ok: true };
}

export async function updateGame(
  id: string,
  input: GameFormInput,
  adminPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    assertAdminPassword(adminPassword);
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const error = validate(input);
  if (error) return { ok: false, error };

  const supabase = createSupabaseClient();
  const { error: dbError } = await supabase.from("games").update(toPayload(input)).eq("id", id);

  if (dbError) return { ok: false, error: dbError.message };

  revalidateGamePaths();
  return { ok: true };
}

export async function deleteGame(
  id: string,
  adminPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    assertAdminPassword(adminPassword);
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const supabase = createSupabaseClient();
  const { error: dbError } = await supabase.from("games").delete().eq("id", id);

  if (dbError) return { ok: false, error: dbError.message };

  revalidateGamePaths();
  return { ok: true };
}
