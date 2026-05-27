import Link from "next/link";
import type { Eje } from "@/lib/ejes";
import "@/styles/mobile-restantes.css";

interface AnalisisItem {
  slug: string;
  country: string;
  countrySlug: string;
  title: string;
  lede: string;
  published_at: string;
  href: string;
}

interface CountryCount {
  slug: string;
  name: string;
  count: number;
}

interface EjePageMobileProps {
  eje: Eje;
  numStr: string;
  totalEjes: number;
  analyses: AnalisisItem[];
  countriesWithCount: CountryCount[];
  conceptos?: Array<{ slug: string; name: string }>;
}

export default function EjePageMobile({
  eje,
  numStr,
  totalEjes,
  analyses,
  countriesWithCount,
  conceptos = [],
}: EjePageMobileProps) {
  const bgColor = `var(--mi-axis-${eje.axisKey})`;
  const isGold  = eje.axisKey === "atencion";
  const textColor = isGold ? "var(--mi-ink)" : "var(--mi-bg-paper)";
  const labelColor = isGold ? "var(--mi-ink)" : "var(--mi-accent-gold)";
  const statsBorder = isGold
    ? "1px solid rgba(0,0,0,0.25)"
    : "1px solid rgba(255,255,255,0.3)";

  const recentAnalyses = analyses.slice(0, 8);

  return (
    <div className="mr-mobile-only" style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Hero */}
      <div className="mr-eje-hero" style={{ background: bgColor }}>
        <span
          className="mr-eje-hero-label"
          style={{ color: labelColor }}
        >
          Eje · {numStr} de {String(totalEjes).padStart(2, "0")}
        </span>

        <h1
          className="mr-eje-hero-h1"
          style={{ color: textColor }}
        >
          {eje.name}
        </h1>

        <p
          className="mr-eje-hero-lede"
          style={{ color: textColor }}
        >
          {eje.definicion_corta}
        </p>

        <div
          className="mr-eje-hero-stats"
          style={{ color: textColor, borderTop: statsBorder, opacity: isGold ? 0.8 : 0.85 }}
        >
          {analyses.length} análisis
          {countriesWithCount.length > 0 && ` · activo en ${countriesWithCount.length} países`}
        </div>
      </div>

      {/* Qué describe */}
      <div className="mr-eje-section">
        <span className="mr-eje-section-label">Qué describe</span>
        <div className="mr-eje-prose">
          {eje.que_describe.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Activo en */}
      {countriesWithCount.length > 0 && (
        <div className="mr-eje-section">
          <span className="mr-eje-section-label">Activo en</span>
          <h2 className="mr-eje-section-h2">
            {countriesWithCount.length} {countriesWithCount.length === 1 ? "país" : "países"}
          </h2>
          <div className="mr-eje-countries-grid">
            {countriesWithCount.map(c => (
              <Link
                key={c.slug}
                href={`/pais/${c.slug}?tab=publicaciones&eje=${eje.slug}`}
                className="mr-eje-country-chip"
              >
                {c.name}
                <span className="mr-eje-country-count">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Autores referenciales */}
      {eje.autores.length > 0 && (
        <div className="mr-eje-section">
          <span className="mr-eje-section-label">Autores referenciales</span>
          <div className="mr-eje-countries-grid">
            {eje.autores.map(a => (
              <Link
                key={a.slug}
                href={`/autor/${a.slug}`}
                className="mr-eje-country-chip"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Análisis recientes */}
      <div className="mr-eje-section">
        <span className="mr-eje-section-label">Análisis recientes</span>

        {recentAnalyses.length === 0 ? (
          <p style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            Sin análisis publicados aún
          </p>
        ) : (
          <div className="mr-cards-list" style={{ margin: "0 -20px" }}>
            {recentAnalyses.map(a => (
              <div key={a.slug} className="mr-card">
                <div className="mr-card-meta">
                  {a.country && (
                    <span className="mr-card-country">{a.country}</span>
                  )}
                </div>
                <Link href={a.href} className="mr-card-title">{a.title}</Link>
                {a.lede && <p className="mr-card-desc">{a.lede}</p>}
                <span className="mr-card-footer">{a.published_at}</span>
              </div>
            ))}
          </div>
        )}

        {analyses.length > 8 && (
          <Link
            href={`/analisis?eje=${eje.slug}`}
            className="mr-eje-ver-todos"
          >
            Ver todos ({analyses.length}) →
          </Link>
        )}
      </div>

      {/* Conceptos relacionados */}
      {conceptos.length > 0 && (
        <div className="mr-eje-section">
          <span className="mr-eje-section-label">Conceptos relacionados</span>
          <div className="mr-eje-countries-grid">
            {conceptos.map(c => (
              <Link
                key={c.slug}
                href={`/concepto/${c.slug}`}
                className="mr-eje-country-chip"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
