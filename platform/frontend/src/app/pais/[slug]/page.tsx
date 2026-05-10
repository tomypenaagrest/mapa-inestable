import Link from "next/link";
import type { Metadata } from "next";
import { getCountrySections, findSection, otherSections } from "@/lib/content";
import {
  COUNTRY_EJES,
  COUNTRY_SOURCES,
  COUNTRY_NAMES,
} from "@/lib/country-data";
import { getAnalysesByCountry } from "@/lib/analisis";
import { getCountryIndicators, LB_META, COVERED_COUNTRIES } from "@/lib/latinobarometro";
import { getCountryMacro, MACRO_FAMILIES, MACRO_META } from "@/lib/macro-indicators";
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
  const analyses     = getAnalysesByCountry(slug);
  const sections     = getCountrySections(slug) ?? [];

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
    </div>
  );
}
