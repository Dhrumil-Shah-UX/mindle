-- Store reset_date as date + time (timestamptz). Column name unchanged.

alter table public.games
  drop constraint if exists games_reset_date_unique;

alter table public.games
  alter column reset_date type timestamptz
  using (reset_date::timestamp at time zone 'UTC');

alter table public.games
  add constraint games_reset_date_unique unique (reset_date);
