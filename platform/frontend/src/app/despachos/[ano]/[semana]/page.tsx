import Link from "next/link";
import type { Metadata } from "next";

/* === TIPOS ====================================================== */

interface AnalysisSnippet {
  num: string;
  country: string;
  countrySlug: string;
  axis: string;
  axisKey: string;
  title: string;
  slug: string;
  lede: string;
  apertura: string;
}

interface ConnectorBlock {
  body: string;
}

type DispatchBlock =
  | { type: "analysis"; data: AnalysisSnippet }
  | { type: "connector"; data: ConnectorBlock };

interface Dispatch {
  year: number;
  week: number;
  num: number;
  title: string;
  date_range: string;
  year_label: string;
  entrada: string;
  blocks: DispatchBlock[];
  cierre: string;
  pregunta_semana: string;
}

/* === DATOS MOCK ================================================= */

const MOCK_DISPATCH: Dispatch = {
  year: 2026,
  week: 17,
  num: 47,
  title: "La sospecha como arma",
  date_range: "21–27 abr 2026",
  year_label: "Año II",
  entrada: "Esta semana el mapa político de Sudamérica se movió en una dirección que no habíamos visto antes: la retórica del fraude preventivo cruzó la frontera ideológica. Ya no es solo la derecha populista la que siembra la duda antes del resultado —ahora la izquierda también juega esa carta. Lo que estamos viendo no es hipocresía: es la normalización de una técnica. El voto como árbitro de la disputa política pierde densidad cuando todos los actores se reservan el derecho de desconocerlo.",
  blocks: [
    {
      type: "analysis",
      data: {
        num: "01",
        country: "Colombia",
        countrySlug: "co",
        axis: "Desorientación epistemológica",
        axisKey: "desorientacion",
        title: "La sospecha antes del voto",
        slug: "la-sospecha-antes-del-voto",
        lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Lo nuevo no es el discurso —es de Trump, Bolsonaro, Milei— sino que ahora sea pronunciado por la izquierda.",
        apertura: "¿Puede una democracia sostenerse cuando el procedimiento que la funda —el voto— ya no opera como árbitro? ¿O estamos ante el comienzo del fin de la idea de que los números cierran la política?",
      },
    },
    {
      type: "connector",
      data: {
        body: "El caso colombiano no es una anomalía regional —es la punta de lanza de un proceso más amplio. En los últimos dieciocho meses hemos registrado cuatro situaciones similares en el continente. La duda sobre el proceso electoral ya no se activa después del resultado: se instala antes.",
      },
    },
    {
      type: "analysis",
      data: {
        num: "02",
        country: "Colombia",
        countrySlug: "co",
        axis: "Erosión de mediaciones",
        axisKey: "mediaciones",
        title: "Petro y los territorios sin Estado",
        slug: "petro-y-los-territorios",
        lede: "El gobierno que prometió llevar el Estado a los territorios encuentra que el Estado nunca estuvo allí —y que quienes sí estuvieron no piensan retirarse.",
        apertura: "¿Puede construirse Estado donde solo existió violencia? ¿O la violencia ya es la única forma de Estado posible en esos territorios?",
      },
    },
  ],
  cierre: "Los dos análisis de esta semana comparten una misma lógica de fondo: el vaciamiento de los procedimientos que organizan la vida política. No es que el fraude exista o que el Estado llegue —es que la creencia en que el procedimiento puede funcionar se erosiona. Cuando esa creencia cede, el vacío lo llena quien pueda.",
  pregunta_semana: "¿En qué momento el debilitamiento de los procedimientos se vuelve irreversible?",
};

export const metadata: Metadata = {
  title: { absolute: `Despacho Nº ${MOCK_DISPATCH.num} — Mapa Inestable` },
  description: MOCK_DISPATCH.entrada.slice(0, 160),
  openGraph: {
    title: `Despacho Nº ${MOCK_DISPATCH.num} — ${MOCK_DISPATCH.title}`,
    description: MOCK_DISPATCH.entrada.slice(0, 160),
  },
};

/* === COMPONENTES ================================================ */

