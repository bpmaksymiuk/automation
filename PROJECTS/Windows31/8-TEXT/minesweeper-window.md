# Minesweeper Window Copy Contract

## MinesweeperWindow

| Field key | Character limit | Final copy | Notes |
|---|---:|---|---|
| `minesweeper_window_title` | 24 | `Minesweeper` | Recognizable classic game title. |
| `minesweeper_restart_button_label` | 14 | `Restart` | Clear replay action after any outcome. |
| `minesweeper_flag_mode_label` | 14 | `Flag Mode` | Matches the approved DI wording and familiar play pattern. |
| `minesweeper_counter_aria_label` | 32 | `Mine counter` | Literal accessible name for the mines-remaining readout. |
| `minesweeper_status_ready_label` | 16 | `Ready` | Pre-game status label. |
| `minesweeper_status_won_label` | 16 | `Cleared` | Short win-state label that fits the retro UI. |
| `minesweeper_status_lost_label` | 16 | `Mine hit` | Direct loss-state label with light period flavor. |

## Tone Application

- Favor brisk game-state words that read quickly during play.
- Keep the status language playful only at the edges; clarity wins.
