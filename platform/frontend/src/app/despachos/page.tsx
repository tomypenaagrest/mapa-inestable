import Link from "next/link";
import type { Metadata } from "next";
import { DESPACHOS_ALL, type Dispatch } from "@/lib/despachos";

export const metadata: Metadata = {
  title: "Despachos",
  description: "Integración semanal de los análisis de Mapa Inestable. Una lectura del período que pone en relación lo que ocurrió en distintos países bajo el mismo marco conceptual.",
};

/* === COMPONENTES ================================================ */

function DispatchCard({ d }: { d: Dispatch }) {
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
          {String(d.num).padStart(2, "0")}
        </span>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            {d.date_range}
          </div>
          {d.blocks && (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              {d.blocks.filter(b => b.type === "analysis").length} análisis
            </div>
          )}
        </div>
      </div>

      {/* Título + snippet */}
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
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-sm)",
          lineHeight: "var(--mi-leading-relaxed)",
          color: "var(--mi-ink-soft)",
        }}>
          {d.entrada.length > 160 ? d.entrada.slice(0, 157) + "…" : d.entrada}
        </p>
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
        <span>{DESPACHOS_ALL.length} ediciones publicadas</span>
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
            Archivo · Año II
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

      {/* Grilla */}
      <div className="mi-container" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-5)",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--mi-space-5)",
      }}>
        {DESPACHOS_ALL.map(d => (
          <DispatchCard key={`${d.year}-${d.week}`} d={d} />
        ))}
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
