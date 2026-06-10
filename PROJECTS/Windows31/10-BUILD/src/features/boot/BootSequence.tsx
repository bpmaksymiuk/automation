import { useEffect, useMemo, useState } from 'react';
import { assetManifest } from '../../assets/assetManifest';
import { uiText } from '../../content/uiText';
import { useShellActions } from '../../shell/ShellContext';
import { BOOT_DURATION_MS } from '../../utils/constants';
import { getAssetUrl } from '../../utils/assetPaths';
import styles from './BootSequence.module.css';

export default function BootSequence() {
  const actions = useShellActions();
  const [logoAvailable, setLogoAvailable] = useState(true);
  const bootDuration = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 300;
    }

    return BOOT_DURATION_MS;
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => actions.bootComplete(), bootDuration);
    return () => window.clearTimeout(timeoutId);
  }, [actions, bootDuration]);

  return (
    <main className={styles.boot} aria-label={uiText.boot_loading_label}>
      <div className={styles.panel}>
        {logoAvailable ? (
          <img
            className={styles.logo}
            src={getAssetUrl(assetManifest.boot_logo)}
            alt=""
            onError={() => setLogoAvailable(false)}
          />
        ) : (
          <div className={styles.logoFallback} aria-hidden="true">
            W31
          </div>
        )}
        <h1 className={styles.title}>{uiText.boot_loading_label}</h1>
        <p className={styles.status}>{uiText.boot_status_line}</p>
        <button type="button" className={`retroButton ${styles.skipButton}`} onClick={actions.bootSkip}>
          {uiText.boot_skip_button_label}
        </button>
      </div>
    </main>
  );
}
