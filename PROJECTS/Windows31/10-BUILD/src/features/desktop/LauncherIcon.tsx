import { useRef, useState } from 'react';
import { assetManifest, type AssetKey } from '../../assets/assetManifest';
import { getAssetUrl } from '../../utils/assetPaths';
import styles from './DesktopSurface.module.css';

interface LauncherIconProps {
  label: string;
  iconKey: AssetKey;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export default function LauncherIcon({
  label,
  iconKey,
  selected,
  onSelect,
  onOpen,
}: LauncherIconProps) {
  const asset = assetManifest[iconKey];
  const lastPointerRef = useRef<{ time: number; pointerType: string } | null>(null);
  const [assetAvailable, setAssetAvailable] = useState(true);

  return (
    <button
      type="button"
      className={`${styles.launcherIcon} ${selected ? styles.launcherIconSelected : ''}`}
      onFocus={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      onPointerUp={(event) => {
        onSelect();
        const pointerType = event.pointerType || 'mouse';
        const now = Date.now();
        const previous = lastPointerRef.current;

        if (pointerType === 'touch' || pointerType === 'pen') {
          onOpen();
          lastPointerRef.current = { time: now, pointerType };
          return;
        }

        if (previous && previous.pointerType === pointerType && now - previous.time <= 500) {
          onOpen();
          lastPointerRef.current = null;
          return;
        }

        lastPointerRef.current = { time: now, pointerType };
      }}
    >
      <span className={styles.launcherImageWrap} aria-hidden="true">
        {assetAvailable ? (
          <img
            className={styles.launcherImage}
            src={getAssetUrl(asset)}
            alt=""
            onError={() => setAssetAvailable(false)}
          />
        ) : asset.fallback === 'css-box' ? (
          <span className={styles.launcherCssFallback} />
        ) : (
          <span className={styles.launcherTextFallback}>{label.slice(0, 2)}</span>
        )}
      </span>
      <span className={styles.launcherLabel}>{label}</span>
    </button>
  );
}
