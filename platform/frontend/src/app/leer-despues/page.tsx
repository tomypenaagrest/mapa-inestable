"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useReaderState } from "@/hooks/useReaderState";
import { ANALISIS_ALL } from "@/lib/analisis";

export default function LeerDespuesPage() {
  const { state, toggleSaved } = useReaderState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const saved = mounted && state
    ? ANALISIS_ALL.filter(a => state.saved.includes(`${a.countrySlug}-${a.year}-w${a.week}`))
    : [];

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      <div style={{
        background: "var(--mi-ink)",
        color: "var(--mi-bg-paper)",
        padding: `6px var(--mi-space-6)`,
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
      }}>
        <span style={{ color: "var(--mi-accent-gold)" }}>★</span>
        {" "}Lista de lectura · este navegador
      </div>

      <div className="mi-container--narrow" style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-8)" }}>

        <h1 style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "var(--mi-text-3xl)",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-3)",
        }}>
          Leer después
        </h1>

        <p style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-6)",
        }}>
          Guardado en este navegador — sin cuenta, sin sincronización.
        </p>

        {!mounted ? (
          <div style={{ color: "var(--mi-ink-mute)", fontFamily: "var(--mi-font-mono)", fontSize: "var(--mi-text-xs)", textTransform: "uppercase", letterSpacing: "var(--mi-tracking-wide)" }}>
            Cargando…
          </div>
        ) : saved.length === 0 ? (
          <div style={{
            border: "var(--mi-border-dashed)",
            padding: "var(--mi-space-5)",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-widest)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
              marginBottom: "var(--mi-space-3)",
            }}>
              Sin análisis guardados
            </div>
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-base)",
              color: "var(--mi-ink-soft)",
              marginBottom: "var(--mi-space-4)",
            }}>
              Guardá análisis desde cualquier página usando el botón ★.
            </p>
            <Link href="/analisis" className="mi-btn">
              Explorar análisis →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-4)" }}>
            {saved.map(a => {
              const slugKey = `${a.countrySlug}-${a.year}-w${a.week}`;
              return (
                <div
                  key={a.slug}
                  style={{
                    border: "var(--mi-border-thick)",
                    boxShadow: "var(--mi-shadow-card)",
                    background: "var(--mi-bg-paper)",
                    padding: "var(--mi-space-4)",
                    display: "flex",
                    gap: "var(--mi-space-4)",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-xs)",
                      letterSpacing: "var(--mi-tracking-wide)",
                      textTransform: "uppercase",
                      color: "var(--mi-ink-mute)",
                      marginBottom: "var(--mi-space-1)",
                    }}>
                      {a.country} · {a.axisName} · {a.published_at}
                    </div>
                    <Link
                      href={`/analisis/${a.countrySlug}/${a.slug}`}
                      style={{
                        fontFamily: "var(--mi-font-title)",
                        fontWeight: 700,
                        fontSize: "var(--mi-text-xl)",
                        color: "var(--mi-ink)",
                        display: "block",
                        marginBottom: "var(--mi-space-2)",
                      }}
                    >
                      {a.title}
                    </Link>
                    <p style={{
                      fontFamily: "var(--mi-font-body)",
                      fontSize: "var(--mi-text-base)",
                      color: "var(--mi-ink-soft)",
                      lineHeight: "var(--mi-leading-normal)",
                    }}>
                      {a.lede}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSaved(slugKey)}
                    title="Quitar de la lista"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-base)",
                      color: "var(--mi-accent-gold)",
                      padding: "var(--mi-space-1)",
                      flexShrink: 0,
                    }}
                  >
                    ★
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
