"use client";

import { useState, useTransition } from "react";
import { createPlaySessionByGameId, registerPlayer } from "@/app/play/actions";
import type { PublicPlaySession } from "@/lib/types";
import { MindleGame } from "@/components/game/MindleGame";
import { PlayerStartForm } from "@/components/game/PlayerStartForm";

type PlayGateProps = {
  gameId: string;
};

export function PlayGate({ gameId }: PlayGateProps) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [session, setSession] = useState<PublicPlaySession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStart(name: string, email: string) {
    setError(null);
    startTransition(async () => {
      const playerResult = await registerPlayer(name, email);
      if (!playerResult.ok) {
        setError(playerResult.error);
        return;
      }

      try {
        const playSession = await createPlaySessionByGameId(gameId);
        setPlayerId(playerResult.playerId);
        setSession(playSession);
      } catch {
        setError("Could not start the game. Try again.");
      }
    });
  }

  if (!session || !playerId) {
    return (
      <>
        {error && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}
        <PlayerStartForm onStart={handleStart} disabled={isPending} />
      </>
    );
  }

  return <MindleGame session={session} playerId={playerId} />;
}
