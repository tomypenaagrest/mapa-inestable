import Link from "next/link";
import type { Metadata } from "next";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import { ANALISIS_ALL } from "@/lib/analisis";

export async function generateMetadata(
  { params }: { params: Promise<{ pais: string; slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const a = ANALISIS_ALL.find(x => x.slug === slug);
  if (!a) return {};
  return {
    title: { absolute: `${a.title} — Mapa Inestable` },
    description: a.lede,
    openGraph: {
      title: `${a.title} — Mapa Inestable`,
      description: a.lede,
    },
  };
}

/* === TIPOS ====================================================== */

interface Source {
  url: string;
  medium: string;
  author?: string;
  published_at: string;
}

interface Analysis {
  country: string;
  countrySlug: string;
  axis: string;
  axisKey: string;
  title: string;
  lede: string;
  step_disparador: string;
  step_desplazamiento: string;
  step_conceptualizacion: string;
  step_apertura: string;
  source_primary: Source;
  reading_time_min: number;
  published_at: string;
}

/* === DATOS MOCK (reemplazar por fetch al backend) ============== */

const MOCK_ANALYSIS: Analysis = {
  country: "Colombia",
  countrySlug: "co",
  axis: "Desorientación epistemológica",
  axisKey: "desorientacion",
  title: "La sospecha antes del voto",
  lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Lo nuevo no es el discurso —es de Trump, Bolsonaro, Milei— sino que ahora sea pronunciado por la izquierda.",
  step_disparador: "El 22 de abril de 2026, Gustavo Petro publicó en X una serie de mensajes cuestionando la capacidad del Consejo Nacional Electoral de garantizar elecciones limpias. Citó sin evidencia el precedente de fraude en 2022 —del que él resultó ganador— y llamó a sus seguidores a \"defender la victoria antes de que se la roben\". La Registraduría desmintió las acusaciones en horas. Los medios hegemónicos lo trataron como otra declaración errática del presidente. Los medios afines lo amplificaron como denuncia legítima.",
  step_desplazamiento: "Lo que Petro hace no es describir una amenaza real de fraude: está instalando el marco. Cuando un candidato introduce la sospecha sistemática antes del voto, cualquier resultado adverso puede leerse como confirmación de esa sospecha. Es una asimetría narrativa perfecta: si gana, validó el proceso; si pierde, validó la denuncia. Esta lógica no es nueva —Trump en 2020, Bolsonaro en 2022, Milei en cada derrota parcial— pero su aparición en el campo progresista latinoamericano marca un umbral. La retórica del fraude preventivo ya no tiene dueño ideológico.",
  step_conceptualizacion: "El eje de Desorientación epistemológica se activa aquí en su forma más aguda: no como confusión involuntaria, sino como estrategia deliberada. La función de la sospecha preventiva no es informar —no aporta evidencia— sino reencuadrar. Transforma el voto de acto democrático en escenario de disputa donde la verdad del resultado queda en suspenso indefinido. Lo que pierde no es la credibilidad de Petro: lo que pierde es el procedimiento electoral como árbitro compartido. Cuando el perdedor puede invocar siempre el fraude, el voto deja de ser la instancia de cierre que define la democracia representativa.",
  step_apertura: "¿Puede una democracia sostenerse cuando el procedimiento que la funda —el voto— ya no opera como árbitro? ¿O estamos ante el comienzo del fin de la idea de que los números cierran la política?",
  source_primary: {
    url: "https://lasillavacia.com/silla-nacional/petro-siembra-sospecha-electoral/",
    medium: "La Silla Vacía",
    author: "Laura Dulce Romero",
    published_at: "27 abr 2026",
  },
  reading_time_min: 8,
  published_at: "27 abr 2026",
};

/* === COMPONENTES ================================================ */

const STEPS = [
  { key: "step_disparador" as const,       num: "01", label: "Disparador" },
  { key: "step_desplazamiento" as const,   num: "02", label: "Desplazamiento" },
  { key: "step_conceptualizacion" as const,num: "03", label: "Conceptualización" },
  { key: "step_apertura" as const,         num: "04", label: "Apertura" },
];

function StepBlock({ num, label, body }: { num: string; label: string; body: string }) {
  return (
    <div style={{
      border: "var(--mi-border-thick)",
      boxShadow: "var(--mi-shadow-card)",
      background: "var(--mi-bg-paper)",
      marginBottom: "var(--mi-space-5)",
    }}>
      {/* Header del paso */}
      <div style={{
        borderBottom: "var(--mi-border-dashed)",
        padding: "var(--mi-space-3) var(--mi-space-4)",
        display: "flex",
        alignItems: "baseline",
        gap: "var(--mi-space-3)",
      }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-3xl)",
          fontWeight: 400,
          color: "var(--mi-bg-cream)",
          lineHeight: 1,
          userSelect: "none",
        }}>
          {num}
        </span>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
        }}>
          {label}
        </span>
      </div>

      {/* Cuerpo */}
      <div style={{
        padding: "var(--mi-space-4) var(--mi-space-4) var(--mi-space-5)",
        fontFamily: "var(--mi-font-body)",
        fontSize: "var(--mi-text-base)",
        lineHeight: "var(--mi-leading-relaxed)",
        color: "var(--mi-ink)",
      }}>
        {body}
      </div>
    </div>
  );
}

