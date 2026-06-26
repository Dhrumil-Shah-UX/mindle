import { LandingHero } from "@/components/landing/LandingHero";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function HomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <PageShell narrow>
        <h1 className="text-3xl font-semibold tracking-tight">Mindle</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Copy <code className="font-mono text-sm">.env.local.example</code> to{" "}
          <code className="font-mono text-sm">.env.local</code> and add your Supabase credentials.
        </p>
      </PageShell>
    );
  }

  return <LandingHero />;
}
