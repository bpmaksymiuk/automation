import { useState } from 'react';
import { uiText } from '../../../content/uiText';
import { useShellActions, useShellState } from '../../../shell/ShellContext';
import WindowFrame from '../../windows/WindowFrame';
import styles from './CalculatorWindow.module.css';

interface CalculatorWindowProps {
  windowId: string;
}

type Operator = '+' | '-' | '×' | '÷' | null;

interface CalculatorState {
  display: string;
  storedValue: number | null;
  pendingOperator: Operator;
  awaitingNextValue: boolean;
  error: boolean;
}

const INITIAL_STATE: CalculatorState = {
  display: '0',
  storedValue: null,
  pendingOperator: null,
  awaitingNextValue: false,
  error: false,
};

function toNumber(value: string) {
  return Number.parseFloat(value);
}

function evaluate(left: number, right: number, operator: Exclude<Operator, null>) {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '×':
      return left * right;
    case '÷':
      return right === 0 ? null : left / right;
  }
}

export default function CalculatorWindow({ windowId }: CalculatorWindowProps) {
  const { windows, viewportMode } = useShellState();
  const actions = useShellActions();
  const [state, setState] = useState(INITIAL_STATE);
  const windowRecord = windows.find((record) => record.windowId === windowId);

  if (!windowRecord) {
    return null;
  }

  const inputDigit = (digit: string) => {
    setState((current) => {
      if (current.error) {
        return { ...INITIAL_STATE, display: digit };
      }

      if (current.awaitingNextValue) {
        return { ...current, display: digit, awaitingNextValue: false };
      }

      return {
        ...current,
        display: current.display === '0' ? digit : `${current.display}${digit}`,
      };
    });
  };

  const inputDecimal = () => {
    setState((current) => {
      if (current.error) {
        return { ...INITIAL_STATE, display: '0.' };
      }

      if (current.awaitingNextValue) {
        return { ...current, display: '0.', awaitingNextValue: false };
      }

      if (current.display.includes('.')) {
        return current;
      }

      return {
        ...current,
        display: `${current.display}.`,
      };
    });
  };

  const chooseOperator = (operator: Exclude<Operator, null>) => {
    setState((current) => {
      if (current.error) {
        return current;
      }

      const currentValue = toNumber(current.display);
      if (current.pendingOperator && current.storedValue !== null && !current.awaitingNextValue) {
        const result = evaluate(current.storedValue, currentValue, current.pendingOperator);
        if (result === null) {
          return { ...INITIAL_STATE, display: 'Error', error: true };
        }

        return {
          display: `${result}`,
          storedValue: result,
          pendingOperator: operator,
          awaitingNextValue: true,
          error: false,
        };
      }

      return {
        ...current,
        storedValue: currentValue,
        pendingOperator: operator,
        awaitingNextValue: true,
      };
    });
  };

  const executeEquals = () => {
    setState((current) => {
      if (current.error || current.pendingOperator === null || current.storedValue === null || current.awaitingNextValue) {
        return current;
      }

      const result = evaluate(current.storedValue, toNumber(current.display), current.pendingOperator);
      if (result === null) {
        return { ...INITIAL_STATE, display: 'Error', error: true };
      }

      return {
        display: `${result}`,
        storedValue: result,
        pendingOperator: null,
        awaitingNextValue: true,
        error: false,
      };
    });
  };

  const backspace = () => {
    setState((current) => {
      if (current.error || current.awaitingNextValue) {
        return current;
      }

      const nextDisplay = current.display.length > 1 ? current.display.slice(0, -1) : '0';
      return {
        ...current,
        display: nextDisplay === '-' ? '0' : nextDisplay,
      };
    });
  };

  const keys = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <WindowFrame
      windowId={windowId}
      title={windowRecord.title}
      iconKey="icon_calculator"
      zIndex={windowRecord.zIndex}
      position={windowRecord.position}
      size={windowRecord.size}
      viewportMode={viewportMode}
      isFocused={windowRecord.isFocused}
      isMaximized={windowRecord.isMaximized}
      onFocus={() => actions.focusWindow(windowId)}
      onClose={() => actions.closeWindow(windowId)}
      onMove={(position) =>
        actions.moveWindow(windowId, position, { width: window.innerWidth, height: window.innerHeight })
      }
    >
      <div
        className={styles.layout}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target instanceof HTMLButtonElement) {
            return;
          }

          if (/^[0-9]$/.test(event.key)) {
            inputDigit(event.key);
          } else if (event.key === '.') {
            inputDecimal();
          } else if (event.key === 'Enter') {
            event.preventDefault();
            executeEquals();
          } else if (event.key === 'Backspace') {
            event.preventDefault();
            backspace();
          } else if (event.key === 'Escape') {
            setState(INITIAL_STATE);
          } else if (event.key === '+' || event.key === '-') {
            chooseOperator(event.key);
          } else if (event.key === '*') {
            chooseOperator('×');
          } else if (event.key === '/') {
            event.preventDefault();
            chooseOperator('÷');
          }
        }}
      >
        <div className={styles.display} aria-label={uiText.calculator_display_aria_label} tabIndex={0}>
          {state.display}
        </div>
        <button type="button" className={`retroButton ${styles.clearButton}`} onClick={() => setState(INITIAL_STATE)}>
          C
        </button>
        <div className={styles.keypad}>
          {keys.flat().map((key) => (
            <button
              key={key}
              type="button"
              className={`retroButton ${styles.key}`}
              onClick={() => {
                if (/^[0-9]$/.test(key)) {
                  inputDigit(key);
                } else if (key === '.') {
                  inputDecimal();
                } else if (key === '=') {
                  executeEquals();
                } else {
                  chooseOperator(key as Exclude<Operator, null>);
                }
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}
