import { MAX_ATTEMPTS } from "@/lib/game/engine";

type AttemptsCounterProps = {
  remaining: number;
};

export function AttemptsCounter({ remaining }: AttemptsCounterProps) {
  const used = MAX_ATTEMPTS - remaining;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-4 py-3">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Attempts</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          {remaining} left
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-1.5">
        {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < used ? "bg-foreground/20" : "bg-accent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
