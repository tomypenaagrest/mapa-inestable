import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  INDICATORS,
  LB_META,
  COVERED_COUNTRIES,
  axisDisplayKey,
} from "@/lib/latinobarometro";
import rawLecturas from "@/data/latinobarometro-2024/lecturas.json";
import IndicadorSelectorSheet from "@/components/IndicadorSelectorSheet";
import ComparadorRanking from "@/components/ComparadorRanking";
import "@/styles/mobile-restantes.css";

/* === CONSTANTES ================================================== */

const AXIS_ORDER = [
  { displayKey: "desrepresentacion", label: "Desrepresentación" },
  { displayKey: "mediaciones",       label: "Erosión de mediaciones" },
  { displayKey: "desorientacion",    label: "Desorientación epistemológica" },
  { displayKey: "deculturacion",     label: "Deculturación" },
  { displayKey: "atencion",          label: "Atención" },
  { displayKey: "contexto",          label: "Contexto" },
] as const;

type Lectura = { sintesis: string; por_que_importa: string };
const LECTURAS = rawLecturas as Record<string, Lectura>;

/* === STATIC PARAMS =============================================== */

export function generateStaticParams() {
  return INDICATORS.map(ind => ({ indicador: ind.id }));
}

/* === METADATA ==================================================== */

export async function generateMetadata(
  { params }: { params: Promise<{ indicador: string }> }
): Promise<Metadata> {
  const { indicador } = await params;
  const ind = INDICATORS.find(i => i.id === indicador);
  if (!ind) return {};
  return {
    title: { absolute: `${ind.label} — Comparar · Mapa Inestable` },
    description: `Ranking de ${ind.label} en 17 países latinoamericanos. Latinobarómetro 2024.`,
  };
}

/* === PAGE ======================================================== */

