import { useEffect, useRef, useState } from 'react';
import { assetManifest } from '../../assets/assetManifest';
import { uiText } from '../../content/uiText';
import { useShellActions } from '../../shell/ShellContext';
import { getAssetUrl } from '../../utils/assetPaths';
import styles from './SecretOverlay.module.css';

export default function SecretOverlay() {
  const actions = useShellActions();
  const dismissButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [backdropAvailable, setBackdropAvailable] = useState(true);

  useEffect(() => {
    dismissButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        actions.dismissSecret();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  return (
    <div className={styles.overlay} role="presentation">
      <div
        ref={containerRef}
        className={styles.window}
        role="dialog"
        aria-modal="true"
        aria-labelledby="secret-title"
      >
        <div className={styles.titleBar}>
          <span id="secret-title">{uiText.secret_window_title}</span>
        </div>
        <div className={styles.content}>
          {backdropAvailable ? (
            <img
              className={styles.backdrop}
              src={getAssetUrl(assetManifest.secret_backdrop)}
              alt=""
              onError={() => setBackdropAvailable(false)}
            />
          ) : (
            <div className={styles.backdropFallback} aria-hidden="true" />
          )}
          <div className={styles.copy}>
            <h2>{uiText.secret_headline}</h2>
            <p>{uiText.secret_body}</p>
            <button
              ref={dismissButtonRef}
              type="button"
              className={`retroButton ${styles.dismissButton}`}
              onClick={actions.dismissSecret}
            >
              {uiText.secret_dismiss_button_label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
