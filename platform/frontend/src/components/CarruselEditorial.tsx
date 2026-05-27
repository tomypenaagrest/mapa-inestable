"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import CountrySilhouette from "./CountrySilhouette";
import { useReaderState } from "@/hooks/useReaderState";

export interface CarruselSlide {
  slug: string;
  countrySlug: string;
  country: string;
  axis: string;
  axisKey: string;
  title: string;
  lede: string;
  date: string;
  publishedIso?: string;
  href?: string;
}

const INTERVAL = 5000;

export default function CarruselEditorial({ slides }: { slides: CarruselSlide[] }) {
  const [idx, setIdx]         = useState(0);
  const [paused, setPaused]   = useState(false);
  const [noMotion, setNoMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { isNewSince, isRead } = useReaderState();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setNoMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setNoMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Usa offsetLeft del card para que funcione con cualquier ancho (mobile full-width o desktop 320px)
  const scrollToCard = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: noMotion ? "instant" : "smooth" });
    }
  }, [noMotion]);

  const advance = useCallback(() => {
    setIdx(prev => {
      const next = (prev + 1) % slides.length;
      scrollToCard(next);
      return next;
    });
  }, [slides.length, scrollToCard]);

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

  const goTo = (i: number) => {
    setIdx(i);
    scrollToCard(i);
    resetTimer();
  };

  return (
    <div
      className="mi-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="mi-carousel-track">
        {slides.map((s, i) => {
          const slugKey = `${s.countrySlug}-${s.publishedIso?.slice(0, 4)}-w${s.publishedIso ? getWeekNumber(s.publishedIso) : ""}`;
          const isNew   = s.publishedIso ? isNewSince(s.publishedIso) : false;
          const read    = isRead(slugKey);

          return (
            <div
              key={s.slug}
              className={`mi-carousel-card${i === idx ? " mi-carousel-card--active" : ""}`}
              aria-hidden={Math.abs(i - idx) > 1}
              style={{ opacity: read ? 0.65 : undefined }}
            >
              {/* New dot */}
              {isNew && (
                <div
                  aria-label="Nuevo desde tu última visita"
                  style={{
                    position:     "absolute",
                    top:          8,
                    right:        8,
                    width:        8,
                    height:       8,
                    borderRadius: "50%",
                    background:   "var(--mi-accent-gold)",
                    zIndex:       2,
                  }}
                />
              )}

              <div className="mi-carousel-silhouette">
                <CountrySilhouette country={s.countrySlug} height={120} color="var(--mi-bg-paper)" />
              </div>

              <div className="mi-carousel-body">
                <div className="mi-carousel-meta">
                  {read && <span style={{ color: "var(--mi-accent-gold)", marginRight: 4 }}>✓</span>}
                  {s.country} · {s.axis} · {s.date}
                </div>
                <h2
                  className="mi-carousel-title"
                  style={{ color: read ? "var(--mi-ink-mute)" : undefined }}
                >
                  {s.title}
                </h2>
                <p className="mi-carousel-lede">{s.lede}</p>
                <Link
                  href={s.href ?? `/analisis/${s.countrySlug}/${s.slug}`}
                  className="mi-carousel-cta"
                >
                  Leer →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="mi-carousel-dots" role="tablist" aria-label="Seleccionar análisis">
          {slides.map((s, i) => {
            const isNew = s.publishedIso ? isNewSince(s.publishedIso) : false;
            return (
              <button
                key={s.slug}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Análisis ${i + 1}: ${s.title}`}
                className={`mi-carousel-dot${i === idx ? " mi-carousel-dot--active" : ""}`}
                onClick={() => goTo(i)}
                style={{ position: "relative" }}
              >
                {isNew && (
                  <span style={{
                    position:     "absolute",
                    top:          -2,
                    right:        -2,
                    width:        5,
                    height:       5,
                    borderRadius: "50%",
                    background:   "var(--mi-accent-gold)",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getWeekNumber(isoDate: string): number {
  const d = new Date(isoDate);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
}
