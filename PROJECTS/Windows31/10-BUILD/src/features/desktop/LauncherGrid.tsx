import type { AppId } from '../../shell/types';
import LauncherIcon from './LauncherIcon';
import styles from './DesktopSurface.module.css';

interface LauncherGridProps {
  appIds: AppId[];
  labels: Record<AppId, string>;
  iconKeys: Record<AppId, 'icon_notepad' | 'icon_paint' | 'icon_calculator' | 'icon_minesweeper'>;
  selectedAppId: AppId | null;
  onSelect: (appId: AppId) => void;
  onOpen: (appId: AppId) => void;
}

export default function LauncherGrid({
  appIds,
  labels,
  iconKeys,
  selectedAppId,
  onSelect,
  onOpen,
}: LauncherGridProps) {
  return (
    <div className={styles.launcherGrid}>
      {appIds.map((appId) => (
        <LauncherIcon
          key={appId}
          label={labels[appId]}
          iconKey={iconKeys[appId]}
          selected={selectedAppId === appId}
          onSelect={() => onSelect(appId)}
          onOpen={() => onOpen(appId)}
        />
      ))}
    </div>
  );
}
