export type AssetKey =
  | 'boot_logo'
  | 'desktop_wallpaper'
  | 'program_manager_icon'
  | 'icon_notepad'
  | 'icon_paint'
  | 'icon_calculator'
  | 'icon_minesweeper'
  | 'paint_tool_pencil'
  | 'paint_tool_eraser'
  | 'minesweeper_restart_icon'
  | 'secret_backdrop';

export interface AssetSpec {
  deliveryFileName: string;
  runtimeImportPath: string;
  format: 'svg' | 'png';
  width: number;
  height: number;
  component: string;
  purpose: string;
  fallback: 'css-box' | 'text-label' | 'none';
}

export const assetManifest: Record<AssetKey, AssetSpec> = {
  boot_logo: {
    deliveryFileName: 'win31-surface-boot-logo-320x160.svg',
    runtimeImportPath: 'src/assets/imported/win31-surface-boot-logo-320x160.svg',
    format: 'svg',
    width: 320,
    height: 160,
    component: 'BootSequence',
    purpose: 'Centered startup graphic above boot text.',
    fallback: 'text-label',
  },
  desktop_wallpaper: {
    deliveryFileName: 'win31-surface-wallpaper-1024x768.png',
    runtimeImportPath: 'src/assets/imported/win31-surface-wallpaper-1024x768.png',
    format: 'png',
    width: 1024,
    height: 768,
    component: 'DesktopSurface',
    purpose: 'Shell wallpaper or repeating desktop background.',
    fallback: 'css-box',
  },
  program_manager_icon: {
    deliveryFileName: 'win31-icon-program-manager-32x32.png',
    runtimeImportPath: 'src/assets/imported/win31-icon-program-manager-32x32.png',
    format: 'png',
    width: 32,
    height: 32,
    component: 'WindowFrame/DesktopSurface',
    purpose: 'Title-bar icon for the Program Manager shell window and hidden secret trigger target.',
    fallback: 'css-box',
  },
  icon_notepad: {
    deliveryFileName: 'win31-icon-notepad-32x32.png',
    runtimeImportPath: 'src/assets/imported/win31-icon-notepad-32x32.png',
    format: 'png',
    width: 32,
    height: 32,
    component: 'LauncherIcon',
    purpose: 'Desktop icon for Notepad.',
    fallback: 'text-label',
  },
  icon_paint: {
    deliveryFileName: 'win31-icon-paint-32x32.png',
    runtimeImportPath: 'src/assets/imported/win31-icon-paint-32x32.png',
    format: 'png',
    width: 32,
    height: 32,
    component: 'LauncherIcon',
    purpose: 'Desktop icon for Paint.',
    fallback: 'text-label',
  },
  icon_calculator: {
    deliveryFileName: 'win31-icon-calculator-32x32.png',
    runtimeImportPath: 'src/assets/imported/win31-icon-calculator-32x32.png',
    format: 'png',
    width: 32,
    height: 32,
    component: 'LauncherIcon',
    purpose: 'Desktop icon for Calculator.',
    fallback: 'text-label',
  },
  icon_minesweeper: {
    deliveryFileName: 'win31-icon-minesweeper-32x32.png',
    runtimeImportPath: 'src/assets/imported/win31-icon-minesweeper-32x32.png',
    format: 'png',
    width: 32,
    height: 32,
    component: 'LauncherIcon',
    purpose: 'Desktop icon for Minesweeper.',
    fallback: 'text-label',
  },
  paint_tool_pencil: {
    deliveryFileName: 'win31-tool-pencil-16x16.svg',
    runtimeImportPath: 'src/assets/imported/win31-tool-pencil-16x16.svg',
    format: 'svg',
    width: 16,
    height: 16,
    component: 'PaintWindow',
    purpose: 'Toolbar icon paired with the pencil control.',
    fallback: 'text-label',
  },
  paint_tool_eraser: {
    deliveryFileName: 'win31-tool-eraser-16x16.svg',
    runtimeImportPath: 'src/assets/imported/win31-tool-eraser-16x16.svg',
    format: 'svg',
    width: 16,
    height: 16,
    component: 'PaintWindow',
    purpose: 'Toolbar icon paired with the eraser control.',
    fallback: 'text-label',
  },
  minesweeper_restart_icon: {
    deliveryFileName: 'win31-tool-restart-16x16.svg',
    runtimeImportPath: 'src/assets/imported/win31-tool-restart-16x16.svg',
    format: 'svg',
    width: 16,
    height: 16,
    component: 'MinesweeperWindow',
    purpose: 'Optional icon paired with the restart control.',
    fallback: 'none',
  },
  secret_backdrop: {
    deliveryFileName: 'win31-secret-after-hours-640x400.svg',
    runtimeImportPath: 'src/assets/imported/win31-secret-after-hours-640x400.svg',
    format: 'svg',
    width: 640,
    height: 400,
    component: 'SecretOverlay',
    purpose: 'Distinct secret-response background art inside the overlay content area.',
    fallback: 'css-box',
  },
};
