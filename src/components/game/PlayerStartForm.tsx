"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClassName } from "@/components/ui/form";

type PlayerStartFormProps = {
  onStart: (name: string, email: string) => void;
  disabled?: boolean;
};

export function PlayerStartForm({ onStart, disabled = false }: PlayerStartFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Valid email is required.");
      return;
    }

    onStart(trimmedName, trimmedEmail);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-4">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.15em] text-muted uppercase">Before you play</p>
        <h2 className="text-2xl font-semibold tracking-tight">Enter your details</h2>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <label className="block space-y-3">
        <span className="text-base font-medium leading-snug">Name</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClassName}
          placeholder="Your name"
          disabled={disabled}
        />
      </label>

      <label className="block space-y-3">
        <span className="text-base font-medium leading-snug">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
          placeholder="you@example.com"
          disabled={disabled}
        />
      </label>

      <Button type="submit" fullWidth className="py-4" disabled={disabled}>
        {disabled ? "Starting…" : "Start Game"}
      </Button>
    </form>
  );
}
