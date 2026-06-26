type LessonCardProps = {
  word: string;
  lesson: string;
};

export function LessonCard({ word, lesson }: LessonCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-xs font-medium tracking-[0.15em] text-accent uppercase">UX lesson</p>
      <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight sm:text-3xl">{word}</h2>
      <p className="mt-5 text-base leading-relaxed text-muted">{lesson}</p>
    </section>
  );
}
