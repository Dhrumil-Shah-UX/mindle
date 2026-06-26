-- Reliability constraints for Mindle

alter table public.games
  add constraint games_reset_date_unique unique (reset_date);

alter table public.players
  add constraint players_email_unique unique (email);

alter table public.game_results
  add constraint game_results_game_player_unique unique (game_id, player_id);
