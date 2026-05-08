import Link from "next/link";

/* === TIPOS ====================================================== */

interface DispatchSummary {
  year: number;
  week: number;
  num: number;
  title: string;
  entrada_snippet: string;
  date_range: string;
  analysis_count: number;
}

/* === DATOS MOCK ================================================= */

const MOCK_DISPATCHES: DispatchSummary[] = [
  {
    year: 2026, week: 17, num: 47,
    title: "La sospecha como arma",
    entrada_snippet: "Esta semana el mapa político de Sudamérica se movió en una dirección que no habíamos visto: la retórica del fraude preventivo cruzó la frontera ideológica. Ya no es solo la derecha populista.",
    date_range: "21–27 abr 2026",
    analysis_count: 3,
  },
  {
    year: 2026, week: 15, num: 46,
    title: "Los territorios sin Estado",
    entrada_snippet: "Hay zonas en el continente donde el Estado nunca llegó y otras donde llegó pero se retiró. Esta semana se movieron ambas fronteras simultáneamente.",
    date_range: "7–13 abr 2026",
    analysis_count: 2,
  },
  {
    year: 2026, week: 13, num: 45,
    title: "El trabajo que no existe",
    entrada_snippet: "Las reformas laborales que no avanzan revelan algo más profundo que la resistencia sindical: revelan la mutación del trabajo como categoría organizadora de la vida.",
    date_range: "24–30 mar 2026",
    analysis_count: 4,
  },
  {
    year: 2026, week: 10, num: 44,
    title: "La representación en suspenso",
    entrada_snippet: "Cuando los partidos no representan y las instituciones se vacían de sentido, la democracia sigue funcionando formalmente pero pierde densidad simbólica.",
    date_range: "3–9 mar 2026",
    analysis_count: 3,
  },
];

/* === COMPONENTES ================================================ */

function DispatchCard({ d }: { d: DispatchSummary }) {
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
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            {d.analysis_count} análisis
          </div>
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
          {d.entrada_snippet}
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
        <span>{MOCK_DISPATCHES.length} ediciones publicadas</span>
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
        paddingBottom: "var(--mi-space-8)",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--mi-space-5)",
      }}>
        {MOCK_DISPATCHES.map(d => (
          <DispatchCard key={`${d.year}-${d.week}`} d={d} />
        ))}
      </div>

    </div>
  );
}
