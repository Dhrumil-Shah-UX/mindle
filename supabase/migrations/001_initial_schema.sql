-- Mindle — minimal schema (games, players, game_results)

create table public.games (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  hints text[] not null default '{}',
  lesson text not null,
  reset_date date not null,
  created_at timestamptz not null default now(),

  constraint games_word_not_empty check (char_length(trim(word)) > 0),
  constraint games_lesson_not_empty check (char_length(trim(lesson)) > 0)
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),

  constraint players_name_not_empty check (char_length(trim(name)) > 0),
  constraint players_email_not_empty check (char_length(trim(email)) > 0)
);

create table public.game_results (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  result text not null,
  attempts_used integer not null default 0,
  reflection_building text,
  reflection_challenges text,
  created_at timestamptz not null default now(),

  constraint game_results_result_check check (result in ('win', 'lose')),
  constraint game_results_attempts_used_check check (attempts_used >= 0)
);

create index games_reset_date_idx on public.games (reset_date desc);
create index game_results_game_id_idx on public.game_results (game_id);
create index game_results_player_id_idx on public.game_results (player_id);

-- MVP: open access (no auth). Tighten before production.
alter table public.games enable row level security;
alter table public.players enable row level security;
alter table public.game_results enable row level security;

create policy "Public read games" on public.games for select using (true);
create policy "Public insert games" on public.games for insert with check (true);
create policy "Public update games" on public.games for update using (true);
create policy "Public delete games" on public.games for delete using (true);

create policy "Public read players" on public.players for select using (true);
create policy "Public insert players" on public.players for insert with check (true);
create policy "Public update players" on public.players for update using (true);
create policy "Public delete players" on public.players for delete using (true);

create policy "Public read game_results" on public.game_results for select using (true);
create policy "Public insert game_results" on public.game_results for insert with check (true);
create policy "Public update game_results" on public.game_results for update using (true);
create policy "Public delete game_results" on public.game_results for delete using (true);

-- Seed: AFFORDANCE (live now — reset_date <= today)
-- Add future games with later reset_dates; getActiveGame picks the latest eligible one.
insert into public.games (word, hints, lesson, reset_date)
values (
  'AFFORDANCE',
  array[
    'Coined by cognitive psychologist James Gibson, popularized in UX by Don Norman.',
    'Often paired with the idea of signifiers in interface design.',
    'A raised door handle suggests you should pull; a flat plate suggests push.'
  ],
  'Affordance is the perceived possibility for action — what an object or interface suggests you can do with it. In UX, we design affordances (and signifiers that communicate them) so users understand how to interact without instructions.',
  current_date
);

insert into public.players (name, email)
values ('Sample Player', 'player@designedminds.example');

insert into public.game_results (game_id, player_id, result, attempts_used, reflection_building, reflection_challenges)
select
  g.id,
  p.id,
  'win',
  3,
  'I am building a checkout flow — button styling should afford clicking clearly.',
  'Balancing minimal UI with obvious affordances on mobile.'
from public.games g
cross join public.players p
where g.word = 'AFFORDANCE'
  and p.email = 'player@designedminds.example'
limit 1;
