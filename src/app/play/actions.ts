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
  });
  return finalizeSession(game, toClientState(engineState));
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
