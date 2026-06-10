import type React from 'react';
import type { AssetKey } from '../assets/assetManifest';
import type { UITextContract } from '../content/uiText';
import type { Point } from '../types/runtime';

export type ShellPhase = 'boot' | 'desktop' | 'secret';
export type AppId = 'notepad' | 'paint' | 'calculator' | 'minesweeper';

export interface WindowRecord {
  windowId: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  zIndex: number;
  position: Point;
  size: { width: number; height: number };
  isMaximized: boolean;
  restorePosition: Point | null;
  restoreSize: { width: number; height: number } | null;
}

export interface AppDefinition {
  appId: AppId;
  titleKey: keyof UITextContract;
  iconKey: AssetKey;
  defaultSize: { width: number; height: number };
  defaultPosition: Point;
  desktopGroup: 'accessories' | 'games';
  mobileStartsMaximized: true;
  renderWindow: (windowId: string) => React.ReactNode;
}
