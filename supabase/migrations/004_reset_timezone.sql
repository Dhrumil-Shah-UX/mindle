-- Store IANA timezone for scheduled reset (e.g. America/New_York).

alter table public.games
  add column reset_timezone text not null default 'UTC';

alter table public.games
  add constraint games_reset_timezone_not_empty
  check (char_length(trim(reset_timezone)) > 0);
