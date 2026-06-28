"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type HowToPlayHelpProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const STEPS = [
  "Guess the UX word — one letter at a time or the full word.",
  "You have 13 attempts. A wrong letter or wrong full-word guess uses one attempt.",
  "Pick a letter from the keyboard, or type the full word and submit.",
  "Reveal hints if you need help — hints do not use attempts.",
  "After you finish, complete the short reflection to connect the word to your work.",
];

export function HowToPlayHelp({ open, onOpen, onClose }: HowToPlayHelpProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="text-sm text-muted transition hover:text-foreground"
      >
        How to Play
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="presentation"
          onClick={onClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-play-title"
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-[0.15em] text-muted uppercase">
                  Tutorial
                </p>
                <h2 id="how-to-play-title" className="text-2xl font-semibold tracking-tight">
                  How to Play
                </h2>
              </div>

              <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed text-foreground">
                {STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

              <Button type="button" fullWidth variant="secondary" onClick={onClose}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
