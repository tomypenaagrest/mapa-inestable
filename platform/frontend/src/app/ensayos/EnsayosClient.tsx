"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EssayCard, { type EssayEntry } from "@/components/EssayCard";

const AXES = [
  { key: "deculturacion",     label: "Deculturación" },
  { key: "mediaciones",       label: "Erosión de mediaciones" },
  { key: "desrepresentacion", label: "Desrepresentación" },
  { key: "estetizacion",      label: "Estetización" },
  { key: "desorientacion",    label: "Desorientación epist." },
  { key: "atencion",          label: "Atención" },
];

interface Props {
  essays: EssayEntry[];
}

export default function EnsayosClient({ essays }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeAxes = (searchParams.get("eje") ?? "")
    .split(",")
    .filter(Boolean);

  const toggleAxis = useCallback((key: string) => {
    const current = (searchParams.get("eje") ?? "").split(",").filter(Boolean);
    const next = current.includes(key)
      ? current.filter(k => k !== key)
      : [...current, key];
    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("eje");
    } else {
      params.set("eje", next.join(","));
    }
    const qs = params.toString();
    router.replace(qs ? `/ensayos?${qs}` : "/ensayos", { scroll: false });
  }, [router, searchParams]);

  const clearFilters = useCallback(() => {
    router.replace("/ensayos", { scroll: false });
  }, [router]);

  const filtered = activeAxes.length > 0
    ? essays.filter(e => activeAxes.includes(e.axisKey))
    : essays;

  const hero = filtered.find(e => e.featured) ?? filtered[0] ?? null;
  const rest = filtered.filter(e => e !== hero);

  const activeAxisLabels = activeAxes
    .map(a => AXES.find(ax => ax.key === a)?.label ?? a)
    .join(" + ");

  return (
    <>
      {/* ── Filtros ────────────────────────────────────────────── */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-4) var(--mi-space-6)",
        display: "flex",
        gap: "var(--mi-space-2)",
        flexWrap: "wrap",
        alignItems: "center",
        background: "var(--mi-bg-paper)",
      }}>
        <button
          onClick={clearFilters}
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "4px 14px",
            border: activeAxes.length === 0
              ? "var(--mi-border-bold)"
              : "1px solid var(--mi-ink)",
            background: activeAxes.length === 0 ? "var(--mi-ink)" : "transparent",
            color: activeAxes.length === 0 ? "var(--mi-bg-paper)" : "var(--mi-ink-mute)",
            cursor: "pointer",
          }}
        >
          Todos
        </button>
        {AXES.map(({ key, label }) => {
          const isActive = activeAxes.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleAxis(key)}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "4px 14px",
                border: isActive
                  ? `2px solid var(--mi-axis-${key})`
                  : "1px solid var(--mi-ink)",
                background: isActive ? `var(--mi-axis-${key})` : "transparent",
                color: isActive ? "var(--mi-bg-paper)" : "var(--mi-ink-mute)",
                cursor: "pointer",
                transition: "background 100ms, color 100ms",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Contenido ──────────────────────────────────────────── */}
      <div style={{
        padding: "0 var(--mi-space-6)",
        paddingBottom: "160px",
        background: "var(--mi-bg-paper)",
      }}>

        {/* Hero */}
        {hero && (
          <div style={{ padding: "64px 0", borderBottom: rest.length > 0 ? "var(--mi-border-bold)" : "none" }}>
            <EssayCard essay={hero} variant="hero" />
          </div>
        )}

        {/* Estado vacío */}
        {filtered.length === 0 && (
          <div style={{ paddingTop: "96px" }}>
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-sm)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
              marginBottom: "var(--mi-space-4)",
              maxWidth: "56ch",
              lineHeight: 1.6,
            }}>
              No hay ensayos que trabajen {activeAxisLabels} todavía.
              Estos ejes aparecen en los análisis semanales.
            </p>
            <button
              onClick={clearFilters}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
                background: "none",
                border: "none",
                borderBottom: "2px solid var(--mi-ink)",
                padding: "0 0 2px",
                cursor: "pointer",
              }}
            >
              Ver todos los ensayos →
            </button>
          </div>
        )}

        {/* Grid de miniaturas */}
        {rest.length > 0 && (
          <div className="mi-essay-grid" style={{ paddingTop: "96px" }}>
            {rest.map(essay => (
              <EssayCard key={essay.slug} essay={essay} variant="thumbnail" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
