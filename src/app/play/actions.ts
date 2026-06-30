"use server";

import {
  createInitialState,
  guessFullWord,
  guessLetter,
  revealHint,
} from "@/lib/game/engine";
import { buildPlaySession, toClientState, toEngineState } from "@/lib/game/display";
import { signGameState, verifyGameState } from "@/lib/game/session";
import { createSupabaseClient } from "@/lib/supabase/create-client";
import type { ClientGameState, Game, PublicPlaySession } from "@/lib/types";

type ActionResult =
  | { ok: true; session: PublicPlaySession }
  | { ok: false; error: string };

async function fetchGameById(gameId: string): Promise<Game | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("games").select("*").eq("id", gameId).maybeSingle();
  if (error) throw error;
  return data;
}

function finalizeSession(game: Game, state: ClientGameState): PublicPlaySession {
  const engineState = toEngineState(game, state);
  const payload = buildPlaySession(game, engineState);
  return {
    ...payload,
    signature: signGameState(game.id, payload.state),
  };
}

function assertVerified(gameId: string, state: ClientGameState, signature: string): boolean {
  if (state.phase !== "playing") return false;
  return verifyGameState(gameId, state, signature);
}

export async function createPlaySession(game: Game): Promise<PublicPlaySession> {
  const engineState = createInitialState({
    word: game.word,
    hints: game.hints,
    lesson: game.lesson,
    prefilledLetters: game.prefilled_letters ?? [],
  });
  return finalizeSession(game, toClientState(engineState));
}

export async function createPlaySessionByGameId(gameId: string): Promise<PublicPlaySession> {
  const game = await fetchGameById(gameId);
  if (!game) throw new Error("Game not found.");
  return createPlaySession(game);
}

export async function registerPlayer(
  name: string,
  email: string,
): Promise<{ ok: true; playerId: string } | { ok: false; error: string }> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) return { ok: false, error: "Name is required." };
  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    return { ok: false, error: "Valid email is required." };
  }

  const supabase = createSupabaseClient();
  const { data: existing, error: lookupError } = await supabase
    .from("players")
    .select("id")
    .eq("email", trimmedEmail)
    .maybeSingle();

  if (lookupError) return { ok: false, error: lookupError.message };

  if (existing) {
    const { error: updateError } = await supabase
      .from("players")
      .update({ name: trimmedName })
      .eq("id", existing.id);

    if (updateError) return { ok: false, error: updateError.message };
    return { ok: true, playerId: existing.id };
  }

  const { data, error } = await supabase
    .from("players")
    .insert({ name: trimmedName, email: trimmedEmail })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, playerId: data.id };
}

export async function saveGameResult(input: {
  gameId: string;
  playerId: string;
  result: "win" | "lose";
  attemptsUsed: number;
  reflectionBuilding: string;
  reflectionChallenges: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createSupabaseClient();
  const building = input.reflectionBuilding.trim();
  const challenges = input.reflectionChallenges.trim();

  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("name")
    .eq("id", input.playerId)
    .maybeSingle();

  if (playerError) return { ok: false, error: playerError.message };
  if (!player) return { ok: false, error: "Player not found." };

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("word")
    .eq("id", input.gameId)
    .maybeSingle();

  if (gameError) return { ok: false, error: gameError.message };
  if (!game) return { ok: false, error: "Game not found." };

  const { error } = await supabase.from("game_results").upsert(
    {
      game_id: input.gameId,
      player_id: input.playerId,
      player_name: player.name.trim(),
      game_word: game.word.trim().toUpperCase(),
      result: input.result,
      attempts_used: input.attemptsUsed,
      reflection_building: building || null,
      reflection_challenges: challenges || null,
    },
    { onConflict: "game_id,player_id" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function submitLetterGuess(
  gameId: string,
  state: ClientGameState,
  signature: string,
  letter: string,
): Promise<ActionResult> {
  if (!assertVerified(gameId, state, signature)) {
    return { ok: false, error: "Invalid or stale game session." };
  }

  const game = await fetchGameById(gameId);
  if (!game) return { ok: false, error: "Game not found." };

  const next = guessLetter(toEngineState(game, state), letter);
  return { ok: true, session: finalizeSession(game, toClientState(next)) };
}

export async function submitWordGuess(
  gameId: string,
  state: ClientGameState,
  signature: string,
  guess: string,
): Promise<ActionResult> {
  if (!assertVerified(gameId, state, signature)) {
    return { ok: false, error: "Invalid or stale game session." };
  }

  const game = await fetchGameById(gameId);
  if (!game) return { ok: false, error: "Game not found." };

  const next = guessFullWord(toEngineState(game, state), guess);
  return { ok: true, session: finalizeSession(game, toClientState(next)) };
}

export async function submitHintReveal(
  gameId: string,
  state: ClientGameState,
  signature: string,
  hintIndex: number,
): Promise<ActionResult> {
  if (!assertVerified(gameId, state, signature)) {
    return { ok: false, error: "Invalid or stale game session." };
  }

  const game = await fetchGameById(gameId);
  if (!game) return { ok: false, error: "Game not found." };

  const next = revealHint(toEngineState(game, state), hintIndex);
  return { ok: true, session: finalizeSession(game, toClientState(next)) };
}
