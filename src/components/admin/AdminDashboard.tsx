"use client";

import { useState } from "react";
import { GameForm } from "@/components/admin/GameForm";
import { ScheduledGamesList } from "@/components/admin/ScheduledGamesList";
import type { Game } from "@/lib/types";

type AdminDashboardProps = {
  games: Game[];
  adminPassword: string;
  isPending?: boolean;
};

export function AdminDashboard({ games, adminPassword, isPending = false }: AdminDashboardProps) {
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const sortedGames = [...games].sort((a, b) => a.reset_date.localeCompare(b.reset_date));

  return (
    <div className="space-y-8">
      <GameForm
        key={editingGame?.id ?? "new"}
        editingGame={editingGame}
        adminPassword={adminPassword}
        onCancelEdit={() => setEditingGame(null)}
        onSaved={() => setEditingGame(null)}
      />
      <ScheduledGamesList
        games={sortedGames}
        adminPassword={adminPassword}
        disabled={isPending}
        onEdit={setEditingGame}
      />
    </div>
  );
}
