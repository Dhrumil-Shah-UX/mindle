"use client";

import { useState, useTransition } from "react";
import { deleteGame } from "@/app/admin/actions";
import { formatResetDate } from "@/components/admin/utils";
import type { Game } from "@/lib/types";

type ScheduledGamesListProps = {
  games: Game[];
  adminPassword: string;
  disabled?: boolean;
  onEdit: (game: Game) => void;
};

export function ScheduledGamesList({
  games,
  adminPassword,
  disabled = false,
  onEdit,
}: ScheduledGamesListProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(game: Game) {
    const label = `${formatResetDate(game.reset_date, game.reset_timezone)} — ${game.word}`;
    if (!window.confirm(`Delete "${label}"?`)) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteGame(game.id, adminPassword);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  if (games.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-surface p-6">
        <p className="text-sm text-muted">No games scheduled yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Scheduled games</h2>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <ul className="mt-4 divide-y divide-border">
        {games.map((game) => (
          <li key={game.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="font-medium text-foreground">
                {formatResetDate(game.reset_date, game.reset_timezone)}
              </p>
              <p className="mt-1 font-mono text-sm tracking-wide text-muted">{game.word}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onEdit(game)}
                disabled={isPending || disabled}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition hover:bg-background disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(game)}
                disabled={isPending || disabled}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
