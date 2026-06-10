import { useState } from 'react';
import { assetManifest } from '../../../assets/assetManifest';
import { uiText } from '../../../content/uiText';
import { useShellActions, useShellState } from '../../../shell/ShellContext';
import { getAssetUrl } from '../../../utils/assetPaths';
import WindowFrame from '../../windows/WindowFrame';
import PaintCanvas from './PaintCanvas';
import { DEFAULT_PAINT_STATE, type PaintTool } from './paintTypes';
import styles from './PaintWindow.module.css';

interface PaintWindowProps {
  windowId: string;
}

export default function PaintWindow({ windowId }: PaintWindowProps) {
  const { windows, viewportMode } = useShellState();
  const actions = useShellActions();
  const [activeTool, setActiveTool] = useState<PaintTool>(DEFAULT_PAINT_STATE.activeTool);
  const [activeColor, setActiveColor] = useState(DEFAULT_PAINT_STATE.activeColor);
  const [clearSignal, setClearSignal] = useState(0);
  const windowRecord = windows.find((record) => record.windowId === windowId);

  if (!windowRecord) {
    return null;
  }

  return (
    <WindowFrame
      windowId={windowId}
      title={windowRecord.title}
      iconKey="icon_paint"
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
            className={`retroButton ${styles.toolButton}`}
            aria-pressed={activeTool === 'pencil'}
            onClick={() => setActiveTool('pencil')}
          >
            <img
              className={styles.toolIcon}
              src={getAssetUrl(assetManifest.paint_tool_pencil)}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            {uiText.paint_tool_pencil_label}
          </button>
          <button
            type="button"
            className={`retroButton ${styles.toolButton}`}
            aria-pressed={activeTool === 'eraser'}
            onClick={() => setActiveTool('eraser')}
          >
            <img
              className={styles.toolIcon}
              src={getAssetUrl(assetManifest.paint_tool_eraser)}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            {uiText.paint_tool_eraser_label}
          </button>
          <button type="button" className={`retroButton ${styles.toolButton}`} onClick={() => setClearSignal((value) => value + 1)}>
            {uiText.paint_tool_clear_label}
          </button>
        </div>

        <div className={styles.paletteArea}>
          <span className={styles.paletteLabel}>{uiText.paint_palette_group_label}</span>
          <div className={styles.palette}>
            {DEFAULT_PAINT_STATE.palette.map((paletteColor) => (
              <button
                key={paletteColor}
                type="button"
                className={`${styles.swatch} ${activeColor === paletteColor ? styles.swatchActive : ''}`}
                style={{ backgroundColor: paletteColor }}
                aria-pressed={activeColor === paletteColor}
                aria-label={paletteColor}
                onClick={() => setActiveColor(paletteColor)}
              />
            ))}
          </div>
        </div>

        <div className={styles.canvasFrame}>
          <PaintCanvas
            activeTool={activeTool}
            activeColor={activeColor}
            clearSignal={clearSignal}
            ariaLabel={uiText.paint_canvas_aria_label}
          />
        </div>
      </div>
    </WindowFrame>
  );
}
