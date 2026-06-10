import { useMemo, useRef, useState } from 'react';
import { assetManifest } from '../../assets/assetManifest';
import { uiText } from '../../content/uiText';
import { useShellActions, useShellState } from '../../shell/ShellContext';
import { appRegistry, appRegistryById, launcherLabelByAppId } from '../../shell/appRegistry';
import type { AppId } from '../../shell/types';
import { getAssetUrl } from '../../utils/assetPaths';
import WindowFrame from '../windows/WindowFrame';
import LauncherGrid from './LauncherGrid';
import styles from './DesktopSurface.module.css';

const LAUNCHER_ICON_KEYS = {
  notepad: 'icon_notepad',
  paint: 'icon_paint',
  calculator: 'icon_calculator',
  minesweeper: 'icon_minesweeper',
} as const;

export default function DesktopSurface() {
  const { windows, viewportMode, focusedWindowId, phase } = useShellState();
  const actions = useShellActions();
  const [selectedAppId, setSelectedAppId] = useState<AppId | null>(null);
  const triggerTimestampsRef = useRef<number[]>([]);

  const groupedApps = useMemo(
    () => ({
      accessories: appRegistry.filter((app) => app.desktopGroup === 'accessories').map((app) => app.appId),
      games: appRegistry.filter((app) => app.desktopGroup === 'games').map((app) => app.appId),
    }),
    [],
  );

  const handleSecretTrigger = () => {
    if (phase !== 'desktop') {
      return;
    }

    const now = Date.now();
    const filtered = triggerTimestampsRef.current.filter((time) => now - time <= 2500);
    filtered.push(now);
    triggerTimestampsRef.current = filtered;

    if (filtered.length >= 3) {
      triggerTimestampsRef.current = [];
      actions.triggerSecret();
    }
  };

  return (
    <main
      className={styles.desktop}
      data-desktop-focus-surface="true"
      tabIndex={-1}
      onPointerDown={() => actions.focusWindow(null)}
      style={{
        backgroundImage: `linear-gradient(rgb(0 0 0 / 0.08), rgb(0 0 0 / 0.08)), url(${getAssetUrl(
          assetManifest.desktop_wallpaper,
        )})`,
      }}
    >
      <div className={styles.desktopInner}>
        <WindowFrame
          windowId="program-manager"
          title={uiText.desktop_window_title}
          iconKey="program_manager_icon"
          zIndex={1}
          position={{ x: viewportMode === 'mobile' ? 0 : 24, y: viewportMode === 'mobile' ? 0 : 24 }}
          size={{
            width: viewportMode === 'mobile' ? window.innerWidth : 420,
            height: viewportMode === 'mobile' ? Math.max(window.innerHeight, 520) : 480,
          }}
          viewportMode={viewportMode}
          isFocused={focusedWindowId === null}
          isMaximized={viewportMode === 'mobile'}
          onFocus={() => actions.focusWindow(null)}
          titleIconButton={{
            label: uiText.window_title_icon_button_label,
            onActivate: handleSecretTrigger,
          }}
          showCloseButton={false}
        >
          <div className={styles.programManager}>
            <p className={styles.statusHint}>{uiText.desktop_status_hint}</p>
            <section className={styles.groupSection} aria-labelledby="group-accessories-title">
              <h2 id="group-accessories-title" className={styles.groupTitle}>
                {uiText.desktop_group_accessories_title}
              </h2>
              <LauncherGrid
                appIds={groupedApps.accessories}
                labels={launcherLabelByAppId}
                iconKeys={LAUNCHER_ICON_KEYS}
                selectedAppId={selectedAppId}
                onSelect={setSelectedAppId}
                onOpen={actions.openApp}
              />
            </section>
            <section className={styles.groupSection} aria-labelledby="group-games-title">
              <h2 id="group-games-title" className={styles.groupTitle}>
                {uiText.desktop_group_games_title}
              </h2>
              <LauncherGrid
                appIds={groupedApps.games}
                labels={launcherLabelByAppId}
                iconKeys={LAUNCHER_ICON_KEYS}
                selectedAppId={selectedAppId}
                onSelect={setSelectedAppId}
                onOpen={actions.openApp}
              />
            </section>
          </div>
        </WindowFrame>

        {windows
          .slice()
          .sort((left, right) => left.zIndex - right.zIndex)
          .map((windowRecord) => (
            <div key={windowRecord.windowId}>
              {appRegistryById[windowRecord.appId].renderWindow(windowRecord.windowId)}
            </div>
          ))}
      </div>
    </main>
  );
}