function CitationBlock({ source }: { source: Source }) {
  return (
    <div style={{
      background: "var(--mi-bg-dark)",
      border: "var(--mi-border-bold)",
      padding: "var(--mi-space-5)",
      boxShadow: "var(--mi-shadow-hero)",
      marginTop: "var(--mi-space-6)",
    }}>
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-widest)",
        textTransform: "uppercase",
        color: "var(--mi-accent-gold)",
        marginBottom: "var(--mi-space-3)",
      }}>
        Fuente primaria
      </div>

      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          fontFamily: "var(--mi-font-title)",
          fontSize: "var(--mi-text-lg)",
          color: "var(--mi-bg-paper)",
          borderBottom: "1px solid rgba(244,233,210,0.3)",
          paddingBottom: "var(--mi-space-3)",
          marginBottom: "var(--mi-space-3)",
        }}
      >
        {source.medium} ↗
      </a>

      <dl style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        lineHeight: "var(--mi-leading-relaxed)",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        columnGap: "var(--mi-space-4)",
        rowGap: "var(--mi-space-1)",
      }}>
        <dt style={{ color: "var(--mi-accent-gold)" }}>Medio</dt>
        <dd style={{ color: "var(--mi-bg-paper)" }}>{source.medium}</dd>
        {source.author && <>
          <dt style={{ color: "var(--mi-accent-gold)" }}>Autor</dt>
          <dd style={{ color: "var(--mi-bg-paper)" }}>{source.author}</dd>
        </>}
        <dt style={{ color: "var(--mi-accent-gold)" }}>Fecha</dt>
        <dd style={{ color: "var(--mi-bg-paper)" }}>{source.published_at}</dd>
        <dt style={{ color: "var(--mi-accent-gold)" }}>URL</dt>
        <dd style={{ color: "var(--mi-bg-paper)", wordBreak: "break-all" }}>
          <a href={source.url} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--mi-bg-paper)" }}>
            {source.url}
          </a>
        </dd>
      </dl>
    </div>
  );
}

/* === PAGE ====================================================== */

