"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ANALISIS_ALL } from "@/lib/analisis";
import { EJES } from "@/lib/ejes";
import { COUNTRY_NAMES } from "@/lib/country-data";

type Tab = "analisis" | "paises" | "ejes";

const TABS: { key: Tab; label: string }[] = [
  { key: "analisis", label: "Análisis" },
  { key: "paises",   label: "Países" },
  { key: "ejes",     label: "Ejes" },
];

interface Result {
  label: string;
  sublabel?: string;
  href: string;
}

function getResults(tab: Tab, query: string): Result[] {
  const q = query.toLowerCase().trim();

  if (tab === "analisis") {
    return ANALISIS_ALL
      .filter(a =>
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.axisName.toLowerCase().includes(q) ||
        a.lede.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map(a => ({
        label: a.title,
        sublabel: `${a.country} · ${a.axisName} · ${a.published_at}`,
        href: `/analisis/${a.countrySlug}/${a.slug}`,
      }));
  }

  if (tab === "paises") {
    return Object.entries(COUNTRY_NAMES)
      .filter(([, name]) => !q || name.toLowerCase().includes(q))
      .map(([slug, name]) => ({
        label: name,
        href: `/pais/${slug}`,
      }));
  }

  if (tab === "ejes") {
    return EJES
      .filter(e => !q || e.name.toLowerCase().includes(q) || e.definicion_corta?.toLowerCase().includes(q))
      .map(e => ({
        label: e.name,
        sublabel: e.definicion_corta?.slice(0, 80) + (e.definicion_corta && e.definicion_corta.length > 80 ? "…" : ""),
        href: `/ejes/${e.slug}`,
      }));
  }

  return [];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("analisis");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = getResults(tab, query);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const navigate = useCallback((href: string) => {
    close();
    router.push(href);
  }, [close, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !open && !["INPUT", "TEXTAREA"].includes((e.target as Element)?.tagName ?? "")) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "?" && !open) {
        // Keyboard shortcuts help — future feature
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query, tab]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    }
    if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].href);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(31, 42, 18, 0.85)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
      }}
      onClick={close}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: "var(--mi-bg-paper)",
          border: "var(--mi-border-bold)",
          boxShadow: "var(--mi-shadow-hero)",
          margin: "0 var(--mi-space-4)",
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Input */}
        <div style={{
          borderBottom: "var(--mi-border-dashed)",
          padding: "var(--mi-space-3) var(--mi-space-4)",
          display: "flex",
          alignItems: "center",
          gap: "var(--mi-space-3)",
        }}>
          <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: "var(--mi-text-sm)", color: "var(--mi-ink-mute)" }}>
            /
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar análisis, países, ejes…"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-lg)",
              color: "var(--mi-ink)",
            }}
          />
          <button
            onClick={close}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-sm)",
              color: "var(--mi-ink-mute)",
            }}
          >
            Esc
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          borderBottom: "var(--mi-border-dashed)",
          padding: "0 var(--mi-space-4)",
          display: "flex",
          gap: "var(--mi-space-2)",
        }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: "none",
                border: "none",
                borderBottom: tab === t.key ? "2px solid var(--mi-ink)" : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: tab === t.key ? "var(--mi-ink)" : "var(--mi-ink-mute)",
                padding: "var(--mi-space-2) var(--mi-space-2)",
                marginBottom: "-1px",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {results.length === 0 ? (
            <div style={{
              padding: "var(--mi-space-4)",
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              color: "var(--mi-ink-mute)",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "var(--mi-tracking-wide)",
            }}>
              Sin resultados
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.href}
                onClick={() => navigate(r.href)}
                style={{
                  width: "100%",
                  display: "block",
                  textAlign: "left",
                  background: i === selected ? "var(--mi-bg-cream)" : "none",
                  border: "none",
                  borderBottom: "var(--mi-border-soft)",
                  cursor: "pointer",
                  padding: "var(--mi-space-3) var(--mi-space-4)",
                }}
                onMouseEnter={() => setSelected(i)}
              >
                <div style={{
                  fontFamily: "var(--mi-font-body)",
                  fontSize: "var(--mi-text-base)",
                  color: "var(--mi-ink)",
                  marginBottom: r.sublabel ? "var(--mi-space-1)" : 0,
                }}>
                  {r.label}
                </div>
                {r.sublabel && (
                  <div style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    color: "var(--mi-ink-mute)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                  }}>
                    {r.sublabel}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          borderTop: "var(--mi-border-dashed)",
          padding: "var(--mi-space-2) var(--mi-space-4)",
          display: "flex",
          gap: "var(--mi-space-4)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
        }}>
          <span>↑↓ Navegar</span>
          <span>↵ Ir</span>
          <span>Esc Cerrar</span>
        </div>
      </div>
    </div>
  );
}
