"use server";

import { revalidatePath } from "next/cache";
import { assertAdminPassword } from "@/lib/admin/auth";
import { createSupabaseClient } from "@/lib/supabase/create-client";

export type GameFormInput = {
  word: string;
  reset_date: string;
  hint1: string;
  hint2: string;
  hint3: string;
  lesson: string;
};

function toPayload(input: GameFormInput) {
  return {
    word: input.word.trim().toUpperCase(),
    reset_date: input.reset_date,
    hints: [input.hint1.trim(), input.hint2.trim(), input.hint3.trim()],
    lesson: input.lesson.trim(),
  };
}

function validate(input: GameFormInput): string | null {
  if (!input.word.trim()) return "UX word is required.";
  if (!input.reset_date) return "Reset date is required.";
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
