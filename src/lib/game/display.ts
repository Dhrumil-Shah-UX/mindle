import type { Game } from "@/lib/types";
import type { MindleGameState } from "@/lib/game/engine";
import { normalizeWord } from "@/lib/game/engine";
import type { ClientGameState } from "@/lib/types";

export function getDisplaySegments(
  word: string,
  guessedLetters: ReadonlySet<string>,
  revealAll = false,
): string[][] {
  return word.split(" ").map((segment) =>
    [...segment].map((char) => (revealAll || guessedLetters.has(char) ? char : "")),
  );
}

export function toEngineState(game: Game, client: ClientGameState): MindleGameState {
  return {
    word: normalizeWord(game.word),
    hints: game.hints,
    lesson: game.lesson,
    guessedLetters: new Set(client.guessedLetters),
    wrongLetters: client.wrongLetters,
    revealedHintCount: client.revealedHintCount,
    attemptsRemaining: client.attemptsRemaining,
    phase: client.phase,
  };
}

export function toClientState(state: MindleGameState): ClientGameState {
  return {
    guessedLetters: [...state.guessedLetters],
    wrongLetters: state.wrongLetters,
    revealedHintCount: state.revealedHintCount,
    attemptsRemaining: state.attemptsRemaining,
    phase: state.phase,
  };
}

export function buildPlaySession(game: Game, engineState: MindleGameState) {
  const clientState = toClientState(engineState);
  const isComplete = engineState.phase !== "playing";

  return {
    gameId: game.id,
    hints: game.hints,
    reset_date: game.reset_date,
    segmentLengths: game.word.split(" ").map((segment) => segment.length),
    state: clientState,
    displaySegments: getDisplaySegments(
      game.word,
      engineState.guessedLetters,
      isComplete,
    ),
    word: isComplete ? engineState.word : undefined,
    lesson: isComplete ? engineState.lesson : undefined,
  };
}
