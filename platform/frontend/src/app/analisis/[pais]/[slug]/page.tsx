import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import { ANALISIS_ALL } from "@/lib/analisis";

export async function generateMetadata(
  { params }: { params: Promise<{ pais: string; slug: string }> }
): Promise<Metadata> {
  const { pais, slug } = await params;
  const a = ANALISIS_ALL.find(x => x.countrySlug === pais && x.slug === slug);
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

export function generateStaticParams() {
  return ANALISIS_ALL.map(a => ({ pais: a.countrySlug, slug: a.slug }));
}

/* === COMPONENTES ================================================ */

const STEPS = [
  { key: "step_disparador" as const,        num: "01", label: "Disparador" },
  { key: "step_desplazamiento" as const,    num: "02", label: "Desplazamiento" },
  { key: "step_conceptualizacion" as const, num: "03", label: "Conceptualización" },
  { key: "step_apertura" as const,          num: "04", label: "Apertura" },
];

function StepBlock({ num, label, body }: { num: string; label: string; body: string }) {
  return (
    <div style={{
      border: "var(--mi-border-thick)",
      boxShadow: "var(--mi-shadow-card)",
      background: "var(--mi-bg-paper)",
      marginBottom: "var(--mi-space-5)",
    }}>
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


/* === PAGE ====================================================== */

export default async function AnalisisPage(
  { params }: { params: Promise<{ pais: string; slug: string }> }
) {
  const { pais, slug } = await params;
  const a = ANALISIS_ALL.find(x => x.countrySlug === pais && x.slug === slug);
  if (!a) notFound();

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
        <span>Análisis</span>
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
          <span style={{ color: "var(--mi-ink)" }}>{a.axisName}</span>
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
                {a.axisName}
              </Link>
            </dd>

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Fuente</dt>
            <dd style={{ color: "var(--mi-ink-mute)", fontStyle: "italic" }}>Pendiente</dd>

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Fecha</dt>
            <dd style={{ color: "var(--mi-ink)" }}>{a.published_at}</dd>
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

        {/* 4 pasos */}
        <div>
          {STEPS.map(step => (
            <StepBlock
              key={step.key}
              num={step.num}
              label={step.label}
              body={a[step.key]}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
