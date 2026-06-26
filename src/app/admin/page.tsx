import Link from "next/link";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminProtected } from "@/components/admin/AdminProtected";
import { Eyebrow, PageShell } from "@/components/ui/PageShell";
import { adminSecretRequired } from "@/lib/admin/auth";
import { fetchAllGames, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <PageShell>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-4 text-muted">Configure Supabase in .env.local.</p>
      </PageShell>
    );
  }

  if (adminSecretRequired()) {
    return <AdminProtected />;
  }

  const games = await fetchAllGames();

  return (
    <PageShell>
      <header className="mb-10 flex items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Schedule games</h1>
          <p className="mt-1 text-sm text-muted">Manage weekly UX words</p>
        </div>
        <Link href="/" className="text-sm font-medium text-accent underline">
          ← Home
        </Link>
      </header>

      <AdminDashboard games={games} adminPassword="" />
    </PageShell>
  );
}
