import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import { ANALISIS_ALL } from "@/lib/analisis";
import FrameStripInline from "@/components/FrameStripInline";
import AnalisisContent from "@/components/AnalisisContent";

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

/* === PAGE ====================================================== */

export default async function AnalisisPage(
  { params }: { params: Promise<{ pais: string; slug: string }> }
) {
  const { pais, slug } = await params;
  const a = ANALISIS_ALL.find(x => x.countrySlug === pais && x.slug === slug);
  if (!a) notFound();

  const axisSlug = AXIS_KEY_TO_SLUG[a.axisKey] ?? a.axisKey;

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
        <span>Semana {a.week} · {a.year}</span>
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

        {/* Frame strip inline — siempre visible */}
        <FrameStripInline
          axes={[{ name: a.axisName, key: a.axisKey, slug: axisSlug }]}
        />

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

      {/* Contenido: meta aside + 4 pasos + footnote aside */}
      <AnalisisContent a={a} />

      {/* Cross-reference panel */}
      <div className="mi-container--narrow" style={{ paddingBottom: "var(--mi-space-8)" }}>
        <div style={{
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-5)",
        }}>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-4)",
          }}>
            Más análisis
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--mi-space-4)" }}>
            {/* Same country */}
            <div>
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                marginBottom: "var(--mi-space-3)",
              }}>
                Del mismo país
              </div>
              {ANALISIS_ALL
                .filter(x => x.countrySlug === a.countrySlug && x.slug !== a.slug)
                .slice(0, 3)
                .map(x => (
                  <Link
                    key={x.slug}
                    href={`/analisis/${x.countrySlug}/${x.slug}`}
                    style={{
                      display: "block",
                      fontFamily: "var(--mi-font-body)",
                      fontSize: "var(--mi-text-sm)",
                      color: "var(--mi-ink)",
                      marginBottom: "var(--mi-space-2)",
                      borderBottom: "var(--mi-border-soft)",
                      paddingBottom: "var(--mi-space-2)",
                    }}
                  >
                    {x.title}
                    <span style={{
                      display: "block",
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-xs)",
                      color: "var(--mi-ink-mute)",
                      marginTop: "2px",
                      letterSpacing: "var(--mi-tracking-wide)",
                      textTransform: "uppercase",
                    }}>
                      {x.published_at}
                    </span>
                  </Link>
                ))}
            </div>
            {/* Same axis */}
            <div>
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                marginBottom: "var(--mi-space-3)",
              }}>
                Del mismo eje
              </div>
              {ANALISIS_ALL
                .filter(x => x.axisKey === a.axisKey && x.slug !== a.slug)
                .slice(0, 3)
                .map(x => (
                  <Link
                    key={x.slug}
                    href={`/analisis/${x.countrySlug}/${x.slug}`}
                    style={{
                      display: "block",
                      fontFamily: "var(--mi-font-body)",
                      fontSize: "var(--mi-text-sm)",
                      color: "var(--mi-ink)",
                      marginBottom: "var(--mi-space-2)",
                      borderBottom: "var(--mi-border-soft)",
                      paddingBottom: "var(--mi-space-2)",
                    }}
                  >
                    {x.title}
                    <span style={{
                      display: "block",
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-xs)",
                      color: "var(--mi-ink-mute)",
                      marginTop: "2px",
                      letterSpacing: "var(--mi-tracking-wide)",
                      textTransform: "uppercase",
                    }}>
                      {x.country} · {x.published_at}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
