import { useEffect, useRef } from 'react';
import BootSequence from '../features/boot/BootSequence';
import DesktopSurface from '../features/desktop/DesktopSurface';
import SecretOverlay from '../features/secret/SecretOverlay';
import { MOBILE_BREAKPOINT_PX } from '../utils/constants';
import { useShellActions, useShellState } from './ShellContext';

export default function ShellRoot() {
  const { phase, focusedWindowId } = useShellState();
  const actions = useShellActions();
  const previousPhaseRef = useRef(phase);

  useEffect(() => {
    const updateViewportMode = () => {
      actions.setViewportMode(
        window.innerWidth <= MOBILE_BREAKPOINT_PX ? 'mobile' : 'desktop',
        { width: window.innerWidth, height: window.innerHeight },
      );
    };

    updateViewportMode();
    window.addEventListener('resize', updateViewportMode);
    return () => window.removeEventListener('resize', updateViewportMode);
  }, [actions]);

  useEffect(() => {
    if (phase === 'boot') {
      previousPhaseRef.current = phase;
      return;
    }

    const shouldRestoreFocus =
      previousPhaseRef.current !== phase || document.activeElement === document.body;

    previousPhaseRef.current = phase;
    if (!shouldRestoreFocus) {
      return;
    }

    const target =
      focusedWindowId === null
        ? document.querySelector<HTMLElement>('[data-desktop-focus-surface="true"]')
        : document.querySelector<HTMLElement>(`[data-window-titlebar-id="${focusedWindowId}"]`);

    target?.focus();
  }, [focusedWindowId, phase]);

  return (
    <div className="appRoot">
      {phase === 'boot' ? <BootSequence /> : <DesktopSurface />}
      {phase === 'secret' ? <SecretOverlay /> : null}
    </div>
  );
}
