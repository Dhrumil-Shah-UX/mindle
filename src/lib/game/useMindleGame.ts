"use client";

import { useCallback, useState, useTransition } from "react";
import {
  submitHintReveal,
  submitLetterGuess,
  submitWordGuess,
} from "@/app/play/actions";
import type { PublicPlaySession } from "@/lib/types";

export function useMindleGame(initialSession: PublicPlaySession) {
  const [session, setSession] = useState(initialSession);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const applyResult = useCallback((result: Awaited<ReturnType<typeof submitLetterGuess>>) => {
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSession(result.session);
  }, []);

  const onGuessLetter = useCallback(
    (letter: string) => {
      startTransition(async () => {
        applyResult(
          await submitLetterGuess(session.gameId, session.state, session.signature, letter),
        );
      });
    },
    [applyResult, session],
  );

  const onGuessWord = useCallback(
    (word: string) => {
      startTransition(async () => {
        applyResult(
          await submitWordGuess(session.gameId, session.state, session.signature, word),
        );
      });
    },
    [applyResult, session],
  );

  const onRevealHint = useCallback(
    (hintIndex: number) => {
      startTransition(async () => {
        applyResult(
          await submitHintReveal(session.gameId, session.state, session.signature, hintIndex),
        );
      });
    },
    [applyResult, session],
  );

  return {
    session,
    error,
    isPending,
    onGuessLetter,
    onGuessWord,
    onRevealHint,
  };
}
