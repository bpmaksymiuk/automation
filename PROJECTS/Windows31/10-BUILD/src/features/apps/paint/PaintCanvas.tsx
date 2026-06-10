import {
  useEffect,
  useLayoutEffect,
  useRef,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { DESKTOP_CANVAS_COLOR } from '../../../utils/constants';
import type { PaintTool } from './paintTypes';
import styles from './PaintWindow.module.css';

interface PaintCanvasProps {
  activeTool: PaintTool;
  activeColor: string;
  clearSignal: number;
  ariaLabel: string;
}

function getToolColor(activeTool: PaintTool, activeColor: string) {
  return activeTool === 'eraser' ? DESKTOP_CANVAS_COLOR : activeColor;
}

function getCanvasContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is required.');
  }

  return context;
}

function getRelativePoint(canvas: HTMLCanvasElement, event: PointerEvent | ReactPointerEvent<HTMLCanvasElement>) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
    y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top)),
  };
}

function resizeCanvas(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  previousBitmapRef: MutableRefObject<HTMLCanvasElement | null>,
) {
  const canvas = canvasRef.current;
  if (!canvas) {
    return;
  }

  const bounds = canvas.getBoundingClientRect();
  const nextWidth = Math.max(1, Math.floor(bounds.width));
  const nextHeight = Math.max(1, Math.floor(bounds.height));
  const dpr = window.devicePixelRatio || 1;
  const context = getCanvasContext(canvas);
  const previousCanvas = document.createElement('canvas');
  previousCanvas.width = canvas.width;
  previousCanvas.height = canvas.height;
  previousCanvas.getContext('2d')?.drawImage(canvas, 0, 0);

  canvas.width = Math.max(1, Math.floor(nextWidth * dpr));
  canvas.height = Math.max(1, Math.floor(nextHeight * dpr));
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(dpr, dpr);
  context.fillStyle = DESKTOP_CANVAS_COLOR;
  context.fillRect(0, 0, nextWidth, nextHeight);

  if (previousCanvas.width > 0 && previousCanvas.height > 0) {
    context.drawImage(previousCanvas, 0, 0, previousCanvas.width, previousCanvas.height, 0, 0, nextWidth, nextHeight);
  }

  previousBitmapRef.current = previousCanvas;
}

export default function PaintCanvas({
  activeTool,
  activeColor,
  clearSignal,
  ariaLabel,
}: PaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousBitmapRef = useRef<HTMLCanvasElement | null>(null);
  const strokeRef = useRef<{ active: boolean; pointerId: number | null }>({ active: false, pointerId: null });
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    resizeCanvas(canvasRef, previousBitmapRef);
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const observer = new ResizeObserver(() => resizeCanvas(canvasRef, previousBitmapRef));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = getCanvasContext(canvas);
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    context.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    context.fillStyle = DESKTOP_CANVAS_COLOR;
    context.fillRect(0, 0, width, height);
    strokeRef.current = { active: false, pointerId: null };
    lastPointRef.current = null;
  }, [clearSignal]);

  const drawSegment = (event: PointerEvent | ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !strokeRef.current.active) {
      return;
    }

    const context = getCanvasContext(canvas);
    const point = getRelativePoint(canvas, event);
    const previousPoint = lastPointRef.current ?? point;

    context.strokeStyle = getToolColor(activeTool, activeColor);
    context.lineWidth = activeTool === 'eraser' ? 10 : 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(previousPoint.x, previousPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();

    lastPointRef.current = point;
  };

  const stopStroke = () => {
    strokeRef.current = { active: false, pointerId: null };
    lastPointRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label={ariaLabel}
      onPointerDown={(event) => {
        event.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }

        canvas.setPointerCapture(event.pointerId);
        strokeRef.current = { active: true, pointerId: event.pointerId };
        lastPointRef.current = getRelativePoint(canvas, event);
        drawSegment(event);
      }}
      onPointerMove={(event) => {
        if (strokeRef.current.pointerId !== event.pointerId) {
          return;
        }

        drawSegment(event);
      }}
      onPointerUp={stopStroke}
      onPointerCancel={stopStroke}
      onLostPointerCapture={stopStroke}
    />
  );
}
