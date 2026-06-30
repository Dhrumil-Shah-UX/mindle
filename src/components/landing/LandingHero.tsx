import { Eyebrow, PageShell } from "@/components/ui/PageShell";
import { LandingActions } from "@/components/landing/LandingActions";

export function LandingHero() {
  return (
    <PageShell narrow className="justify-center">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-16 space-y-8">
          <Eyebrow>Designed Minds</Eyebrow>

          <div className="space-y-5">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Mindle
            </h1>
            <p className="max-w-sm text-lg leading-relaxed text-muted">
              A weekly UX puzzle to learn, build, and share.
            </p>
          </div>
        </div>

        <LandingActions />
      </div>
    </PageShell>
  );
}
