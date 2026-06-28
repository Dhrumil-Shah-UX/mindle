# Mindle — chat handoff (paste into new Cursor chat)

## What this is
**Mindle** — weekly UX vocabulary guessing game for **Designed Minds**. ~2 min: guess word, hints, lesson, reflection. No auth, leaderboards, or notifications.

**Live:** https://mindle-xi.vercel.app/  
**Repo:** https://github.com/Dhrumil-Shah-UX/mindle  
**Supabase project ref:** `ievtbieujrzljquhhris` → URL `https://ievtbieujrzljquhhris.supabase.co`

---

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind 4 · Supabase (Postgres) · `@supabase/supabase-js` only

---

## Routes
| Route | Purpose |
|-------|---------|
| `/` | Landing — tagline + **Play** |
| `/play` | Game → result → reflection (client phases) |
| `/admin` | Schedule/edit/delete games (password gate) |

---

## Database (3 tables)
Run in Supabase SQL Editor (in order):
1. `supabase/migrations/001_initial_schema.sql` — tables + RLS + AFFORDANCE seed
2. `supabase/migrations/002_constraints.sql` — unique constraints

**Tables:** `games`, `players`, `game_results`  
**Active game logic:** `getActiveGame()` — latest row where `reset_date <= today` (UTC on Vercel).

**Schema not wired yet:** `players` / `game_results` exist but app does **not** persist reflections or win/lose (reflection is UI-only).

---

## Env vars (Vercel + `.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://ievtbieujrzljquhhris.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase API settings>
ADMIN_SECRET=<your password — required in production for /play + /admin>
```
Optional: `GAME_STATE_SECRET` (falls back to `ADMIN_SECRET`).  
Centralized in `src/lib/env.ts`.

---

## Game rules (implemented in `src/lib/game/engine.ts`)
- 13 attempts; wrong letter or wrong full word = −1 attempt
- Win: correct full word OR all letters guessed
- Hints: 3 sequential buttons; no attempt cost
- Multi-word answers supported (spaces ignored for letter wins)

**Security:** Answer **not** sent to client during play. Guesses go through server actions (`src/app/play/actions.ts`) with HMAC-signed session state (`src/lib/game/session.ts`).

---

## Admin
- Gate when `ADMIN_SECRET` set: password form on `/admin` (no cookies — password kept in client memory for session; re-enter on refresh)
- Server actions require same password: `src/app/admin/actions.ts`
- CRUD fields: word, reset_date, hint1–3, lesson

---

## Key files
```
src/app/page.tsx              landing
src/app/play/page.tsx         game page (loads getActiveGame + createPlaySession)
src/app/play/actions.ts       server actions: letter/word/hint guesses
src/app/admin/                admin pages + actions
src/lib/game/engine.ts        pure game logic
src/lib/game/getActiveGame.ts date selection helpers
src/lib/supabase/create-client.ts
src/components/game/MindleGame.tsx   playing → result → reflection
```

---

## Deployment status
- **Vercel:** deployed, build passes, game working (AFFORDANCE live, seed `reset_date = current_date`)
- **GitHub:** pushed to `Dhrumil-Shah-UX/mindle` on `main`
- **Tested:** `/`, `/play`, `/admin` return 200; answer not in page source; admin gated

---

## Known limitations / not built
- Reflection not saved to DB
- Win/lose not written to `game_results`
- Open Supabase RLS (public read/write) — tighten before wider launch
- No NextAuth / OAuth
- Admin password in client memory (simple gate, not full auth)
- `players` table unused

---

## Sensible next steps (if continuing)
1. Persist reflections + results to Supabase (`players` + `game_results`)
2. Tighten RLS; use service role for admin writes only
3. Schedule next weeks’ words via `/admin`
4. Optional: keyboard letter input, localStorage for in-progress game on refresh

---

## Conventions from this build
Keep architecture simple. No new libraries unless necessary. Game logic stays in `engine.ts`; UI in `components/game/` and `components/admin/`.
