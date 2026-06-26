"use client";

import { useState, useTransition } from "react";
import type { GameFormInput } from "@/app/admin/actions";
import { createGame, updateGame } from "@/app/admin/actions";
import type { Game } from "@/lib/types";
import { inputClassName, labelClassName } from "@/components/admin/utils";

type GameFormProps = {
  editingGame: Game | null;
  adminPassword: string;
  onCancelEdit: () => void;
  onSaved: () => void;
};

const emptyForm: GameFormInput = {
  word: "",
  reset_date: "",
  hint1: "",
  hint2: "",
  hint3: "",
  lesson: "",
};

function gameToForm(game: Game): GameFormInput {
  return {
    word: game.word,
    reset_date: game.reset_date,
    hint1: game.hints[0] ?? "",
    hint2: game.hints[1] ?? "",
    hint3: game.hints[2] ?? "",
    lesson: game.lesson,
  };
}

export function GameForm({ editingGame, adminPassword, onCancelEdit, onSaved }: GameFormProps) {
  const [form, setForm] = useState<GameFormInput>(
    editingGame ? gameToForm(editingGame) : emptyForm,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(editingGame);

  function updateField<K extends keyof GameFormInput>(key: K, value: GameFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = isEditing
        ? await updateGame(editingGame!.id, form, adminPassword)
        : await createGame(form, adminPassword);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!isEditing) {
        setForm(emptyForm);
      }
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">{isEditing ? "Edit game" : "Create new game"}</h2>
        {!isEditing && (
          <p className="mt-1 text-sm text-muted">Schedule a UX word for a future reset date.</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>
      )}

      <label className="block space-y-2">
        <span className={labelClassName}>UX Word</span>
        <input
          type="text"
          value={form.word}
          onChange={(e) => updateField("word", e.target.value)}
          className={inputClassName}
          placeholder="Affordance"
        />
      </label>

      <label className="block space-y-2">
        <span className={labelClassName}>Reset Date</span>
        <input
          type="date"
          value={form.reset_date}
          onChange={(e) => updateField("reset_date", e.target.value)}
          className={inputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={labelClassName}>Hint 1</span>
        <input
          type="text"
          value={form.hint1}
          onChange={(e) => updateField("hint1", e.target.value)}
          className={inputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={labelClassName}>Hint 2</span>
        <input
          type="text"
          value={form.hint2}
          onChange={(e) => updateField("hint2", e.target.value)}
          className={inputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={labelClassName}>Hint 3</span>
        <input
          type="text"
          value={form.hint3}
          onChange={(e) => updateField("hint3", e.target.value)}
          className={inputClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className={labelClassName}>Lesson</span>
        <textarea
          value={form.lesson}
          onChange={(e) => updateField("lesson", e.target.value)}
          rows={4}
          className={inputClassName}
        />
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEditing ? "Save changes" : "Schedule Game"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-background"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
