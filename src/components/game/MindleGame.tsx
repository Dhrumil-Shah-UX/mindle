"use client";

import { useState } from "react";
import type { PublicPlaySession } from "@/lib/types";
import { useMindleGame } from "@/lib/game/useMindleGame";
import { AttemptsCounter } from "@/components/game/AttemptsCounter";
import { GuessInput, LetterKeyboard } from "@/components/game/GuessControls";
import { HintButtons } from "@/components/game/HintButtons";
import { ReflectionScreen } from "@/components/game/ReflectionScreen";
import { ResultScreen } from "@/components/game/ResultScreen";
import { WordDisplay } from "@/components/game/WordDisplay";

type MindleGameProps = {
  session: PublicPlaySession;
};

export function MindleGame({ session: initialSession }: MindleGameProps) {
  const { session, error, isPending, onGuessLetter, onGuessWord, onRevealHint } =
    useMindleGame(initialSession);

  const [showReflection, setShowReflection] = useState(false);
  const isPlaying = session.state.phase === "playing";
  const isComplete = session.state.phase === "won" || session.state.phase === "lost";

  if (isComplete && showReflection) {
    return <ReflectionScreen />;
  }

  if (isComplete && session.word && session.lesson) {
    return (
      <ResultScreen
        phase={session.state.phase as "won" | "lost"}
        word={session.word}
        lesson={session.lesson}
        displaySegments={session.displaySegments}
        onContinue={() => setShowReflection(true)}
      />
    );
  }

  const guessedLetters = new Set(session.state.guessedLetters);

  return (
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
        <p className="text-sm font-medium text-muted">Or pick a letter</p>
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
