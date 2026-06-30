-- Denormalize player name and game word on game_results for easier reporting.

alter table public.game_results
  add column player_name text,
  add column game_word text;

update public.game_results gr
set
  player_name = p.name,
  game_word = g.word
from public.players p,
     public.games g
where gr.player_id = p.id
  and gr.game_id = g.id;

alter table public.game_results
  add constraint game_results_player_name_not_empty
  check (player_name is null or char_length(trim(player_name)) > 0);

alter table public.game_results
  add constraint game_results_game_word_not_empty
  check (game_word is null or char_length(trim(game_word)) > 0);
