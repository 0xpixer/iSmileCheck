"use client";

import { useCallback, useRef } from "react";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  value: number;
  onChange: (nextValue: number) => void;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  value,
  onChange,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const calcValue = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    onChange(pct);
  }, [onChange]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    calcValue(e.clientX);
  }, [calcValue]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    calcValue(e.clientX);
  }, [calcValue]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative aspect-[4/3] cursor-ew-resize select-none overflow-hidden rounded-2xl border border-orange-100 bg-slate-100 shadow-sm touch-none"
      >
        {/* After image (background) */}
        <img
          src={afterSrc}
          alt="After orthodontic simulation"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Before image (clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <img
            src={beforeSrc}
            alt="Before orthodontic simulation"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Slider line + handle */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${value}%` }}>
          <div className="h-full w-0.5 -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.3)]" />
          <div className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#F75202] text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
          Before
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
          After
        </div>
      </div>
    </div>
  );
}
