# Mindle

A weekly UX vocabulary guessing game for the [Designed Minds](https://) design community.

Spend ~2 minutes guessing a UX term, reveal hints, learn the concept, and reflect on what you're building.

## Stack

- **Next.js** (App Router) — pages and server data fetching
- **TypeScript** — shared types for game + admin
- **Tailwind CSS** — styling without a component library
- **Supabase** — Postgres (`games`, `players`, `game_results`)

## Setup

Full Supabase instructions: **[supabase/SETUP.md](supabase/SETUP.md)**

Quick start:

1. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` in the SQL Editor.
2. Copy `.env.local.example` → `.env.local` and add your project URL + anon key.
3. `npm install` → `npm run dev` → [http://localhost:3000](http://localhost:3000)

## Folder structure

```
src/
  app/              # Routes (game home, admin)
  components/
    game/           # Player-facing UI
    admin/          # Word management UI
  lib/
    supabase/       # Client + server helpers
    types.ts        # Shared TypeScript types
supabase/
  migrations/       # SQL schema (source of truth for DB)
```

## Notes

- No authentication in v1 — admin is open; add `ADMIN_SECRET` or Supabase RLS before production.
- Game state (guesses, hints revealed) lives in the browser only — no user accounts needed.
