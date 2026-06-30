import Link from "next/link";
import { PlayGate } from "@/components/game/PlayGate";
import { LinkButton } from "@/components/ui/Button";
import { Eyebrow, PageShell } from "@/components/ui/PageShell";
import { getActiveGame, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatResetDate } from "@/components/admin/utils";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  if (!isSupabaseConfigured()) {
    return (
      <PageShell narrow>
        <p className="text-muted">Configure Supabase to play.</p>
      </PageShell>
    );
  }

  let game;
  try {
    game = await getActiveGame();
  } catch {
    return (
      <PageShell narrow className="justify-center text-center">
        <p className="text-lg text-muted">Could not load this week&apos;s puzzle.</p>
        <p className="mt-2 text-sm text-muted">Check your connection and try again.</p>
        <Link href="/" className="mt-6 text-sm font-medium text-accent underline">
          ← Back home
        </Link>
      </PageShell>
    );
  }

  if (!game) {
    return (
      <PageShell narrow className="justify-center text-center">
        <p className="text-lg text-muted">No puzzle live this week.</p>
        <Link href="/" className="mt-6 text-sm font-medium text-accent underline">
          ← Back home
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell narrow>
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <Eyebrow>This week</Eyebrow>
          <p className="mt-2 text-sm text-muted">
            Live since {formatResetDate(game.reset_date, game.reset_timezone)}
          </p>
        </div>
        <LinkButton href="/" variant="secondary" className="shrink-0 py-2">
          Exit
        </LinkButton>
      </header>

      <PlayGate gameId={game.id} />
    </PageShell>
  );
}
