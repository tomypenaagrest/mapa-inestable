import Link from "next/link";
import type { Metadata } from "next";
import { getCountrySections, findSection, otherSections, getAgentDraftsByCountry, getPublicationsByCountry } from "@/lib/content";
import {
  COUNTRY_EJES,
  COUNTRY_SOURCES,
  COUNTRY_NAMES,
} from "@/lib/country-data";
import type { AnalysisSummary } from "@/lib/analisis";
import { getCountryIndicators, LB_META, COVERED_COUNTRIES } from "@/lib/latinobarometro";
import { getCountryMacro, MACRO_FAMILIES, MACRO_META } from "@/lib/macro-indicators";
import { EJES } from "@/lib/ejes";
import CountryDashboard from "@/components/CountryDashboard";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const name = COUNTRY_NAMES[slug];
  if (!name) return {};
  return {
    title: { absolute: `${name} — Mapa Inestable` },
    description: `Perfil estructural de ${name}. Los seis ejes activados, los procesos en curso y el análisis semanal de Mapa Inestable.`,
    openGraph: {
      title: `${name} — Mapa Inestable`,
      description: `Perfil estructural de ${name}. Los seis ejes activados, los procesos en curso y el análisis semanal de Mapa Inestable.`,
    },
  };
}

const ALL_SKIP_KEYS = ["tensiones", "pregunta", "outsider", "marco analítico"];

export default async function PaisPage({
  params,
  searchParams,
}: {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug }     = await params;
  const sp           = await searchParams;
  const initialTab   = sp?.tab ?? "publicaciones";

  const name         = COUNTRY_NAMES[slug] ?? slug.toUpperCase();
  const ejes         = COUNTRY_EJES[slug]    ?? [];
  const fuentes      = COUNTRY_SOURCES[slug] ?? [];
  const sections     = getCountrySections(slug) ?? [];

  const publications = getPublicationsByCountry(slug);
  const analyses: AnalysisSummary[] = publications.map(p => {
    const eje = EJES.find(e => e.axisKey === p.ejePrincipal);
    return {
      slug:        p.slug,
      title:       p.title,
      axis:        eje?.name ?? p.ejePrincipal,
      axisKey:     p.ejePrincipal,
      date:        p.published_at,
      week:        p.week,
      year:        p.year,
      substackUrl: p.url,
      tipo:        p.tipo === "despacho" ? "despacho" : "publicacion",
    };
  });

  const isCovered    = (COVERED_COUNTRIES as readonly string[]).includes(slug);
  const lbIndicators = isCovered ? getCountryIndicators(slug) : [];
  const macroIndicators = getCountryMacro(slug);

  const tensiones    = findSection(sections, ["tensiones"]);
  const pregunta     = findSection(sections, ["pregunta"]);
  const rest         = otherSections(sections, ALL_SKIP_KEYS);

  /* Strip HTML tags from the central question for the sticky header */
  const centralQuestion = pregunta?.html
    ? pregunta.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : null;

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Metabar — not sticky, scrolls away */}
      <div style={{
        background:    "var(--mi-ink)",
        color:         "var(--mi-bg-paper)",
        padding:       "6px var(--mi-space-6)",
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display:       "flex",
        gap:           "var(--mi-space-6)",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Perfil de país</span>
      </div>

      <CountryDashboard
        slug={slug}
        name={name}
        centralQuestion={centralQuestion}
        ejes={ejes}
        fuentes={fuentes}
        analyses={analyses}
        tensionesHtml={tensiones?.html ?? null}
        preguntaHtml={pregunta?.html ?? null}
        contextSections={rest}
        lbIndicators={lbIndicators}
        lbMeta={{
          wave_label:   LB_META.wave_label,
          fieldwork:    LB_META.fieldwork,
          n_total:      LB_META.n_total,
          codebook_url: LB_META.codebook_url,
        }}
        macroIndicators={macroIndicators}
        macroFamilies={MACRO_FAMILIES}
        macroMeta={{
          year_start:   MACRO_META.year_start,
          year_end:     MACRO_META.year_end,
          computed_at:  MACRO_META.computed_at,
        }}
        initialTab={initialTab}
      />

      {/* Borradores del agente diario para este país */}
      <AgentDraftsBlock countrySlug={slug} />
    </div>
  );
}

function AgentDraftsBlock({ countrySlug }: { countrySlug: string }) {
  const drafts = getAgentDraftsByCountry(countrySlug);
  if (drafts.length === 0) return null;

  const fmtDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${d} ${meses[m - 1]} ${y}`;
  };

  return (
    <section style={{
      borderTop: "var(--mi-border-bold)",
      padding: "var(--mi-space-7) var(--mi-space-6)",
      background: "var(--mi-bg-paper)",
    }}>
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-widest)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
        marginBottom: "var(--mi-space-3)",
      }}>
        Producción interna · agente diario
      </div>
      <h2 style={{
        fontFamily: "var(--mi-font-title)",
        fontWeight: 700,
        fontSize: "var(--mi-text-2xl)",
        color: "var(--mi-ink)",
        marginBottom: "var(--mi-space-2)",
      }}>
        Borradores del agente
      </h2>
      <p style={{
        fontFamily: "var(--mi-font-body)",
        fontStyle: "italic",
        fontSize: "var(--mi-text-sm)",
        color: "var(--mi-ink-soft)",
        maxWidth: "60ch",
        marginBottom: "var(--mi-space-5)",
      }}>
        {drafts.length === 1
          ? "Hay un borrador automatizado todavía no publicado en Substack."
          : `Hay ${drafts.length} borradores automatizados todavía no publicados en Substack.`}
      </p>
      <ul style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gap: "var(--mi-space-3)",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      }}>
        {drafts.map(d => (
          <li key={d.slug}>
            <Link
              href={`/analisis/borradores/${d.countrySlug}/${d.pieceSlug}`}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              <article style={{
                border: "var(--mi-border-bold)",
                boxShadow: "var(--mi-shadow-card)",
                background: "var(--mi-bg-paper)",
                padding: "var(--mi-space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--mi-space-2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-2)", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--mi-bg-paper)",
                    background: "var(--mi-ink)",
                    padding: "2px 6px",
                    fontWeight: 700,
                  }}>
                    Borrador
                  </span>
                  <span style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--mi-ink-mute)",
                  }}>
                    {fmtDate(d.date)}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "var(--mi-font-title)",
                  fontWeight: 600,
                  fontSize: "var(--mi-text-base)",
                  lineHeight: "var(--mi-leading-snug)",
                  color: "var(--mi-ink)",
                  margin: 0,
                }}>
                  {d.title}
                </h3>
                {d.lede && (
                  <p style={{
                    fontFamily: "var(--mi-font-body)",
                    fontStyle: "italic",
                    fontSize: "var(--mi-text-sm)",
                    lineHeight: "var(--mi-leading-normal)",
                    color: "var(--mi-ink-soft)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    margin: 0,
                  }}>
                    {d.lede}
                  </p>
                )}
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
