import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicationBySlug, getAllPublications } from "@/lib/content";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import { EJES } from "@/lib/ejes";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const pub = getPublicationBySlug(slug);
  if (!pub) return {};
  const title = pub.subtitle ? `${pub.title}: ${pub.subtitle}` : pub.title;
  return {
    title: { absolute: `${pub.title} — Mapa Inestable` },
    description: pub.subtitle ?? pub.thesis ?? "",
    openGraph: { title, description: pub.subtitle ?? pub.thesis ?? "" },
  };
}

export function generateStaticParams() {
  return getAllPublications().map(p => ({ slug: p.slug }));
}

export default async function PublicacionPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const pub = getPublicationBySlug(slug);
  if (!pub) notFound();

  const eje = EJES.find(e => e.axisKey === pub.ejePrincipal);
  const axisSlug = AXIS_KEY_TO_SLUG[pub.ejePrincipal] ?? pub.ejePrincipal;

  const relatedByAxis = getAllPublications()
    .filter(p => p.slug !== pub.slug && p.ejePrincipal === pub.ejePrincipal)
    .slice(0, 3);

  const relatedByCountry = pub.countrySlug
    ? getAllPublications()
        .filter(p => p.slug !== pub.slug && p.countrySlug === pub.countrySlug)
        .slice(0, 3)
    : [];

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background:    "var(--mi-ink)",
        color:         "var(--mi-bg-paper)",
        padding:       `6px var(--mi-space-6)`,
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display:       "flex",
        gap:           "var(--mi-space-6)",
      }}>
        <span style={{ color: "var(--mi-accent-gold)" }}>{pub.published_at}</span>
        <span>{pub.tipo === "despacho" ? "Despacho" : "Publicación"}</span>
        {pub.countrySlug && <span>{pub.country}</span>}
        <div style={{ marginLeft: "auto", display: "flex", gap: "var(--mi-space-4)" }}>
          <Link href="/analisis" style={{ color: "var(--mi-ink-mute)" }}>← Archivo</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="mi-container--narrow" style={{ paddingTop: "var(--mi-space-7)" }}>

        {/* Breadcrumb */}
        <div style={{
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color:         "var(--mi-ink-mute)",
          marginBottom:  "var(--mi-space-4)",
          display:       "flex",
          gap:           "var(--mi-space-2)",
          alignItems:    "center",
          flexWrap:      "wrap",
        }}>
          <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>Inicio</Link>
          <span>·</span>
          <Link href="/analisis" style={{ color: "var(--mi-ink-mute)" }}>Archivo</Link>
          {pub.countrySlug && (
            <>
              <span>·</span>
              <Link href={`/pais/${pub.countrySlug}`} style={{ color: "var(--mi-ink-mute)" }}>
                {pub.country}
              </Link>
            </>
          )}
          <span>·</span>
          {eje && (
            <Link href={`/ejes/${axisSlug}`} style={{ color: "var(--mi-ink-mute)" }}>
              {eje.name}
            </Link>
          )}
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily:    "var(--mi-font-title)",
          fontWeight:    700,
          fontSize:      "var(--mi-text-4xl)",
          lineHeight:    "var(--mi-leading-snug)",
          letterSpacing: "var(--mi-tracking-tight)",
          color:         "var(--mi-ink)",
          maxWidth:      "22ch",
          marginBottom:  "var(--mi-space-3)",
        }}>
          {pub.title}
        </h1>

        {pub.subtitle && (
          <p style={{
            fontFamily:   "var(--mi-font-body)",
            fontStyle:    "italic",
            fontSize:     "var(--mi-text-lg)",
            lineHeight:   "var(--mi-leading-normal)",
            color:        "var(--mi-ink-soft)",
            maxWidth:     "60ch",
            marginBottom: "var(--mi-space-4)",
          }}>
            {pub.subtitle}
          </p>
        )}

        {/* Eje chip */}
        {eje && (
          <div style={{ marginBottom: "var(--mi-space-4)" }}>
            <Link
              href={`/ejes/${axisSlug}`}
              style={{
                display:       "inline-block",
                background:    `var(--mi-axis-${pub.ejePrincipal})`,
                color:         "var(--mi-bg-paper)",
                fontFamily:    "var(--mi-font-mono)",
                fontSize:      "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                padding:       "2px 10px",
                textDecoration:"none",
              }}
            >
              {eje.name}
            </Link>
            {pub.ejes.slice(1).map(k => {
              const e2 = EJES.find(e => e.axisKey === k);
              if (!e2) return null;
              return (
                <Link
                  key={k}
                  href={`/ejes/${AXIS_KEY_TO_SLUG[k] ?? k}`}
                  style={{
                    display:       "inline-block",
                    marginLeft:    "var(--mi-space-2)",
                    background:    `var(--mi-axis-${k})`,
                    color:         "var(--mi-bg-paper)",
                    fontFamily:    "var(--mi-font-mono)",
                    fontSize:      "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    padding:       "2px 10px",
                    textDecoration:"none",
                    opacity:       0.7,
                  }}
                >
                  {e2.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Byline */}
        <div style={{
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color:         "var(--mi-ink-mute)",
          borderTop:     "var(--mi-border-bold)",
          paddingTop:    "var(--mi-space-4)",
          marginBottom:  "var(--mi-space-7)",
          display:       "flex",
          gap:           "var(--mi-space-5)",
          flexWrap:      "wrap",
        }}>
          <span>Por <strong style={{ color: "var(--mi-ink)" }}>Mapa Inestable</strong></span>
          <span>{pub.published_at}</span>
        </div>
      </div>

      {/* CTA Substack banner */}
      {pub.url && (
        <div style={{
          borderTop:    "var(--mi-border-bold)",
          borderBottom: "var(--mi-border-bold)",
          background:   "var(--mi-bg-dark)",
          padding:      "var(--mi-space-4) var(--mi-space-6)",
          display:      "flex",
          justifyContent: "space-between",
          alignItems:   "center",
          gap:          "var(--mi-space-4)",
          flexWrap:     "wrap",
          marginBottom: "var(--mi-space-7)",
        }}>
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color:         "var(--mi-accent-gold)",
          }}>
            Publicado en Substack · versión completa disponible
          </span>
          <a
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mi-btn"
            style={{ whiteSpace: "nowrap" }}
          >
            Leer en Substack →
          </a>
        </div>
      )}

      {/* Cuerpo del texto */}
      <div className="mi-container--narrow" style={{ paddingBottom: "var(--mi-space-8)" }}>
        <div
          className="mi-prose"
          dangerouslySetInnerHTML={{ __html: pub.html }}
        />

        {/* Relacionados */}
        {(relatedByCountry.length > 0 || relatedByAxis.length > 0) && (
          <div style={{
            borderTop:  "var(--mi-border-bold)",
            paddingTop: "var(--mi-space-5)",
            marginTop:  "var(--mi-space-7)",
          }}>
            <div style={{
              fontFamily:    "var(--mi-font-mono)",
              fontSize:      "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-widest)",
              textTransform: "uppercase",
              color:         "var(--mi-ink-mute)",
              marginBottom:  "var(--mi-space-4)",
            }}>
              Más publicaciones
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--mi-space-4)" }}>
              {relatedByCountry.length > 0 && (
                <div>
                  <div style={{
                    fontFamily:    "var(--mi-font-mono)",
                    fontSize:      "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    color:         "var(--mi-ink-mute)",
                    marginBottom:  "var(--mi-space-3)",
                  }}>
                    Del mismo país
                  </div>
                  {relatedByCountry.map(p => (
                    <Link
                      key={p.slug}
                      href={`/publicaciones/${p.slug}`}
                      style={{
                        display:       "block",
                        fontFamily:    "var(--mi-font-body)",
                        fontSize:      "var(--mi-text-sm)",
                        color:         "var(--mi-ink)",
                        marginBottom:  "var(--mi-space-2)",
                        borderBottom:  "var(--mi-border-soft)",
                        paddingBottom: "var(--mi-space-2)",
                      }}
                    >
                      {p.title}
                      <span style={{
                        display:       "block",
                        fontFamily:    "var(--mi-font-mono)",
                        fontSize:      "var(--mi-text-xs)",
                        color:         "var(--mi-ink-mute)",
                        marginTop:     "2px",
                        letterSpacing: "var(--mi-tracking-wide)",
                        textTransform: "uppercase",
                      }}>
                        {p.published_at}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {relatedByAxis.length > 0 && (
                <div>
                  <div style={{
                    fontFamily:    "var(--mi-font-mono)",
                    fontSize:      "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    color:         "var(--mi-ink-mute)",
                    marginBottom:  "var(--mi-space-3)",
                  }}>
                    Del mismo eje
                  </div>
                  {relatedByAxis.map(p => (
                    <Link
                      key={p.slug}
                      href={`/publicaciones/${p.slug}`}
                      style={{
                        display:       "block",
                        fontFamily:    "var(--mi-font-body)",
                        fontSize:      "var(--mi-text-sm)",
                        color:         "var(--mi-ink)",
                        marginBottom:  "var(--mi-space-2)",
                        borderBottom:  "var(--mi-border-soft)",
                        paddingBottom: "var(--mi-space-2)",
                      }}
                    >
                      {p.title}
                      <span style={{
                        display:       "block",
                        fontFamily:    "var(--mi-font-mono)",
                        fontSize:      "var(--mi-text-xs)",
                        color:         "var(--mi-ink-mute)",
                        marginTop:     "2px",
                        letterSpacing: "var(--mi-tracking-wide)",
                        textTransform: "uppercase",
                      }}>
                        {p.country ? `${p.country} · ` : ""}{p.published_at}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
