import { useEffect, useRef, useState, type ReactNode } from 'react';
import { assetManifest, type AssetKey } from '../../assets/assetManifest';
import { uiText } from '../../content/uiText';
import type { Point, ViewportMode } from '../../types/runtime';
import { getAssetUrl } from '../../utils/assetPaths';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  windowId: string;
  title: string;
  iconKey?: AssetKey;
  zIndex: number;
  position: Point;
  size: { width: number; height: number };
  viewportMode: ViewportMode;
  isFocused: boolean;
  isMaximized: boolean;
  onFocus: () => void;
  onClose?: () => void;
  onMove?: (position: Point) => void;
  titleIconButton?: {
    label: string;
    onActivate: () => void;
  };
  showCloseButton?: boolean;
  children: ReactNode;
}

export default function WindowFrame({
  windowId,
  title,
  iconKey,
  zIndex,
  position,
  size,
  viewportMode,
  isFocused,
  isMaximized,
  onFocus,
  onClose,
  onMove,
  titleIconButton,
  showCloseButton = true,
  children,
}: WindowFrameProps) {
  const dragStateRef = useRef<{
    offsetX: number;
    offsetY: number;
    active: boolean;
  } | null>(null);
  const [assetAvailable, setAssetAvailable] = useState(true);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current?.active || viewportMode !== 'desktop' || !onMove) {
        return;
      }

      onMove({
        x: event.clientX - dragStateRef.current.offsetX,
        y: event.clientY - dragStateRef.current.offsetY,
      });
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [onMove, viewportMode]);

  const asset = iconKey ? assetManifest[iconKey] : null;

  return (
    <section
      className={`${styles.window} ${isFocused ? styles.focused : ''} ${isMaximized ? styles.maximized : ''}`}
      style={{
        zIndex,
        width: size.width,
        height: size.height,
        transform: isMaximized ? undefined : `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-label={title}
      onPointerDown={onFocus}
    >
      <div
        className={styles.titleBar}
        tabIndex={-1}
        data-window-titlebar-id={windowId}
        onPointerDown={(event) => {
          onFocus();
          if (
            viewportMode !== 'desktop' ||
            isMaximized ||
            !onMove ||
            !(event.target instanceof HTMLElement) ||
            event.target.closest('button')
          ) {
            return;
          }

          dragStateRef.current = {
            active: true,
            offsetX: event.clientX - position.x,
            offsetY: event.clientY - position.y,
          };
        }}
      >
        {titleIconButton ? (
          <button
            type="button"
            className={styles.titleIconButton}
            aria-label={titleIconButton.label}
            onClick={(event) => {
              event.stopPropagation();
              titleIconButton.onActivate();
            }}
          >
            {asset && assetAvailable ? (
              <img
                className={styles.icon}
                src={getAssetUrl(asset)}
                alt=""
                onError={() => {
                  setAssetAvailable(false);
                }}
              />
            ) : null}
            {!assetAvailable && asset?.fallback === 'css-box' ? (
              <span className={styles.iconFallback} aria-hidden="true" />
            ) : null}
          </button>
        ) : asset ? (
          <span className={styles.titleIcon} aria-hidden="true">
            {assetAvailable ? (
              <img
                className={styles.icon}
                src={getAssetUrl(asset)}
                alt=""
                onError={() => {
                  setAssetAvailable(false);
                }}
              />
            ) : null}
            {!assetAvailable && asset.fallback === 'css-box' ? (
              <span className={styles.iconFallback} aria-hidden="true" />
            ) : null}
          </span>
        ) : (
          <span className={styles.titleIcon} aria-hidden="true" />
        )}
        <span className={styles.title}>{title}</span>
        {showCloseButton && onClose ? (
          <button
            type="button"
            className={styles.closeButton}
            aria-label={uiText.window_close_button_label}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            ✕
          </button>
        ) : null}
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
