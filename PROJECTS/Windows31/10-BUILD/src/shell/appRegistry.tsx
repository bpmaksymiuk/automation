import { uiText } from '../content/uiText';
import CalculatorWindow from '../features/apps/calculator/CalculatorWindow';
import MinesweeperWindow from '../features/apps/minesweeper/MinesweeperWindow';
import NotepadWindow from '../features/apps/notepad/NotepadWindow';
import PaintWindow from '../features/apps/paint/PaintWindow';
import type { AppDefinition, AppId } from './types';

export const appRegistry: AppDefinition[] = [
  {
    appId: 'notepad',
    titleKey: 'notepad_window_title',
    iconKey: 'icon_notepad',
    defaultSize: { width: 520, height: 360 },
    defaultPosition: { x: 72, y: 72 },
    desktopGroup: 'accessories',
    mobileStartsMaximized: true,
    renderWindow: (windowId) => <NotepadWindow key={windowId} windowId={windowId} />,
  },
  {
    appId: 'paint',
    titleKey: 'paint_window_title',
    iconKey: 'icon_paint',
    defaultSize: { width: 700, height: 540 },
    defaultPosition: { x: 132, y: 96 },
    desktopGroup: 'accessories',
    mobileStartsMaximized: true,
    renderWindow: (windowId) => <PaintWindow key={windowId} windowId={windowId} />,
  },
  {
    appId: 'calculator',
    titleKey: 'calculator_window_title',
    iconKey: 'icon_calculator',
    defaultSize: { width: 260, height: 320 },
    defaultPosition: { x: 192, y: 120 },
    desktopGroup: 'accessories',
    mobileStartsMaximized: true,
    renderWindow: (windowId) => <CalculatorWindow key={windowId} windowId={windowId} />,
  },
  {
    appId: 'minesweeper',
    titleKey: 'minesweeper_window_title',
    iconKey: 'icon_minesweeper',
    defaultSize: { width: 320, height: 420 },
    defaultPosition: { x: 252, y: 144 },
    desktopGroup: 'games',
    mobileStartsMaximized: true,
    renderWindow: (windowId) => <MinesweeperWindow key={windowId} windowId={windowId} />,
  },
];

export const appRegistryById = appRegistry.reduce(
  (registry, definition) => {
    registry[definition.appId] = definition;
    return registry;
  },
  {} as Record<AppId, AppDefinition>,
);

export const launcherLabelByAppId = {
  notepad: uiText.launcher_notepad_label,
  paint: uiText.launcher_paint_label,
  calculator: uiText.launcher_calculator_label,
  minesweeper: uiText.launcher_minesweeper_label,
} satisfies Record<AppId, string>;
