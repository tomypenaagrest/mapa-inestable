import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDispatches, getDispatchBySemana } from "@/lib/despachos";
import { EJES, AXIS_KEY_TO_SLUG } from "@/lib/ejes";

export function generateStaticParams() {
  return getAllDispatches().map(d => ({
    ano: String(d.year),
    semana: String(d.week),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ ano: string; semana: string }> }
): Promise<Metadata> {
  const { ano, semana } = await params;
  const d = getDispatchBySemana(Number(ano), Number(semana));
  if (!d) return {};
  return {
    title: { absolute: `Despacho Nº ${d.number} — Mapa Inestable` },
    description: d.subtitle ?? d.title,
    openGraph: {
      title: `Despacho Nº ${d.number} — ${d.title}`,
      description: d.subtitle ?? d.title,
    },
  };
}

/* === PAGE ====================================================== */

export default async function DespachoPage(
  { params }: { params: Promise<{ ano: string; semana: string }> }
) {
  const { ano, semana } = await params;
  const d = getDispatchBySemana(Number(ano), Number(semana));
  if (!d) notFound();

  const ejesObjs = d.ejesActivados
    .map(k => EJES.find(e => e.axisKey === k))
    .filter(Boolean);

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
        <span style={{ color: "var(--mi-accent-gold)" }}>{d.published_at}</span>
        <span>Despacho Nº {d.number}</span>
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
            Semana {d.week} · {d.year}
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
            Nº {d.number}
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

          {d.subtitle && (
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontStyle: "italic",
              fontSize: "var(--mi-text-lg)",
              lineHeight: "var(--mi-leading-normal)",
              color: "rgba(244,233,210,0.75)",
              maxWidth: "60ch",
              marginTop: "var(--mi-space-4)",
            }}>
              {d.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Ejes chips */}
      {ejesObjs.length > 0 && (
        <div style={{
          borderBottom: "1px dashed rgba(244,233,210,0.2)",
          padding: "var(--mi-space-4) var(--mi-space-6)",
          display: "flex",
          gap: "var(--mi-space-2)",
          flexWrap: "wrap",
        }}>
          {ejesObjs.map(eje => eje && (
            <Link
              key={eje.axisKey}
              href={`/ejes/${AXIS_KEY_TO_SLUG[eje.axisKey] ?? eje.slug}`}
              style={{
                display: "inline-block",
                background: `var(--mi-axis-${eje.axisKey})`,
                color: "var(--mi-bg-paper)",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                padding: "2px 10px",
              }}
            >
              {eje.name}
            </Link>
          ))}
        </div>
      )}

      {/* Cuerpo */}
      <div className="mi-container--narrow" style={{
        paddingTop: "var(--mi-space-6)",
        paddingBottom: "var(--mi-space-8)",
      }}>
        <div
          className="mi-prose"
          style={{ color: "var(--mi-bg-paper)" }}
          dangerouslySetInnerHTML={{ __html: d.html }}
        />
      </div>

      {/* CTA Substack */}
      {d.url && (
        <div style={{
          borderTop: "var(--mi-border-bold)",
          padding: "var(--mi-space-5) var(--mi-space-6)",
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
          <div style={{ display: "flex", gap: "var(--mi-space-4)", flexWrap: "wrap" }}>
            <a
              href={d.url}
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
              Leer en Substack ↗
            </a>
            <a
              href="https://mapainestable.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-bg-paper)",
                opacity: 0.6,
                borderBottom: "1px solid rgba(244,233,210,0.4)",
                paddingBottom: 2,
              }}
            >
              Suscribirse ↗
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
