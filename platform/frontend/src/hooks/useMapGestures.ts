"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GestureState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseMapGesturesOptions {
  minScale?: number;
  maxScale?: number;
  /** Called when the user single-taps a country (after double-tap disambiguation). */
  onCountryTap?: (slug: string) => void;
  /** Returns the country slug hit at SVG-space point (x, y) within the container. */
  hitTest?: (x: number, y: number) => string | null;
}

interface UseMapGesturesReturn {
  gestureState: GestureState;
  /** Assign to the outer container div */
  containerRef: React.RefObject<HTMLDivElement>;
  /** CSS transform string for the inner <g> or transform container */
  transformStyle: string;
  /** Whether zoom > 1.05 (controls visibility of RESET button + zoom indicator) */
  isZoomed: boolean;
  /** Resets zoom/pan to 1× with animation */
  resetView: () => void;
}

const MIN_SCALE_DEFAULT = 1;
const MAX_SCALE_DEFAULT = 3;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_PX = 50;

export function useMapGestures({
  minScale = MIN_SCALE_DEFAULT,
  maxScale = MAX_SCALE_DEFAULT,
  onCountryTap,
  hitTest,
}: UseMapGesturesOptions = {}): UseMapGesturesReturn {
  const containerRef = useRef<HTMLDivElement>(null!);

  const scaleRef     = useRef(1);
  const txRef        = useRef(0);
  const tyRef        = useRef(0);
  const [gestureState, setGestureState] = useState<GestureState>({ scale: 1, translateX: 0, translateY: 0 });

  // Pinch tracking
  const prevDistRef  = useRef<number | null>(null);
  const prevMidRef   = useRef<{ x: number; y: number } | null>(null);
  const originRef    = useRef<{ x: number; y: number } | null>(null);   // scale origin in container space
  const scalePivotTxRef = useRef(0);
  const scalePivotTyRef = useRef(0);

  // Pan tracking (single touch)
  const panStartRef  = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastVelRef   = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const inertiaRef   = useRef<number | null>(null);

  // Double-tap tracking
  const lastTapRef   = useRef<{ t: number; x: number; y: number } | null>(null);
  const tapTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // rAF ref
  const rafRef       = useRef<number | null>(null);

  const commitState = useCallback(() => {
    setGestureState({ scale: scaleRef.current, translateX: txRef.current, translateY: tyRef.current });
  }, []);

  const clampTranslate = useCallback((tx: number, ty: number, s: number, w: number, h: number) => {
    // Keep map visible: translated origin can't push the map entirely off screen
    const maxTx =  (s - 1) * w * 0.5 + w * 0.15;
    const minTx = -(s - 1) * w * 0.5 - w * 0.15;
    const maxTy =  (s - 1) * h * 0.5 + h * 0.15;
    const minTy = -(s - 1) * h * 0.5 - h * 0.15;
    return {
      tx: Math.min(maxTx, Math.max(minTx, tx)),
      ty: Math.min(maxTy, Math.max(minTy, ty)),
    };
  }, []);

  const applyTransform = useCallback((s: number, tx: number, ty: number, animate = false) => {
    if (!containerRef.current) return;
    const inner = containerRef.current.querySelector<HTMLElement>("[data-map-inner]");
    if (!inner) return;
    if (animate) {
      inner.style.transition = "transform 200ms ease-out";
    } else {
      inner.style.transition = "";
    }
    inner.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${s})`;
    inner.style.transformOrigin = "0 0";
    // will-change during gesture
    inner.style.willChange = "transform";
  }, []);

  const resetView = useCallback(() => {
    scaleRef.current = 1;
    txRef.current = 0;
    tyRef.current = 0;
    applyTransform(1, 0, 0, true);
    if (containerRef.current) {
      containerRef.current.style.touchAction = "pinch-zoom";
    }
    commitState();
  }, [applyTransform, commitState]);

  // Distance between two touches
  function dist(a: Touch, b: Touch) {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function mid(a: Touch, b: Touch) {
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }

  function containerPoint(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  useEffect(() => {
    const el = containerRef.current as HTMLDivElement;
    if (!el) return;

    el.style.touchAction = "pinch-zoom";

    function cancelInertia() {
      if (inertiaRef.current !== null) {
        cancelAnimationFrame(inertiaRef.current);
        inertiaRef.current = null;
      }
    }

    function scheduleFrame(s: number, tx: number, ty: number) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        applyTransform(s, tx, ty);
        commitState();
      });
    }

    function onTouchStart(e: TouchEvent) {
      cancelInertia();
      const inner = el.querySelector<HTMLElement>("[data-map-inner]");
      if (inner) inner.style.willChange = "transform";

      if (e.touches.length === 2) {
        // Pinch start
        e.preventDefault();
        panStartRef.current = null;
        prevDistRef.current = dist(e.touches[0], e.touches[1]);
        const m = mid(e.touches[0], e.touches[1]);
        prevMidRef.current = m;
        const cp = containerPoint(m.x, m.y);
        // Scale pivot: where in the current-space the fingers are
        originRef.current = {
          x: (cp.x - txRef.current) / scaleRef.current,
          y: (cp.y - tyRef.current) / scaleRef.current,
        };
        scalePivotTxRef.current = txRef.current;
        scalePivotTyRef.current = tyRef.current;
        // Switch to none so pan works
        el.style.touchAction = "none";
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        const cp = containerPoint(t.clientX, t.clientY);
        if (scaleRef.current > 1) {
          // Pan mode
          e.preventDefault();
          panStartRef.current = { x: cp.x, y: cp.y, tx: txRef.current, ty: tyRef.current };
          el.style.touchAction = "none";
        }
        // Double-tap detection on touchstart gives us coords
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (rafRef.current !== null) return; // coalesce via rAF

      if (e.touches.length === 2 && prevDistRef.current !== null && originRef.current !== null) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const ratio = d / prevDistRef.current;
        const newScale = Math.min(maxScale, Math.max(minScale, scaleRef.current * ratio));

        const m = mid(e.touches[0], e.touches[1]);
        const cp = containerPoint(m.x, m.y);
        const panDx = cp.x - (prevMidRef.current?.x ?? cp.x - (containerRef.current?.getBoundingClientRect().left ?? 0));
        const panDy = cp.y - (prevMidRef.current?.y ?? cp.y - (containerRef.current?.getBoundingClientRect().top ?? 0));

        // New translate: keep scale origin pinned
        const ox = originRef.current.x;
        const oy = originRef.current.y;
        let newTx = cp.x - ox * newScale + panDx * 0;
        let newTy = cp.y - oy * newScale + panDy * 0;

        // Simpler: maintain the origin point
        newTx = scalePivotTxRef.current + (ox * scaleRef.current - ox * newScale);
        newTy = scalePivotTyRef.current + (oy * scaleRef.current - oy * newScale);

        const rect = el.getBoundingClientRect();
        const { tx, ty } = clampTranslate(newTx, newTy, newScale, rect.width, rect.height);

        scaleRef.current = newScale;
        txRef.current = tx;
        tyRef.current = ty;
        prevDistRef.current = d;
        prevMidRef.current = containerPoint(m.x, m.y);

        scheduleFrame(newScale, tx, ty);

      } else if (e.touches.length === 1 && panStartRef.current !== null && scaleRef.current > 1) {
        e.preventDefault();
        const t = e.touches[0];
        const cp = containerPoint(t.clientX, t.clientY);
        const dx = cp.x - panStartRef.current.x;
        const dy = cp.y - panStartRef.current.y;

        const rect = el.getBoundingClientRect();
        const { tx, ty } = clampTranslate(
          panStartRef.current.tx + dx,
          panStartRef.current.ty + dy,
          scaleRef.current, rect.width, rect.height
        );

        lastVelRef.current = { vx: dx, vy: dy };
        txRef.current = tx;
        tyRef.current = ty;
        panStartRef.current = { ...panStartRef.current, x: cp.x, y: cp.y, tx, ty };

        scheduleFrame(scaleRef.current, tx, ty);
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length === 0) {
        prevDistRef.current = null;
        prevMidRef.current = null;
        originRef.current = null;

        if (scaleRef.current <= 1.05) {
          el.style.touchAction = "pinch-zoom";
        }

        // Stop will-change to free GPU memory
        const inner = el.querySelector<HTMLElement>("[data-map-inner]");
        if (inner) {
          setTimeout(() => { if (inner) inner.style.willChange = "auto"; }, 300);
        }
      }

      // Handle single-tap / double-tap
      if (e.changedTouches.length === 1 && e.touches.length === 0) {
        const t = e.changedTouches[0];
        const now = Date.now();
        const cp = containerPoint(t.clientX, t.clientY);
        const last = lastTapRef.current;

        if (
          last &&
          now - last.t < DOUBLE_TAP_MS &&
          Math.abs(cp.x - last.x) < DOUBLE_TAP_PX &&
          Math.abs(cp.y - last.y) < DOUBLE_TAP_PX
        ) {
          // Double tap — cancel pending single tap
          if (tapTimerRef.current) { clearTimeout(tapTimerRef.current); tapTimerRef.current = null; }
          lastTapRef.current = null;

          // Toggle zoom 1× ↔ 2×
          const targetScale = scaleRef.current > 1.05 ? 1 : 2;
          if (targetScale === 1) {
            scaleRef.current = 1;
            txRef.current = 0;
            tyRef.current = 0;
            applyTransform(1, 0, 0, true);
            el.style.touchAction = "pinch-zoom";
          } else {
            const rect = el.getBoundingClientRect();
            // center on tap point
            const ox = (cp.x - txRef.current) / scaleRef.current;
            const oy = (cp.y - tyRef.current) / scaleRef.current;
            let newTx = cp.x - ox * targetScale;
            let newTy = cp.y - oy * targetScale;
            const clamped = clampTranslate(newTx, newTy, targetScale, rect.width, rect.height);
            scaleRef.current = targetScale;
            txRef.current = clamped.tx;
            tyRef.current = clamped.ty;
            applyTransform(targetScale, clamped.tx, clamped.ty, true);
            el.style.touchAction = "none";
          }
          commitState();
        } else {
          // Possible single tap — wait to rule out double tap
          lastTapRef.current = { t: now, x: cp.x, y: cp.y };
          if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

          const capturedX = cp.x;
          const capturedY = cp.y;
          tapTimerRef.current = setTimeout(() => {
            tapTimerRef.current = null;
            lastTapRef.current = null;
            // Fire country tap
            if (hitTest && onCountryTap) {
              // Convert container point to SVG viewBox space
              const slug = hitTest(capturedX, capturedY);
              if (slug) onCountryTap(slug);
            }
          }, DOUBLE_TAP_MS);
        }
      }

      if (e.touches.length < 2) {
        panStartRef.current = null;
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd,   { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      cancelInertia();
    };
  }, [applyTransform, clampTranslate, commitState, hitTest, maxScale, minScale, onCountryTap]);

  const transformStyle = `translate3d(${gestureState.translateX}px,${gestureState.translateY}px,0) scale(${gestureState.scale})`;
  const isZoomed = gestureState.scale > 1.05;

  return { gestureState, containerRef, transformStyle, isZoomed, resetView };
}
