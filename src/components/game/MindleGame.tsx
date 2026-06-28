"use client";

import { useState, type ReactNode } from "react";
import type { PublicPlaySession, GameResult } from "@/lib/types";
import { useMindleGame } from "@/lib/game/useMindleGame";
import { MAX_ATTEMPTS } from "@/lib/game/engine";
import { AttemptsCounter } from "@/components/game/AttemptsCounter";
import { GuessInput, LetterKeyboard } from "@/components/game/GuessControls";
import { HintButtons } from "@/components/game/HintButtons";
import { ReflectionScreen } from "@/components/game/ReflectionScreen";
import { ResultScreen } from "@/components/game/ResultScreen";
import { HowToPlayHelp } from "@/components/game/HowToPlayHelp";
import { WordDisplay } from "@/components/game/WordDisplay";

type MindleGameProps = {
  session: PublicPlaySession;
  playerId: string;
};

export function MindleGame({ session: initialSession, playerId }: MindleGameProps) {
  const { session, error, isPending, onGuessLetter, onGuessWord, onRevealHint } =
    useMindleGame(initialSession);

  const [showReflection, setShowReflection] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const isPlaying = session.state.phase === "playing";
  const isComplete = session.state.phase === "won" || session.state.phase === "lost";

  let content: ReactNode;

  if (isComplete && showReflection) {
    const result: GameResult = session.state.phase === "won" ? "win" : "lose";
    const attemptsUsed = MAX_ATTEMPTS - session.state.attemptsRemaining;

    content = (
      <ReflectionScreen
        playerId={playerId}
        gameId={session.gameId}
        result={result}
        attemptsUsed={attemptsUsed}
      />
    );
  } else if (isComplete && session.word && session.lesson) {
    content = (
      <ResultScreen
        phase={session.state.phase as "won" | "lost"}
        word={session.word}
        lesson={session.lesson}
        displaySegments={session.displaySegments}
        onContinue={() => setShowReflection(true)}
      />
    );
  } else {
    const guessedLetters = new Set(session.state.guessedLetters);

    content = (
      <div className="flex flex-col gap-10 pb-8">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <AttemptsCounter remaining={session.state.attemptsRemaining} />

      <div className={`py-4 transition-opacity ${isPending ? "opacity-60" : ""}`}>
        <WordDisplay segments={session.displaySegments} />
      </div>

      <HintButtons
        hints={session.hints}
        revealedCount={session.state.revealedHintCount}
        disabled={!isPlaying || isPending}
        onReveal={onRevealHint}
      />

      <p className="text-xs text-muted">Hints do not use attempts.</p>

      <div className="h-px bg-border" />

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted">Pick an alphabet</p>
        <LetterKeyboard
          guessedLetters={guessedLetters}
          wrongLetters={session.state.wrongLetters}
          disabled={!isPlaying || isPending}
          onGuess={onGuessLetter}
        />
      </div>

      <GuessInput disabled={!isPlaying || isPending} onGuess={onGuessWord} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <HowToPlayHelp
          open={showTutorial}
          onOpen={() => setShowTutorial(true)}
          onClose={() => setShowTutorial(false)}
        />
      </div>
      {content}
    </>
  );
}
