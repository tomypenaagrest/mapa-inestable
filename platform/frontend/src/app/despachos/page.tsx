import Link from "next/link";
import type { Metadata } from "next";
import { getAllDispatches, type DispatchMeta } from "@/lib/despachos";
import { EJES } from "@/lib/ejes";

export const metadata: Metadata = {
  title: "Despachos",
  description: "Integración semanal de los análisis de Mapa Inestable. Una lectura del período que pone en relación lo que ocurrió en distintos países bajo el mismo marco conceptual.",
};

/* === COMPONENTES ================================================ */

function DispatchCard({ d }: { d: DispatchMeta }) {
  const ejesNames = d.ejesActivados
    .map(k => EJES.find(e => e.axisKey === k))
    .filter(Boolean);

  return (
    <article style={{
      border: "var(--mi-border-thick)",
      background: "var(--mi-bg-paper)",
      padding: "var(--mi-space-5)",
      boxShadow: "var(--mi-shadow-card)",
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gap: "var(--mi-space-3)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderBottom: "var(--mi-border-dashed)",
        paddingBottom: "var(--mi-space-3)",
      }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-3xl)",
          fontWeight: 400,
          color: "var(--mi-bg-cream)",
          lineHeight: 1,
          userSelect: "none",
        }}>
          {String(d.number).padStart(2, "0")}
        </span>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            {d.published_at}
          </div>
          {ejesNames.length > 0 && (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              {ejesNames.length} eje{ejesNames.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Título + subtítulo */}
      <div>
        <h2 style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "var(--mi-text-2xl)",
          lineHeight: "var(--mi-leading-snug)",
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-3)",
        }}>
          {d.title}
        </h2>
        {d.subtitle && (
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-sm)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink-soft)",
          }}>
            {d.subtitle.length > 160 ? d.subtitle.slice(0, 157) + "…" : d.subtitle}
          </p>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/despachos/${d.year}/${d.week}`}
        style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wider)",
          textTransform: "uppercase",
          color: "var(--mi-ink)",
          borderBottom: "2px solid var(--mi-ink)",
          paddingBottom: 2,
          alignSelf: "end",
          justifySelf: "start",
        }}
      >
        Leer despacho →
      </Link>
    </article>
  );
}

/* === PAGE ====================================================== */

export default function DespachoListPage() {
  const dispatches = getAllDispatches();

  return (
    <div style={{ background: "var(--mi-bg)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background: "var(--mi-ink)",
        color: "var(--mi-bg-paper)",
        padding: `6px var(--mi-space-6)`,
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display: "flex",
        gap: "var(--mi-space-6)",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Despachos semanales</span>
        {dispatches.length > 0 && (
          <span>{dispatches.length} ediciones publicadas</span>
        )}
      </div>

      {/* Header */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }} className="mi-grain">
        <div className="mi-container">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
            opacity: 0.55,
            marginBottom: "var(--mi-space-3)",
          }}>
            Archivo
          </div>
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-5xl)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
          }}>
            Despachos
          </h1>
        </div>
      </div>

      {/* Grilla o placeholder */}
      <div className="mi-container" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-5)",
      }}>
        {dispatches.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--mi-space-5)",
          }}>
            {dispatches.map(d => (
              <DispatchCard key={`${d.year}-${d.week}`} d={d} />
            ))}
          </div>
        ) : (
          <p style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
            opacity: 0.5,
          }}>
            AÚN NO HAY DESPACHOS PUBLICADOS.<br />
            El próximo cierra el domingo.
          </p>
        )}
      </div>

      {/* Recibir por email */}
      <div className="mi-container" style={{ paddingBottom: "var(--mi-space-8)" }}>
        <div style={{
          borderTop: "var(--mi-border-dashed)",
          paddingTop: "var(--mi-space-5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--mi-space-5)",
          flexWrap: "wrap",
        }}>
          <p style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
            opacity: 0.7,
          }}>
            Los despachos también llegan por email
          </p>
          <a
            href="https://mapainestable.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wider)",
              textTransform: "uppercase",
              color: "var(--mi-accent-gold)",
              borderBottom: "1px solid var(--mi-accent-gold)",
              paddingBottom: 2,
            }}
          >
            Suscribirse en Substack ↗
          </a>
        </div>
      </div>

    </div>
  );
}