function AnalysisSnippetBlock({ data }: { data: AnalysisSnippet }) {
  return (
    <div style={{
      border: "var(--mi-border-thick)",
      background: "var(--mi-bg-paper)",
      boxShadow: "var(--mi-shadow-card)",
      marginBottom: "var(--mi-space-5)",
    }}>
      {/* Header */}
      <div style={{
        background: "var(--mi-ink)",
        padding: "var(--mi-space-3) var(--mi-space-4)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "var(--mi-space-3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-3)" }}>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-2xl)",
            fontWeight: 400,
            color: "rgba(244,233,210,0.2)",
            lineHeight: 1,
            userSelect: "none",
          }}>
            {data.num}
          </span>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wider)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
          }}>
            {data.country}
          </span>
        </div>
        <span style={{
          display: "inline-block",
          background: `var(--mi-axis-${data.axisKey})`,
          color: "var(--mi-bg-paper)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          padding: "2px 8px",
        }}>
          {data.axis}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "var(--mi-space-4)" }}>
        <h3 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 700,
          fontSize: "var(--mi-text-xl)",
          lineHeight: "var(--mi-leading-snug)",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-3)",
        }}>
          {data.title}
        </h3>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-base)",
          lineHeight: "var(--mi-leading-relaxed)",
          color: "var(--mi-ink-soft)",
          marginBottom: "var(--mi-space-3)",
        }}>
          {data.lede}
        </p>

        {/* Apertura como blockquote */}
        <blockquote style={{
          borderLeft: "3px solid var(--mi-ink)",
          paddingLeft: "var(--mi-space-3)",
          marginBottom: "var(--mi-space-4)",
          fontFamily: "var(--mi-font-title)",
          fontStyle: "italic",
          fontSize: "var(--mi-text-base)",
          lineHeight: "var(--mi-leading-relaxed)",
          color: "var(--mi-ink)",
        }}>
          {data.apertura}
        </blockquote>

        <Link
          href={`/analisis/${data.countrySlug}/${data.slug}`}
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wider)",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            borderBottom: "2px solid var(--mi-ink)",
            paddingBottom: 2,
          }}
        >
          Leer análisis completo →
        </Link>
      </div>
    </div>
  );
}

function Connector({ data }: { data: ConnectorBlock }) {
  return (
    <div style={{
      paddingBlock: "var(--mi-space-4)",
      maxWidth: "60ch",
    }}>
      <p style={{
        fontFamily: "var(--mi-font-title)",
        fontStyle: "italic",
        fontSize: "var(--mi-text-lg)",
        lineHeight: "var(--mi-leading-relaxed)",
        color: "var(--mi-bg-paper)",
        opacity: 0.82,
      }}>
        {data.body}
      </p>
    </div>
  );
}

/* === PAGE ====================================================== */

export default function DespachoPage() {
  const d = MOCK_DISPATCH;

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
        <Link href="/despachos" style={{ color: "var(--mi-ink-mute)" }}>← Despachos</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>{d.date_range}</span>
        <span>Despacho Nº {d.num}</span>
      </div>

      {/* Header */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }} className="mi-grain">
        <div className="mi-container--narrow">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
            opacity: 0.55,
            marginBottom: "var(--mi-space-3)",
          }}>
            {d.year_label} · {d.date_range}
          </div>

          {/* Número grande decorativo */}
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-display)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            color: "rgba(244,233,210,0.12)",
            marginBottom: "-0.1em",
            userSelect: "none",
          }}>
            Nº {d.num}
          </div>

          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-4xl)",
            lineHeight: "var(--mi-leading-snug)",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
          }}>
            {d.title}
          </h1>
        </div>
      </div>

      {/* Entrada */}
      <div style={{
        borderBottom: "1px dashed rgba(244,233,210,0.3)",
        paddingBlock: "var(--mi-space-6)",
      }}>
        <div className="mi-container--narrow">
          <p className="mi-dropcap" style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-lg)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-bg-paper)",
            maxWidth: "65ch",
          }}>
            {d.entrada}
          </p>
        </div>
      </div>

      {/* Bloques */}
      <div className="mi-container--narrow" style={{
        paddingTop: "var(--mi-space-6)",
        paddingBottom: "var(--mi-space-7)",
      }}>
        {d.blocks.map((block, i) => {
          if (block.type === "analysis") {
            return <AnalysisSnippetBlock key={i} data={block.data} />;
          }
          return <Connector key={i} data={block.data} />;
        })}
      </div>

      {/* Cierre */}
      <div style={{
        background: "var(--mi-bg-dark)",
        borderTop: "var(--mi-border-bold)",
        borderBottom: "var(--mi-border-bold)",
        boxShadow: "inset 0 6px 0 rgba(0,0,0,0.15)",
        padding: "var(--mi-space-7) var(--mi-space-6)",
      }}>
        <div className="mi-container--narrow">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-accent-gold)",
            marginBottom: "var(--mi-space-4)",
          }}>
            Cierre
          </div>
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-lg)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-bg-paper)",
            maxWidth: "65ch",
            marginBottom: "var(--mi-space-6)",
          }}>
            {d.cierre}
          </p>

          {/* Pregunta de la semana */}
          <div style={{
            border: "2px solid var(--mi-accent-gold)",
            padding: "var(--mi-space-4) var(--mi-space-5)",
            maxWidth: "52ch",
            boxShadow: "6px 6px 0 rgba(232,197,138,0.25)",
          }}>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-widest)",
              textTransform: "uppercase",
              color: "var(--mi-accent-gold)",
              marginBottom: "var(--mi-space-2)",
            }}>
              La pregunta de la semana
            </div>
            <p style={{
              fontFamily: "var(--mi-font-title)",
              fontStyle: "italic",
              fontSize: "var(--mi-text-xl)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-bg-paper)",
            }}>
              &ldquo;{d.pregunta_semana}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Recibir por email */}
      <div style={{
        borderTop: "1px solid rgba(244,233,210,0.15)",
        padding: "var(--mi-space-5) var(--mi-space-6)",
      }}>
        <div className="mi-container--narrow" style={{
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
            opacity: 0.6,
          }}>
            Recibir el próximo despacho por email
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
