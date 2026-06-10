import type { BoardConfig, Cell, GameState } from './types';

export const BEGINNER_BOARD: BoardConfig = {
  rows: 9,
  cols: 9,
  mines: 10,
};

function createEmptyBoard(config: BoardConfig) {
  return Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      adjacentCount: 0,
      revealed: false,
      flagged: false,
    })),
  );
}

function forEachNeighbor(board: Cell[][], row: number, col: number, callback: (cell: Cell) => void) {
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      const neighbor = board[nextRow]?.[nextCol];
      if (neighbor) {
        callback(neighbor);
      }
    }
  }
}

function populateCounts(board: Cell[][]) {
  board.forEach((row) =>
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.adjacentCount = 0;
        return;
      }

      let adjacentCount = 0;
      forEachNeighbor(board, cell.row, cell.col, (neighbor) => {
        if (neighbor.isMine) {
          adjacentCount += 1;
        }
      });
      cell.adjacentCount = adjacentCount;
    }),
  );
}

function placeMines(board: Cell[][], config: BoardConfig) {
  let placed = 0;

  while (placed < config.mines) {
    const row = Math.floor(Math.random() * config.rows);
    const col = Math.floor(Math.random() * config.cols);
    if (board[row][col].isMine) {
      continue;
    }

    board[row][col].isMine = true;
    placed += 1;
  }
}

function cloneBoard(board: Cell[][]) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function relocateMine(board: Cell[][], row: number, col: number) {
  const nextBoard = cloneBoard(board);
  nextBoard[row][col].isMine = false;

  for (const boardRow of nextBoard) {
    for (const cell of boardRow) {
      if (!cell.isMine && !(cell.row === row && cell.col === col)) {
        cell.isMine = true;
        populateCounts(nextBoard);
        return nextBoard;
      }
    }
  }

  populateCounts(nextBoard);
  return nextBoard;
}

function revealFlood(board: Cell[][], startRow: number, startCol: number) {
  const queue: Cell[] = [board[startRow][startCol]];

  while (queue.length > 0) {
    const cell = queue.shift();
    if (!cell || cell.revealed || cell.flagged) {
      continue;
    }

    cell.revealed = true;
    if (cell.adjacentCount !== 0 || cell.isMine) {
      continue;
    }

    forEachNeighbor(board, cell.row, cell.col, (neighbor) => {
      if (!neighbor.revealed && !neighbor.flagged) {
        queue.push(neighbor);
      }
    });
  }
}

function hasWon(board: Cell[][]) {
  return board.every((row) => row.every((cell) => (cell.isMine ? true : cell.revealed)));
}

export function createGameState(): GameState {
  const board = createEmptyBoard(BEGINNER_BOARD);
  placeMines(board, BEGINNER_BOARD);
  populateCounts(board);

  return {
    board,
    status: 'ready',
    flagMode: false,
    isFirstMove: true,
  };
}

export function toggleFlagMode(state: GameState): GameState {
  return {
    ...state,
    flagMode: !state.flagMode,
  };
}

export function toggleFlag(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') {
    return state;
  }

  const board = cloneBoard(state.board);
  const cell = board[row][col];
  if (cell.revealed) {
    return state;
  }

  cell.flagged = !cell.flagged;
  return {
    ...state,
    board,
  };
}

export function revealCell(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') {
    return state;
  }

  let board = cloneBoard(state.board);
  const targetCell = board[row][col];

  if (targetCell.flagged || targetCell.revealed) {
    return state;
  }

  if (state.isFirstMove && targetCell.isMine) {
    board = relocateMine(board, row, col);
  }

  const nextTarget = board[row][col];
  if (nextTarget.isMine) {
    nextTarget.revealed = true;
    return {
      ...state,
      board,
      status: 'lost',
      isFirstMove: false,
    };
  }

  revealFlood(board, row, col);
  const won = hasWon(board);

  return {
    ...state,
    board,
    status: won ? 'won' : 'playing',
    isFirstMove: false,
  };
}

export function resetGame() {
  return createGameState();
}

export function getFlaggedCount(board: Cell[][]) {
  return board.flat().filter((cell) => cell.flagged).length;
}
