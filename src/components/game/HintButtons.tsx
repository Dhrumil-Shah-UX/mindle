type HintButtonsProps = {
  hints: string[];
  revealedCount: number;
  disabled: boolean;
  onReveal: (hintIndex: number) => void;
};

export function HintButtons({ hints, revealedCount, disabled, onReveal }: HintButtonsProps) {
  if (hints.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">Need a nudge?</p>

      <div className="flex flex-wrap gap-2">
        {hints.map((_, index) => {
          const isRevealed = index < revealedCount;
          const isNext = index === revealedCount;
          const canReveal = !disabled && isNext;

          return (
            <button
              key={index}
              type="button"
              disabled={!canReveal}
              onClick={() => onReveal(index)}
              aria-pressed={isRevealed}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isRevealed
                  ? "border-accent/30 bg-accent-soft text-accent"
                  : canReveal
                    ? "border-border bg-surface hover:border-accent/40"
                    : "cursor-default border-border bg-background text-muted opacity-50"
              }`}
            >
              Hint {index + 1}
            </button>
          );
        })}
      </div>

      {revealedCount > 0 && (
        <ul className="space-y-3">
          {hints.slice(0, revealedCount).map((hint, index) => (
            <li
              key={index}
              className="rounded-2xl border border-border bg-background px-4 py-3.5 text-sm leading-relaxed text-foreground"
            >
              <span className="mr-2 font-mono text-xs text-accent">{index + 1}</span>
              {hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
