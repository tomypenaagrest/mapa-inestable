"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import CountrySilhouette from "./CountrySilhouette";

export interface CarruselSlide {
  slug: string;
  countrySlug: string;
  country: string;
  axis: string;
  axisKey: string;
  title: string;
  lede: string;
  date: string;
}

const INTERVAL = 8000;

export default function CarruselEditorial({ slides }: { slides: CarruselSlide[] }) {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const [noMotion, setNoMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setNoMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setNoMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const advance = useCallback(() => setIdx(i => (i + 1) % slides.length), [slides.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (!noMotion && !paused && slides.length > 1) {
      timerRef.current = setInterval(advance, INTERVAL);
    }
  }, [noMotion, paused, slides.length, advance]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = (i: number) => { setIdx(i); resetTimer(); };

  return (
    <div
      className="mi-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.slug}
          className={`mi-carousel-slide${i === idx ? " mi-carousel-slide--active" : ""}`}
          aria-hidden={i !== idx}
        >
          {/* Silueta */}
          <div className="mi-carousel-silhouette">
            <CountrySilhouette country={s.countrySlug} height={180} color="var(--mi-bg-paper)" />
          </div>

          {/* Texto */}
          <div className="mi-carousel-body">
            <div className="mi-carousel-meta">
              {s.country} · {s.axis} · {s.date}
            </div>
            <h2 className="mi-carousel-title">{s.title}</h2>
            <p className="mi-carousel-lede">{s.lede}</p>
            <Link
              href={`/analisis/${s.countrySlug}/${s.slug}`}
              className="mi-carousel-cta"
            >
              Leer →
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="mi-carousel-dots" role="tablist" aria-label="Seleccionar análisis">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Análisis ${i + 1}: ${s.title}`}
              className={`mi-carousel-dot${i === idx ? " mi-carousel-dot--active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