export default function AnalisisPage() {
  const a = MOCK_ANALYSIS;
  const axisColor = `var(--mi-axis-${a.axisKey})`;

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

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
        <span style={{ color: "var(--mi-accent-gold)" }}>{a.published_at}</span>
        <span>Análisis · {a.reading_time_min} min de lectura</span>
      </div>

      {/* Hero textual */}
      <div className="mi-container--narrow" style={{ paddingTop: "var(--mi-space-7)" }}>

        {/* Breadcrumb */}
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-4)",
          display: "flex",
          gap: "var(--mi-space-2)",
          alignItems: "center",
        }}>
          <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>Inicio</Link>
          <span>·</span>
          <Link href={`/pais/${a.countrySlug}`} style={{ color: "var(--mi-ink-mute)" }}>{a.country}</Link>
          <span>·</span>
          <span style={{ color: "var(--mi-ink)" }}>{a.axis}</span>
        </div>

        {/* Título + lede */}
        <h1 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 700,
          fontSize: "var(--mi-text-4xl)",
          lineHeight: "var(--mi-leading-snug)",
          letterSpacing: "var(--mi-tracking-tight)",
          color: "var(--mi-ink)",
          maxWidth: "22ch",
          marginBottom: "var(--mi-space-5)",
        }}>
          {a.title}
        </h1>

        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-lg)",
          lineHeight: "var(--mi-leading-normal)",
          color: "var(--mi-ink-soft)",
          maxWidth: "60ch",
          marginBottom: "var(--mi-space-4)",
        }}>
          {a.lede}
        </p>

        {/* Byline */}
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-4)",
          marginBottom: "var(--mi-space-7)",
          display: "flex",
          gap: "var(--mi-space-5)",
          flexWrap: "wrap",
        }}>
          <span>Por <strong style={{ color: "var(--mi-ink)" }}>Mapa Inestable</strong></span>
          <span>{a.published_at}</span>
          <span>{a.reading_time_min} min</span>
        </div>
      </div>

      {/* Contenido: aside + 4 pasos */}
      <div className="mi-container--narrow" style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
        alignItems: "start",
      }}>

        {/* Aside sticky */}
        <aside style={{
          position: "sticky",
          top: "var(--mi-space-6)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
        }}>
          <dl style={{ lineHeight: "var(--mi-leading-relaxed)" }}>
            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>País</dt>
            <dd>
              <Link href={`/pais/${a.countrySlug}`} style={{ color: "var(--mi-ink)", fontWeight: 500 }}>
                {a.country}
              </Link>
            </dd>

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Eje</dt>
            <dd>
              <Link
                href={`/ejes/${AXIS_KEY_TO_SLUG[a.axisKey] ?? a.axisKey}`}
                style={{
                  display: "inline-block",
                  background: axisColor,
                  color: "var(--mi-bg-paper)",
                  padding: "2px 6px",
                  fontSize: "var(--mi-text-xs)",
                  marginTop: "var(--mi-space-1)",
                }}
              >
                {a.axis}
              </Link>
            </dd>

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Fuente</dt>
            <dd>
              <a href={a.source_primary.url} target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--mi-ink)", borderBottom: "1px solid var(--mi-ink)" }}>
                {a.source_primary.medium} ↗
              </a>
            </dd>

            {a.source_primary.author && <>
              <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Autor</dt>
              <dd style={{ color: "var(--mi-ink)" }}>{a.source_primary.author}</dd>
            </>}

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Fecha</dt>
            <dd style={{ color: "var(--mi-ink)" }}>{a.source_primary.published_at}</dd>
          </dl>

          <div style={{
            marginTop: "var(--mi-space-6)",
            paddingTop: "var(--mi-space-3)",
            borderTop: "var(--mi-border-dashed)",
          }}>
            <Link
              href="/metodo"
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                display: "block",
                lineHeight: "var(--mi-leading-relaxed)",
              }}
            >
              → Cómo leemos
            </Link>
          </div>
        </aside>

        {/* 4 pasos + citation */}
        <div>
          {STEPS.map(step => (
            <StepBlock
              key={step.key}
              num={step.num}
              label={step.label}
              body={a[step.key]}
            />
          ))}

          <CitationBlock source={a.source_primary} />
        </div>

      </div>
    </div>
  );
}
