"use client";

import { useState, useTransition } from "react";
import { saveGameResult } from "@/app/play/actions";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { inputClassName } from "@/components/ui/form";
import type { GameResult } from "@/lib/types";

type ReflectionScreenProps = {
  playerId: string;
  gameId: string;
  result: GameResult;
  attemptsUsed: number;
};

export function ReflectionScreen({
  playerId,
  gameId,
  result,
  attemptsUsed,
}: ReflectionScreenProps) {
  const [reflectionBuilding, setReflectionBuilding] = useState("");
  const [reflectionChallenges, setReflectionChallenges] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const building = reflectionBuilding.trim();
    const challenges = reflectionChallenges.trim();
    if (!building && !challenges) {
      setError("Add at least one reflection before continuing.");
      return;
    }

    startTransition(async () => {
      const saveResult = await saveGameResult({
        gameId,
        playerId,
        result,
        attemptsUsed,
        reflectionBuilding: building,
        reflectionChallenges: challenges,
      });

      if (!saveResult.ok) {
        setError(saveResult.error);
        return;
      }

      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-8 py-4 text-center">
        <div className="space-y-3">
          <p className="text-2xl font-semibold tracking-tight">Thanks for reflecting</p>
          <p className="text-sm leading-relaxed text-muted">
            See you next week for a new UX puzzle.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium transition hover:bg-background"
        >
          Back home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-4">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.15em] text-muted uppercase">Reflection</p>
        <h2 className="text-2xl font-semibold tracking-tight">Connect it to your work</h2>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <label className="block space-y-3">
        <span className="text-base font-medium leading-snug">
          What are you building this week?
        </span>
        <textarea
          value={reflectionBuilding}
          onChange={(event) => setReflectionBuilding(event.target.value)}
          rows={4}
          className={inputClassName}
          placeholder="A feature, flow, prototype, or product…"
          disabled={isPending}
        />
      </label>

      <label className="block space-y-3">
        <span className="text-base font-medium leading-snug">
          What challenges are you facing?
        </span>
        <textarea
          value={reflectionChallenges}
          onChange={(event) => setReflectionChallenges(event.target.value)}
          rows={4}
          className={inputClassName}
          placeholder="Friction, trade-offs, open questions…"
          disabled={isPending}
        />
      </label>

      <Button type="submit" fullWidth className="py-4" disabled={isPending}>
        {isPending ? "Saving…" : "Done"}
      </Button>
    </form>
  );
}
