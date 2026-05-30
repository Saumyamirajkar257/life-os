'use client';

import { useRef, useEffect, useState } from 'react';

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  points: DrawingPoint[];
  color: string;
  thickness: number;
}

interface DrawingCanvasProps {
  width: number;
  height: number;
  color: string;
  thickness: number;
  strokes: DrawingStroke[];
  onChange: (strokes: DrawingStroke[]) => void;
  isDrawingMode: boolean;
}

export function DrawingCanvas({
  width,
  height,
  color,
  thickness,
  strokes,
  onChange,
  isDrawingMode,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPointsRef = useRef<DrawingPoint[]>([]);

  // Redraw all strokes whenever they change, or when canvas dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw saved strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.thickness;

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, width, height]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): DrawingPoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    canvasRef.current?.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    currentPointsRef.current = [coords];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    const points = currentPointsRef.current;
    const prevPoint = points[points.length - 1];
    
    // Draw immediate segment to give real-time feedback
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && prevPoint) {
      // Note: we don't clear the canvas here, just draw the new segment
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    currentPointsRef.current.push(coords);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    setIsDrawing(false);

    if (currentPointsRef.current.length >= 2) {
      const newStroke: DrawingStroke = {
        id: Math.random().toString(36).substr(2, 9),
        points: currentPointsRef.current,
        color,
        thickness,
      };
      onChange([...strokes, newStroke]);
    }
    currentPointsRef.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 z-20 ${isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
    />
  );
}
