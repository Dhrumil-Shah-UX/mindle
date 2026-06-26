"use client";

import { useState, useTransition } from "react";
import { checkAdminPassword } from "@/app/admin/auth-actions";
import { Button } from "@/components/ui/Button";
import { inputClassName } from "@/components/ui/form";

type AdminLoginProps = {
  onUnlock: (password: string) => void;
};

export function AdminLogin({ onUnlock }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await checkAdminPassword(password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onUnlock(password);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">Admin access</h2>
        <p className="mt-1 text-sm text-muted">Enter the admin password to continue.</p>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className={inputClassName}
        placeholder="Password"
        autoComplete="current-password"
      />

      <Button type="submit" fullWidth disabled={isPending || !password}>
        {isPending ? "Checking…" : "Continue"}
      </Button>
    </form>
  );
}
