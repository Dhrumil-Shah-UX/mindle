"use client";

import { useState, useTransition } from "react";
import type { GameFormInput } from "@/app/admin/actions";
import { createGame, updateGame } from "@/app/admin/actions";
import { splitResetDateTime } from "@/lib/game/resetDateTime";
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
  reset_time: "10:00",
  reset_timezone: "America/New_York",
  prefilled_letters: "",
  hint1: "",
  hint2: "",
  hint3: "",
  lesson: "",
};

function getInitialForm(editingGame: Game | null): GameFormInput {
  if (editingGame) return gameToForm(editingGame);

  const timezone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : emptyForm.reset_timezone;

  return { ...emptyForm, reset_timezone: timezone };
}

function gameToForm(game: Game): GameFormInput {
  const split = splitResetDateTime(game.reset_date, game.reset_timezone);
  return {
    word: game.word,
    reset_date: split?.date ?? "",
    reset_time: split?.time ?? "",
    reset_timezone: game.reset_timezone,
    prefilled_letters: game.prefilled_letters.join(", "),
    hint1: game.hints[0] ?? "",
    hint2: game.hints[1] ?? "",
    hint3: game.hints[2] ?? "",
    lesson: game.lesson,
  };
}

export function GameForm({ editingGame, adminPassword, onCancelEdit, onSaved }: GameFormProps) {
  const [form, setForm] = useState<GameFormInput>(() => getInitialForm(editingGame));
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
        setForm(getInitialForm(null));
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
        <span className={labelClassName}>Prefilled Letters</span>
        <input
          type="text"
          value={form.prefilled_letters}
          onChange={(e) => updateField("prefilled_letters", e.target.value)}
          className={inputClassName}
          placeholder="A, F, E"
        />
        <p className="text-xs text-muted">
          Letters revealed at the start. Separate with commas. Only letters in the word are saved.
        </p>
      </label>

      <fieldset className="space-y-4">
        <legend className={labelClassName}>Reset Time</legend>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Date</span>
          <input
            type="date"
            value={form.reset_date}
            onChange={(e) => updateField("reset_date", e.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Time</span>
          <input
            type="time"
            value={form.reset_time}
            onChange={(e) => updateField("reset_time", e.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Timezone</span>
          <input
            type="text"
            value={form.reset_timezone}
            onChange={(e) => updateField("reset_timezone", e.target.value)}
            className={inputClassName}
            placeholder="America/New_York"
          />
        </label>
      </fieldset>

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
