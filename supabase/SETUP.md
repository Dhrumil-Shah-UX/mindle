# Supabase setup for Mindle

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Pick an organization, name (e.g. `mindle`), database password, and region.
4. Wait for the project to finish provisioning (~2 minutes).

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Click **New query**.
3. Paste the full contents of `supabase/migrations/001_initial_schema.sql`.
4. Click **Run**.

You should see three tables under **Table Editor**:

| Table | Purpose |
|-------|---------|
| `games` | Weekly word, hints, lesson, reset date |
| `players` | Name + email (no auth) |
| `game_results` | Win/lose, attempts, reflections |

## 3. Get API credentials

1. Open **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Connect the Next.js app

From the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

Start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5. Verify seed data

In **Table Editor** → `games`, you should see one row:

- **word:** `AFFORDANCE`
- **hints:** 3 items
- **reset_date:** today's date (game is live immediately)

`players` and `game_results` each have one sample row linked to that game.

Then run `002_constraints.sql` for unique constraints on `reset_date`, email, and game results.

## Weekly reset (no cron)

Each row in `games` has a `reset_date` — the date that word goes live.

On every visit, `getActiveGame()` loads the **latest** game where:

```
reset_date <= today
```

Example schedule (admin creates future rows ahead of time):

| word | reset_date | live when today is… |
|------|------------|---------------------|
| AFFORDANCE | July 3 | July 3 – July 9 |
| HEURISTIC EVALUATION | July 10 | July 10 – July 16 |
| COGNITIVE LOAD | July 17 | July 17 onward |

No cron jobs. Changing `reset_date` in the database is the only switch.

## Schema overview

```
games
  id, word, hints[], lesson, reset_date, created_at

players
  id, name, email, created_at

game_results
  id, game_id → games, player_id → players,
  result ('win' | 'lose'), attempts_used,
  reflection_building, reflection_challenges, created_at
```

Only two foreign keys: `game_results.game_id` and `game_results.player_id`. No extra join tables.

## Resetting / re-seeding locally

To wipe and re-run (SQL Editor):

```sql
drop table if exists public.game_results cascade;
drop table if exists public.players cascade;
drop table if exists public.games cascade;
```

Then run `001_initial_schema.sql` again.

## Before production

Open RLS policies are fine for development. Before launch:

- Restrict `games` writes to admin only (service role or auth).
- Validate `players` / `game_results` inserts (rate limits, email format).
- Remove or replace sample seed rows.