export default async function ComparePage(
  { params }: { params: Promise<{ indicador: string }> }
) {
  const { indicador } = await params;
  const ind = INDICATORS.find(i => i.id === indicador);
  if (!ind) redirect("/comparar/apoyo-democracia");

  const axisKey   = axisDisplayKey(ind.axis);
  const isScale   = ind.unit === "escala 0-10";
  const maxVal    = isScale ? 10 : 100;
  const regPct    = (ind.regional_value / maxVal) * 100;
  const axisLabel = AXIS_ORDER.find(a => a.displayKey === axisKey)?.label ?? axisKey;
  const lectura   = LECTURAS[ind.id] as Lectura | undefined;

  const countries = Object.entries(ind.by_country)
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => b.value - a.value);

  const valueStr = (v: number) =>
    isScale ? v.toFixed(1) : `${v.toFixed(1)}%`;
  const regStr = isScale
    ? ind.regional_value.toFixed(1)
    : `${Math.round(ind.regional_value)}%`;

  /* Shape countries for mobile ranking */
  const mobileCountries = countries.map(c => ({
    code:    c.code,
    name:    c.name,
    value:   c.value,
    covered: (COVERED_COUNTRIES as readonly string[]).includes(c.code.toLowerCase()),
  }));

  return (
    <>
      {/* Mobile — Patrón C */}
      <div className="mr-mobile-only" style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>
        <IndicadorSelectorSheet
          indicators={INDICATORS}
          currentId={indicador}
          currentLabel={ind.label}
        />
        <ComparadorRanking
          axisKey={axisKey}
          axisLabel={axisLabel}
          indicatorLabel={ind.label}
          questionText={ind.question_text}
          lectura={lectura}
          countries={mobileCountries}
          regionalValue={ind.regional_value}
          regionalStr={regStr}
          unit={ind.unit}
          waveLabel={LB_META.wave_label}
        />
      </div>

      {/* Desktop */}
      <div className="mr-desktop-only" style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

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
        gap: "var(--mi-space-4)",
        alignItems: "center",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <span style={{ color: "var(--mi-ink-mute)" }}>·</span>
        <span style={{ color: "var(--mi-ink-soft)" }}>Datos · Latinobarómetro 2024</span>
        <span style={{ color: "var(--mi-ink-mute)" }}>·</span>
        <span style={{ color: "var(--mi-accent-gold)" }}>{ind.label}</span>
      </div>

      {/* Hero */}
      <div style={{
        background: "var(--mi-bg)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
        position: "relative",
        overflow: "hidden",
      }} className="mi-grain">
        {/* Axis top bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 6,
          background: `var(--mi-axis-${axisKey})`,
        }} />

        <div className="mi-container">
          <div style={{
            display: "inline-block",
            background: `var(--mi-axis-${axisKey})`,
            color: "var(--mi-bg-paper)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            padding: "2px 8px",
            marginBottom: "var(--mi-space-3)",
          }}>
            {axisLabel}
          </div>

          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-3xl)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            marginBottom: "var(--mi-space-4)",
            maxWidth: 680,
          }}>
            {ind.label}
          </h1>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--mi-space-5)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
          }}>
            <span>
              Promedio regional ·{" "}
              <strong style={{ color: "var(--mi-ink)", fontFamily: "var(--mi-font-display)", fontSize: 18 }}>
                {regStr}
              </strong>
            </span>
            <span>{countries.length} países</span>
            <span>{LB_META.wave_label} · {LB_META.fieldwork}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mi-container" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "var(--mi-space-7)",
        alignItems: "start",
      }}>

        {/* ── Sidebar: selector de indicadores ───────────────────── */}
        <aside style={{ position: "sticky", top: "var(--mi-space-5)" }}>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-4)",
          }}>
            12 indicadores
          </div>

          {AXIS_ORDER.map(axis => {
            const group = INDICATORS.filter(
              i => axisDisplayKey(i.axis) === axis.displayKey
            );
            if (group.length === 0) return null;
            return (
              <div key={axis.displayKey} style={{ marginBottom: "var(--mi-space-4)" }}>
                {/* Axis label */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--mi-space-2)",
                  marginBottom: "var(--mi-space-2)",
                  paddingLeft: "var(--mi-space-2)",
                }}>
                  <div style={{
                    width: 8, height: 8,
                    background: `var(--mi-axis-${axis.displayKey})`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink-mute)",
                  }}>
                    {axis.label}
                  </span>
                </div>

                {group.map(i => {
                  const isActive = i.id === ind.id;
                  return (
                    <Link
                      key={i.id}
                      href={`/comparar/${i.id}`}
                      style={{
                        display: "block",
                        padding: "6px 8px 6px 16px",
                        borderLeft: isActive
                          ? `3px solid var(--mi-axis-${axis.displayKey})`
                          : "3px solid transparent",
                        background: isActive ? "var(--mi-bg-cream)" : "transparent",
                        fontFamily: "var(--mi-font-body)",
                        fontSize: "var(--mi-text-sm)",
                        lineHeight: 1.4,
                        color: isActive ? "var(--mi-ink)" : "var(--mi-ink-soft)",
                        marginBottom: 2,
                      }}
                    >
                      {i.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </aside>

        {/* ── Main: ranking ──────────────────────────────────────── */}
        <main>

          {/* Pregunta de encuesta */}
          <div style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-sm)",
            color: "var(--mi-ink-soft)",
            fontStyle: "italic",
            lineHeight: "var(--mi-leading-relaxed)",
            paddingLeft: "var(--mi-space-3)",
            borderLeft: `3px solid var(--mi-axis-${axisKey})`,
            marginBottom: "var(--mi-space-5)",
          }}>
            {ind.question_text}
          </div>

          {/* Header de tabla */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 200px 80px",
            gap: "var(--mi-space-3)",
            paddingBottom: "var(--mi-space-2)",
            borderBottom: "var(--mi-border-thick)",
            marginBottom: "var(--mi-space-2)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            <span>#</span>
            <span>País</span>
            <span>Comparación regional</span>
            <span style={{ textAlign: "right" }}>Valor</span>
          </div>

          {/* Filas del ranking */}
          {countries.map((country, idx) => {
            const slug     = country.code.toLowerCase();
            const isCov    = (COVERED_COUNTRIES as readonly string[]).includes(slug);
            const barPct   = (country.value / maxVal) * 100;
            const isTop    = idx === 0;
            const isBottom = idx === countries.length - 1;

            return (
              <div
                key={country.code}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 200px 80px",
                  gap: "var(--mi-space-3)",
                  padding: "var(--mi-space-2) 0",
                  borderBottom: "var(--mi-border-soft)",
                  alignItems: "center",
                }}
              >
                {/* Posición */}
                <span style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  color: isTop
                    ? "var(--mi-accent-warn)"
                    : isBottom
                    ? "var(--mi-ink-mute)"
                    : "var(--mi-ink-mute)",
                  fontWeight: isTop ? 700 : 400,
                }}>
                  {idx + 1}
                </span>

                {/* País */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--mi-space-3)",
                  fontFamily: "var(--mi-font-body)",
                  fontSize: "var(--mi-text-sm)",
                  color: "var(--mi-ink)",
                }}>
                  <span>{country.name}</span>
                  {isCov && (
                    <Link
                      href={`/pais/${slug}`}
                      style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: 10,
                        letterSpacing: "var(--mi-tracking-wide)",
                        textTransform: "uppercase",
                        color: "var(--mi-ink-mute)",
                        borderBottom: "1px solid var(--mi-rule-soft)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Ficha →
                    </Link>
                  )}
                </div>

                {/* Barra */}
                <div style={{
                  position: "relative",
                  height: 18,
                  background: "var(--mi-bg-cream)",
                  border: "var(--mi-border-hair)",
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0, bottom: 0, left: 0,
                    width: `${barPct}%`,
                    background: `var(--mi-axis-${axisKey})`,
                    opacity: isCov ? 1 : 0.4,
                  }} />
                  {/* Línea promedio regional */}
                  <div style={{
                    position: "absolute",
                    top: -3, bottom: -3,
                    left: `${regPct}%`,
                    width: 2,
                    background: "var(--mi-ink)",
                    opacity: 0.35,
                  }} />
                </div>

                {/* Valor */}
                <div style={{
                  fontFamily: "var(--mi-font-display)",
                  fontSize: "var(--mi-text-lg)",
                  lineHeight: 1,
                  color: "var(--mi-ink)",
                  textAlign: "right",
                }}>
                  {valueStr(country.value)}
                </div>
              </div>
            );
          })}

          {/* Leyenda promedio regional */}
          <div style={{
            marginTop: "var(--mi-space-3)",
            display: "flex",
            alignItems: "center",
            gap: "var(--mi-space-2)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            <div style={{
              width: 2, height: 14,
              background: "var(--mi-ink)",
              opacity: 0.35,
            }} />
            <span>Promedio regional · {regStr}</span>
          </div>

          {/* Lectura curada */}
          {lectura && (
            <div style={{
              marginTop: "var(--mi-space-6)",
              padding: "var(--mi-space-5)",
              background: "var(--mi-bg-cream)",
              border: "var(--mi-border-thick)",
              boxShadow: "var(--mi-shadow-card)",
            }}>
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-widest)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                marginBottom: "var(--mi-space-3)",
              }}>
                Lectura editorial
              </div>
              <p style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-base)",
                lineHeight: "var(--mi-leading-normal)",
                color: "var(--mi-ink)",
                marginBottom: "var(--mi-space-3)",
              }}>
                {lectura.sintesis}
              </p>
              <p style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-sm)",
                lineHeight: "var(--mi-leading-relaxed)",
                color: "var(--mi-ink-soft)",
              }}>
                {lectura.por_que_importa}
              </p>
            </div>
          )}

          {/* Footer fuente */}
          <div style={{
            marginTop: "var(--mi-space-6)",
            padding: "var(--mi-space-4)",
            background: "var(--mi-bg-cream)",
            border: "var(--mi-border-thick)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "var(--mi-space-4)",
            alignItems: "center",
          }}>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink)",
              lineHeight: 1.6,
            }}>
              <strong>Fuente</strong> · {LB_META.wave_label} · Informe &quot;La democracia resiliente&quot; · Diciembre 2024<br />
              Encuesta presencial a {LB_META.n_total.toLocaleString("es-AR")} personas en 17 países · Margen de error ±3% por país
            </div>
            <a
              href={LB_META.codebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mi-btn"
              style={{ whiteSpace: "nowrap" }}
            >
              Informe completo →
            </a>
          </div>

        </main>
      </div>

      </div> {/* end mr-desktop-only */}
    </>
  );
}
