import { useMemo, useState } from 'react';
import { assetManifest } from '../../../assets/assetManifest';
import { uiText } from '../../../content/uiText';
import { useShellActions, useShellState } from '../../../shell/ShellContext';
import { getAssetUrl } from '../../../utils/assetPaths';
import WindowFrame from '../../windows/WindowFrame';
import {
  BEGINNER_BOARD,
  createGameState,
  getFlaggedCount,
  resetGame,
  revealCell,
  toggleFlag,
  toggleFlagMode,
} from './engine';
import styles from './MinesweeperWindow.module.css';

interface MinesweeperWindowProps {
  windowId: string;
}

export default function MinesweeperWindow({ windowId }: MinesweeperWindowProps) {
  const { windows, viewportMode } = useShellState();
  const actions = useShellActions();
  const [game, setGame] = useState(createGameState);
  const [restartIconAvailable, setRestartIconAvailable] = useState(true);
  const windowRecord = windows.find((record) => record.windowId === windowId);

  const flaggedCount = useMemo(() => getFlaggedCount(game.board), [game.board]);
  const counter = BEGINNER_BOARD.mines - flaggedCount;

  if (!windowRecord) {
    return null;
  }

  const statusLabel =
    game.status === 'won'
      ? uiText.minesweeper_status_won_label
      : game.status === 'lost'
        ? uiText.minesweeper_status_lost_label
        : uiText.minesweeper_status_ready_label;

  return (
    <WindowFrame
      windowId={windowId}
      title={windowRecord.title}
      iconKey="icon_minesweeper"
      zIndex={windowRecord.zIndex}
      position={windowRecord.position}
      size={windowRecord.size}
      viewportMode={viewportMode}
      isFocused={windowRecord.isFocused}
      isMaximized={windowRecord.isMaximized}
      onFocus={() => actions.focusWindow(windowId)}
      onClose={() => actions.closeWindow(windowId)}
      onMove={(position) =>
        actions.moveWindow(windowId, position, { width: window.innerWidth, height: window.innerHeight })
      }
    >
      <div className={styles.layout}>
        <div className={styles.toolbar}>
          <div className={styles.counter} aria-label={uiText.minesweeper_counter_aria_label}>
            {counter}
          </div>
          <button type="button" className={`retroButton ${styles.toolbarButton}`} onClick={() => setGame(resetGame())}>
            {restartIconAvailable ? (
              <img
                className={styles.restartIcon}
                src={getAssetUrl(assetManifest.minesweeper_restart_icon)}
                alt=""
                onError={() => setRestartIconAvailable(false)}
              />
            ) : null}
            {uiText.minesweeper_restart_button_label}
          </button>
          <button
            type="button"
            className={`retroButton ${styles.toolbarButton}`}
            aria-pressed={game.flagMode}
            onClick={() => setGame((current) => toggleFlagMode(current))}
          >
            {uiText.minesweeper_flag_mode_label}
          </button>
          <div className={styles.status}>{statusLabel}</div>
        </div>

        <div className={styles.grid} role="grid" aria-label={uiText.minesweeper_window_title}>
          {game.board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.row} role="row">
              {row.map((cell) => (
                <button
                  key={`${cell.row}-${cell.col}`}
                  type="button"
                  role="gridcell"
                  className={`${styles.cell} ${cell.revealed ? styles.cellRevealed : ''}`}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setGame((current) => toggleFlag(current, cell.row, cell.col));
                  }}
                  onClick={() =>
                    setGame((current) =>
                      current.flagMode
                        ? toggleFlag(current, cell.row, cell.col)
                        : revealCell(current, cell.row, cell.col),
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === ' ') {
                      event.preventDefault();
                      setGame((current) =>
                        current.flagMode
                          ? toggleFlag(current, cell.row, cell.col)
                          : revealCell(current, cell.row, cell.col),
                      );
                    }
                  }}
                >
                  {cell.flagged && !cell.revealed ? '⚑' : null}
                  {cell.revealed ? (cell.isMine ? '✹' : cell.adjacentCount || '') : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}
