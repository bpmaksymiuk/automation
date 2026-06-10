import { useState } from 'react';
import { uiText } from '../../../content/uiText';
import { useShellActions, useShellState } from '../../../shell/ShellContext';
import WindowFrame from '../../windows/WindowFrame';
import { clearNotepad } from './notepadState';
import styles from './NotepadWindow.module.css';

interface NotepadWindowProps {
  windowId: string;
}

export default function NotepadWindow({ windowId }: NotepadWindowProps) {
  const { windows, viewportMode } = useShellState();
  const actions = useShellActions();
  const [state, setState] = useState({ content: '' });
  const windowRecord = windows.find((record) => record.windowId === windowId);

  if (!windowRecord) {
    return null;
  }

  return (
    <WindowFrame
      windowId={windowId}
      title={windowRecord.title}
      iconKey="icon_notepad"
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
          <button
            type="button"
            className="retroButton"
            onClick={() => setState((current) => clearNotepad(current))}
          >
            {uiText.notepad_clear_button_label}
          </button>
        </div>
        <textarea
          className={styles.editor}
          aria-label={uiText.notepad_editor_aria_label}
          value={state.content}
          onChange={(event) => setState({ content: event.target.value })}
          spellCheck={false}
        />
      </div>
    </WindowFrame>
  );
}
