export interface UITextContract {
  boot_loading_label: string;
  boot_status_line: string;
  boot_skip_button_label: string;
  desktop_window_title: string;
  desktop_group_accessories_title: string;
  desktop_group_games_title: string;
  desktop_status_hint: string;
  launcher_notepad_label: string;
  launcher_paint_label: string;
  launcher_calculator_label: string;
  launcher_minesweeper_label: string;
  window_close_button_label: string;
  window_title_icon_button_label: string;
  notepad_window_title: string;
  notepad_clear_button_label: string;
  notepad_editor_aria_label: string;
  paint_window_title: string;
  paint_tool_pencil_label: string;
  paint_tool_eraser_label: string;
  paint_tool_clear_label: string;
  paint_palette_group_label: string;
  paint_canvas_aria_label: string;
  calculator_window_title: string;
  calculator_display_aria_label: string;
  minesweeper_window_title: string;
  minesweeper_restart_button_label: string;
  minesweeper_flag_mode_label: string;
  minesweeper_counter_aria_label: string;
  minesweeper_status_ready_label: string;
  minesweeper_status_won_label: string;
  minesweeper_status_lost_label: string;
  secret_window_title: string;
  secret_headline: string;
  secret_body: string;
  secret_dismiss_button_label: string;
}

export const uiText: UITextContract = {
  boot_loading_label: 'Starting Windows 3.1...',
  boot_status_line: 'Please wait while Program Manager wakes up.',
  boot_skip_button_label: 'Skip Boot',
  desktop_window_title: 'Program Manager',
  desktop_group_accessories_title: 'Accessories',
  desktop_group_games_title: 'Games',
  desktop_status_hint: 'Double-click to open. Tap once on touch screens.',
  launcher_notepad_label: 'Notepad',
  launcher_paint_label: 'Paint',
  launcher_calculator_label: 'Calculator',
  launcher_minesweeper_label: 'Minesweeper',
  window_close_button_label: 'Close',
  window_title_icon_button_label: 'Program Manager menu',
  notepad_window_title: 'Notepad',
  notepad_clear_button_label: 'Clear',
  notepad_editor_aria_label: 'Notepad document editor',
  paint_window_title: 'Paintbrush',
  paint_tool_pencil_label: 'Pencil',
  paint_tool_eraser_label: 'Eraser',
  paint_tool_clear_label: 'Clear',
  paint_palette_group_label: 'Colors',
  paint_canvas_aria_label: 'Paintbrush drawing canvas',
  calculator_window_title: 'Calculator',
  calculator_display_aria_label: 'Calculator display',
  minesweeper_window_title: 'Minesweeper',
  minesweeper_restart_button_label: 'Restart',
  minesweeper_flag_mode_label: 'Flag Mode',
  minesweeper_counter_aria_label: 'Mine counter',
  minesweeper_status_ready_label: 'Ready',
  minesweeper_status_won_label: 'Cleared',
  minesweeper_status_lost_label: 'Mine hit',
  secret_window_title: 'After Hours',
  secret_headline: 'You found the after-hours room.',
  secret_body:
    'The office lights are low, the icons are still awake, and Program Manager is letting you peek behind the curtain. Close this window to drift back to the desktop.',
  secret_dismiss_button_label: 'Back to Desktop',
};
