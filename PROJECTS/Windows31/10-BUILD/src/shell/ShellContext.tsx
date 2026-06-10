import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from 'react';
import { uiText } from '../content/uiText';
import { clamp } from '../utils/clamp';
import {
  MOBILE_BREAKPOINT_PX,
  WINDOW_MIN_VISIBLE_TITLEBAR_PX,
  WINDOW_TITLEBAR_HEIGHT_PX,
} from '../utils/constants';
import type { Point, ViewportMode } from '../types/runtime';
import { appRegistryById } from './appRegistry';
import type { AppId, ShellPhase, WindowRecord } from './types';

type FocusTarget = string | 'desktop';

interface ShellState {
  phase: ShellPhase;
  viewportMode: ViewportMode;
  windows: WindowRecord[];
  focusedWindowId: string | null;
  lastNonSecretFocusTarget: FocusTarget;
}

type ShellAction =
  | { type: 'BOOT_COMPLETE' }
  | { type: 'BOOT_SKIP' }
  | { type: 'OPEN_APP'; appId: AppId }
  | { type: 'FOCUS_WINDOW'; windowId: string | null }
  | {
      type: 'CLOSE_WINDOW';
      windowId: string;
    }
  | {
      type: 'MOVE_WINDOW';
      windowId: string;
      position: Point;
      viewportSize: { width: number; height: number };
    }
  | {
      type: 'SET_VIEWPORT_MODE';
      viewportMode: ViewportMode;
      viewportSize: { width: number; height: number };
    }
  | { type: 'TRIGGER_SECRET' }
  | { type: 'DISMISS_SECRET' };

const initialState: ShellState = {
  phase: 'boot',
  viewportMode:
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT_PX ? 'mobile' : 'desktop',
  windows: [],
  focusedWindowId: null,
  lastNonSecretFocusTarget: 'desktop',
};

function getNextZIndex(windows: WindowRecord[]) {
  const maxZ = windows.reduce((max, windowRecord) => Math.max(max, windowRecord.zIndex), 0);
  return maxZ + 1;
}

function clampWindowPosition(
  position: Point,
  size: { width: number; height: number },
  viewportSize: { width: number; height: number },
) {
  const minX = WINDOW_MIN_VISIBLE_TITLEBAR_PX - size.width;
  const maxX = Math.max(0, viewportSize.width - WINDOW_MIN_VISIBLE_TITLEBAR_PX);
  const maxY = Math.max(0, viewportSize.height - WINDOW_TITLEBAR_HEIGHT_PX);

  return {
    x: clamp(position.x, minX, maxX),
    y: clamp(position.y, 0, maxY),
  };
}

function maximizeWindow(
  windowRecord: WindowRecord,
  viewportSize: { width: number; height: number },
): WindowRecord {
  if (windowRecord.isMaximized) {
    return {
      ...windowRecord,
      position: { x: 0, y: 0 },
      size: { width: viewportSize.width, height: viewportSize.height },
    };
  }

  return {
    ...windowRecord,
    isMaximized: true,
    restorePosition: windowRecord.position,
    restoreSize: windowRecord.size,
    position: { x: 0, y: 0 },
    size: { width: viewportSize.width, height: viewportSize.height },
  };
}

function restoreWindow(
  windowRecord: WindowRecord,
  viewportSize: { width: number; height: number },
): WindowRecord {
  const app = appRegistryById[windowRecord.appId];
  const restoredSize = windowRecord.restoreSize ?? app.defaultSize;
  const restoredPosition = clampWindowPosition(
    windowRecord.restorePosition ?? app.defaultPosition,
    restoredSize,
    viewportSize,
  );

  return {
    ...windowRecord,
    isMaximized: false,
    position: restoredPosition,
    size: restoredSize,
    restorePosition: null,
    restoreSize: null,
  };
}

function focusWindowList(windows: WindowRecord[], windowId: string | null) {
  const nextZIndex = windowId ? getNextZIndex(windows) : 0;

  return windows.map((windowRecord) => ({
    ...windowRecord,
    isFocused: windowRecord.windowId === windowId,
    zIndex: windowRecord.windowId === windowId ? nextZIndex : windowRecord.zIndex,
  }));
}

function resolveNextFocus(windows: WindowRecord[]) {
  const nextFocusedWindow = [...windows].sort((a, b) => b.zIndex - a.zIndex)[0] ?? null;
  return nextFocusedWindow?.windowId ?? null;
}

function createWindowRecord(
  appId: AppId,
  viewportMode: ViewportMode,
  viewportSize: { width: number; height: number },
  currentWindows: WindowRecord[],
): WindowRecord {
  const definition = appRegistryById[appId];
  const baseSize =
    viewportMode === 'mobile'
      ? { width: viewportSize.width, height: viewportSize.height }
      : definition.defaultSize;
  const basePosition =
    viewportMode === 'mobile'
      ? { x: 0, y: 0 }
      : clampWindowPosition(definition.defaultPosition, baseSize, viewportSize);

  return {
    windowId: appId,
    appId,
    title: uiText[definition.titleKey],
    isOpen: true,
    isFocused: true,
    zIndex: getNextZIndex(currentWindows),
    position: basePosition,
    size: baseSize,
    isMaximized: viewportMode === 'mobile',
    restorePosition: null,
    restoreSize: null,
  };
}

