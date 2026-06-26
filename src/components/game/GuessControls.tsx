"use client";

import { useState } from "react";
import { inputClassName } from "@/components/ui/form";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type LetterKeyboardProps = {
  guessedLetters: ReadonlySet<string>;
  wrongLetters: readonly string[];
  disabled: boolean;
  onGuess: (letter: string) => void;
};

export function LetterKeyboard({
  guessedLetters,
  wrongLetters,
  disabled,
  onGuess,
}: LetterKeyboardProps) {
  const wrongSet = new Set(wrongLetters);

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9 sm:gap-2">
      {ALPHABET.map((letter) => {
        const used = guessedLetters.has(letter);
        const wrong = wrongSet.has(letter);

        return (
          <button
            key={letter}
            type="button"
            disabled={disabled || used}
            onClick={() => onGuess(letter)}
            className={`rounded-xl border px-1 py-2.5 text-xs font-medium transition sm:text-sm ${
              wrong
                ? "border-border bg-background text-muted line-through opacity-50"
                : used
                  ? "border-accent/30 bg-accent-soft text-accent"
                  : "border-border bg-surface hover:border-accent/40 hover:bg-accent-soft/50"
            } disabled:cursor-not-allowed`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

type GuessInputProps = {
  disabled: boolean;
  onGuess: (word: string) => void;
};

export function GuessInput({ disabled, onGuess }: GuessInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onGuess(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-foreground">Guess the word</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type your answer…"
          className={`flex-1 ${inputClassName}`}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 sm:shrink-0"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
