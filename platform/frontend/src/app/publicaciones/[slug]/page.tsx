import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicationBySlug, getAllPublications } from "@/lib/content";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import { EJES } from "@/lib/ejes";
import ArticleBody from "@/components/ArticleBody";
import { calcReadingTime } from "@/lib/text-utils";

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
  const readingTime = calcReadingTime(pub.html);

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

      {/* Navegación top */}
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

      {/* Article header — Spec 50 §2 layout */}
      <div className="article-page-header">

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
          {eje && (
            <>
              <span>·</span>
              <Link href={`/ejes/${axisSlug}`} style={{ color: "var(--mi-ink-mute)" }}>
                {eje.name}
              </Link>
            </>
          )}
        </div>

        {/* Country display — solo si la publicación tiene país */}
        {pub.countrySlug && pub.country && (
          <p className="article-country">{pub.country}</p>
        )}

        {/* H1 */}
        <h1 className="article-h1">{pub.title}</h1>

        {/* Meta bar */}
        <div className="article-meta-bar">
          <span className="article-meta-item">
            <span className="article-meta-label">Publicado</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">{pub.published_at}</span>
          </span>
          <span className="article-meta-item">
            <span className="article-meta-label">Lectura</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">{readingTime} min</span>
          </span>
        </div>

        {/* Axis pills */}
        {pub.ejes.length > 0 && (
          <div className="article-axis-row">
            {pub.ejes.map((k, i) => {
              const e = EJES.find(e => e.axisKey === k);
              if (!e) return null;
              return (
                <Link
                  key={k}
                  href={`/ejes/${AXIS_KEY_TO_SLUG[k] ?? k}`}
                  className={`article-axis-pill${k === "atencion" ? " article-axis-pill--atencion" : ""}`}
                  style={{
                    background: `var(--mi-axis-${k})`,
                    opacity: i > 0 ? 0.75 : 1,
                    textDecoration: "none",
                  }}
                >
                  {e.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Subtitle as lede */}
        {pub.subtitle && (
          <p className="article-lede">{pub.subtitle}</p>
        )}
      </div>

      {/* Portada in-flow — coverImage se agrega en Spec 37 para publicaciones */}

      {/* CTA Substack */}
      {pub.url && (
        <div style={{
          maxWidth:      "var(--mi-container-narrow)",
          margin:        "0 auto 24px",
          padding:       "0 48px",
        }}>
          <div style={{
            borderTop:    "var(--mi-border-bold)",
            borderBottom: "var(--mi-border-bold)",
            background:   "var(--mi-bg-dark)",
            padding:      "var(--mi-space-4) var(--mi-space-5)",
            display:      "flex",
            justifyContent: "space-between",
            alignItems:   "center",
            gap:          "var(--mi-space-4)",
            flexWrap:     "wrap",
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
        </div>
      )}

      {/* Cuerpo */}
      <ArticleBody html={pub.html} />

      {/* Relacionados */}
      {(relatedByCountry.length > 0 || relatedByAxis.length > 0) && (
        <div style={{
          maxWidth:      "var(--mi-container-narrow)",
          margin:        "0 auto",
          padding:       "0 48px var(--mi-space-8)",
        }}>
          <div style={{
            borderTop:  "var(--mi-border-bold)",
            paddingTop: "var(--mi-space-5)",
            marginTop:  "var(--mi-space-4)",
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
        </div>
      )}
    </div>
  );
}
