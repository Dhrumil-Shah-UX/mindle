import type { GamePhase } from "@/lib/types";
import { WordDisplay } from "@/components/game/WordDisplay";
import { LessonCard } from "@/components/game/LessonCard";
import { Button } from "@/components/ui/Button";

type ResultScreenProps = {
  phase: Exclude<GamePhase, "playing">;
  word: string;
  lesson: string;
  displaySegments: string[][];
  onContinue: () => void;
};

export function ResultScreen({
  phase,
  word,
  lesson,
  displaySegments,
  onContinue,
}: ResultScreenProps) {
  const won = phase === "won";

  return (
    <div className="flex flex-col gap-10 py-4">
      <div className="space-y-6 text-center">
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {won ? "🎉 You solved it" : "Try again next week"}
        </p>
        {!won && (
          <p className="text-sm text-muted">
            The answer is below — take a minute to read the lesson.
          </p>
        )}
        <WordDisplay segments={displaySegments} />
      </div>

      <LessonCard word={word} lesson={lesson} />

      <Button fullWidth onClick={onContinue} className="py-4">
        Reflect on your work
      </Button>
    </div>
  );
}
