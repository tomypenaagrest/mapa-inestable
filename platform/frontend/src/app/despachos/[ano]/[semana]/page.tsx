import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DESPACHOS_ALL, findDespacho, type AnalysisSnippet, type ConnectorBlock } from "@/lib/despachos";

export function generateStaticParams() {
  return DESPACHOS_ALL.map(d => ({ ano: String(d.year), semana: String(d.week) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ ano: string; semana: string }> }
): Promise<Metadata> {
  const { ano, semana } = await params;
  const d = findDespacho(Number(ano), Number(semana));
  if (!d) return {};
  return {
    title: { absolute: `Despacho Nº ${d.num} — Mapa Inestable` },
    description: d.entrada.slice(0, 160),
    openGraph: {
      title: `Despacho Nº ${d.num} — ${d.title}`,
      description: d.entrada.slice(0, 160),
    },
  };
}

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

export default async function DespachoPage(
  { params }: { params: Promise<{ ano: string; semana: string }> }
) {
  const { ano, semana } = await params;
  const d = findDespacho(Number(ano), Number(semana));
  if (!d) notFound();

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

      {/* Bloques o placeholder */}
      <div className="mi-container--narrow" style={{
        paddingTop: "var(--mi-space-6)",
        paddingBottom: "var(--mi-space-7)",
      }}>
        {d.blocks ? (
          d.blocks.map((block, i) => {
            if (block.type === "analysis") {
              return <AnalysisSnippetBlock key={i} data={block.data} />;
            }
            return <Connector key={i} data={block.data} />;
          })
        ) : (
          <p style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
            opacity: 0.4,
          }}>
            Contenido completo próximamente
          </p>
        )}
      </div>

      {/* Cierre */}
      {d.cierre && (
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
              marginBottom: d.pregunta_semana ? "var(--mi-space-6)" : 0,
            }}>
              {d.cierre}
            </p>

            {d.pregunta_semana && (
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
            )}
          </div>
        </div>
      )}

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
