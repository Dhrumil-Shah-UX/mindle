import { createHmac, timingSafeEqual } from "crypto";
import type { ClientGameState } from "@/lib/types";
import { env } from "@/lib/env";

function getSecret(): string {
  const secret = process.env.GAME_STATE_SECRET ?? env.adminSecret;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("GAME_STATE_SECRET or ADMIN_SECRET must be set in production");
    }
    return "mindle-dev-only";
  }
  return secret;
}

function serialize(gameId: string, state: ClientGameState): string {
  return JSON.stringify({
    gameId,
    guessedLetters: [...state.guessedLetters].sort(),
    wrongLetters: state.wrongLetters,
    revealedHintCount: state.revealedHintCount,
    attemptsRemaining: state.attemptsRemaining,
    phase: state.phase,
  });
}

export function signGameState(gameId: string, state: ClientGameState): string {
  return createHmac("sha256", getSecret()).update(serialize(gameId, state)).digest("hex");
}

export function verifyGameState(
  gameId: string,
  state: ClientGameState,
  signature: string,
): boolean {
  const expected = signGameState(gameId, state);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
