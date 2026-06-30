-- Letters revealed when a game starts (e.g. {"A","F","E"}).

alter table public.games
  add column prefilled_letters text[] not null default '{}';
