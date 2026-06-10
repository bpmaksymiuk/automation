export interface BoardConfig {
  rows: 9;
  cols: 9;
  mines: 10;
}

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  adjacentCount: number;
  revealed: boolean;
  flagged: boolean;
}

export interface GameState {
  board: Cell[][];
  status: GameStatus;
  flagMode: boolean;
  isFirstMove: boolean;
}
