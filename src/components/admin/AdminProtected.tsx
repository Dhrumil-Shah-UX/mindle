"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { fetchAdminGames } from "@/app/admin/auth-actions";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Eyebrow, PageShell } from "@/components/ui/PageShell";
import type { Game } from "@/lib/types";

export function AdminProtected() {
  const [password, setPassword] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUnlock(unlockedPassword: string) {
    setError(null);
    startTransition(async () => {
      const data = await fetchAdminGames(unlockedPassword);
      if (!data) {
        setError("Could not load admin data.");
        return;
      }
      setPassword(unlockedPassword);
      setGames(data);
    });
  }

  if (!password) {
    return (
      <PageShell narrow className="justify-center">
        <AdminLogin onUnlock={handleUnlock} />
        {error && <p className="mt-4 text-center text-sm text-red-700">{error}</p>}
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className="mb-10 flex items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Schedule games</h1>
          <p className="mt-1 text-sm text-muted">Manage weekly UX words</p>
        </div>
        <Link href="/" className="text-sm font-medium text-accent underline">
          ← Home
        </Link>
      </header>

      <AdminDashboard games={games} adminPassword={password} isPending={isPending} />
    </PageShell>
  );
}