function reducer(state: ShellState, action: ShellAction): ShellState {
  switch (action.type) {
    case 'BOOT_COMPLETE':
    case 'BOOT_SKIP': {
      if (state.phase !== 'boot') {
        return state;
      }

      return {
        ...state,
        phase: 'desktop',
      };
    }
    case 'OPEN_APP': {
      const existingWindow = state.windows.find((windowRecord) => windowRecord.appId === action.appId);
      if (existingWindow) {
        return {
          ...state,
          windows: focusWindowList(state.windows, existingWindow.windowId),
          focusedWindowId: existingWindow.windowId,
          lastNonSecretFocusTarget: existingWindow.windowId,
        };
      }

      const viewportSize =
        typeof window !== 'undefined'
          ? { width: window.innerWidth, height: window.innerHeight }
          : { width: 1024, height: 768 };
      const createdWindow = createWindowRecord(
        action.appId,
        state.viewportMode,
        viewportSize,
        state.windows,
      );
      const nextWindows = [...focusWindowList(state.windows, null), createdWindow];

      return {
        ...state,
        windows: nextWindows,
        focusedWindowId: createdWindow.windowId,
        lastNonSecretFocusTarget: createdWindow.windowId,
      };
    }
    case 'FOCUS_WINDOW': {
      const nextWindows = focusWindowList(state.windows, action.windowId);
      return {
        ...state,
        windows: nextWindows,
        focusedWindowId: action.windowId,
        lastNonSecretFocusTarget: action.windowId ?? 'desktop',
      };
    }
    case 'CLOSE_WINDOW': {
      const remainingWindows = state.windows.filter((windowRecord) => windowRecord.windowId !== action.windowId);
      const nextFocus = resolveNextFocus(remainingWindows);
      const focusedWindows = focusWindowList(remainingWindows, nextFocus);

      return {
        ...state,
        windows: focusedWindows,
        focusedWindowId: nextFocus,
        lastNonSecretFocusTarget: nextFocus ?? 'desktop',
      };
    }
    case 'MOVE_WINDOW': {
      const nextWindows = state.windows.map((windowRecord) => {
        if (windowRecord.windowId !== action.windowId || windowRecord.isMaximized) {
          return windowRecord;
        }

        return {
          ...windowRecord,
          position: clampWindowPosition(action.position, windowRecord.size, action.viewportSize),
        };
      });

      return {
        ...state,
        windows: nextWindows,
      };
    }
    case 'SET_VIEWPORT_MODE': {
      if (state.viewportMode === action.viewportMode) {
        return state;
      }

      const nextWindows =
        action.viewportMode === 'mobile'
          ? state.windows.map((windowRecord) => maximizeWindow(windowRecord, action.viewportSize))
          : state.windows.map((windowRecord) => restoreWindow(windowRecord, action.viewportSize));

      return {
        ...state,
        viewportMode: action.viewportMode,
        windows: nextWindows,
      };
    }
    case 'TRIGGER_SECRET': {
      if (state.phase !== 'desktop') {
        return state;
      }

      return {
        ...state,
        phase: 'secret',
      };
    }
    case 'DISMISS_SECRET': {
      const targetWindowId =
        state.lastNonSecretFocusTarget === 'desktop' ? null : state.lastNonSecretFocusTarget;
      return {
        ...state,
        phase: 'desktop',
        focusedWindowId: targetWindowId,
        windows: focusWindowList(state.windows, targetWindowId),
      };
    }
    default:
      return state;
  }
}

const ShellStateContext = createContext<ShellState | null>(null);
const ShellDispatchContext = createContext<Dispatch<ShellAction> | null>(null);

export function ShellProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ShellStateContext.Provider value={state}>
      <ShellDispatchContext.Provider value={dispatch}>{children}</ShellDispatchContext.Provider>
    </ShellStateContext.Provider>
  );
}

export function useShellState() {
  const context = useContext(ShellStateContext);
  if (!context) {
    throw new Error('useShellState must be used within ShellProvider.');
  }

  return context;
}

export function useShellActions() {
  const dispatch = useContext(ShellDispatchContext);
  if (!dispatch) {
    throw new Error('useShellActions must be used within ShellProvider.');
  }

  return useMemo(
    () => ({
      bootComplete: () => dispatch({ type: 'BOOT_COMPLETE' }),
      bootSkip: () => dispatch({ type: 'BOOT_SKIP' }),
      openApp: (appId: AppId) => dispatch({ type: 'OPEN_APP', appId }),
      focusWindow: (windowId: string | null) => dispatch({ type: 'FOCUS_WINDOW', windowId }),
      closeWindow: (windowId: string) => dispatch({ type: 'CLOSE_WINDOW', windowId }),
      moveWindow: (
        windowId: string,
        position: Point,
        viewportSize: { width: number; height: number },
      ) => dispatch({ type: 'MOVE_WINDOW', windowId, position, viewportSize }),
      setViewportMode: (viewportMode: ViewportMode, viewportSize: { width: number; height: number }) =>
        dispatch({ type: 'SET_VIEWPORT_MODE', viewportMode, viewportSize }),
      triggerSecret: () => dispatch({ type: 'TRIGGER_SECRET' }),
      dismissSecret: () => dispatch({ type: 'DISMISS_SECRET' }),
    }),
    [dispatch],
  );
}
