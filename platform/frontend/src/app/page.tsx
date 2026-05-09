import Link from "next/link";
import type { Metadata } from "next";
import { getAllConceptos } from "@/lib/conceptos";
import CarruselEditorial, { type CarruselSlide } from "@/components/CarruselEditorial";
import MapaHeatmapSection from "@/components/MapaHeatmapSection";
import HomeClientLayout from "@/components/HomeClientLayout";
import NewSinceLastVisit from "@/components/NewSinceLastVisit";
import WhileYouWereAway from "@/components/WhileYouWereAway";
import type { HeatmapCell, WeekLabel } from "@/components/HeatmapEjes";
import type { WeeklyCountryData } from "@/components/MapaCentrico";

export const metadata: Metadata = {
  title: { absolute: "Mapa Inestable · Cartografía política del sur" },
  description: "Análisis estructural de Sudamérica. Los procesos que transforman la política, la cultura y la percepción de la realidad en diez países.",
  openGraph: {
    title: "Mapa Inestable · Cartografía política del sur",
    description: "Análisis estructural de Sudamérica. Los procesos que transforman la política, la cultura y la percepción de la realidad en diez países.",
  },
};

/* === MOCK DATA (reemplazar por fetch al backend) ================ */

const WEEK = 19;
const YEAR = 2026;

const WEEK_ANALYSES: CarruselSlide[] = [
  {
    slug: "la-sospecha-antes-del-voto",
    countrySlug: "co", country: "Colombia",
    axis: "Desorientación epistemológica", axisKey: "desorientacion",
    title: "La sospecha antes del voto",
    lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Cuando ambos lados operan bajo sospecha permanente, el voto deja de ser un acto democrático.",
    date: "27 abr 2026",
    publishedIso: "2026-04-27",
  },
  {
    slug: "el-reves-de-la-motosierra",
    countrySlug: "ar", country: "Argentina",
    axis: "Erosión de mediaciones", axisKey: "mediaciones",
    title: "El revés de la motosierra",
    lede: "Los gobernadores que sostuvieron el ajuste empiezan a despegarse. La pregunta es quién media entre el palacio y el territorio cuando el consenso se fractura.",
    date: "19 abr 2026",
    publishedIso: "2026-04-19",
  },
  {
    slug: "la-constitucion-que-no-fue",
    countrySlug: "cl", country: "Chile",
    axis: "Desrepresentación", axisKey: "desrepresentacion",
    title: "La constitución que no fue, otra vez",
    lede: "Tres procesos fallidos. La pregunta ya no es qué constitución, sino si todavía hay un demos para escribirla.",
    date: "14 abr 2026",
    publishedIso: "2026-04-14",
  },
  {
    slug: "fluminense-y-los-nuevos-altares",
    countrySlug: "br", country: "Brasil",
    axis: "Estetización de la cultura", axisKey: "estetizacion",
    title: "Fluminense y los nuevos altares",
    lede: "El club como única estructura de pertenencia funcional. Cuando todo se desarma, queda el escudo.",
    date: "21 abr 2026",
    publishedIso: "2026-04-21",
  },
  {
    slug: "el-mas-sin-evo-sin-arce",
    countrySlug: "bo", country: "Bolivia",
    axis: "Erosión de mediaciones", axisKey: "mediaciones",
    title: "El MAS sin Evo, sin Arce, sin destino",
    lede: "Dos décadas de hegemonía se desarman sin que aparezca quién venga después. La izquierda boliviana frente al vacío.",
    date: "12 abr 2026",
    publishedIso: "2026-04-12",
  },
];

const FEATURED_AXIS = {
  name: "Desorientación epistemológica",
  slug: "desorientacion-epistemologica",
  axisKey: "desorientacion",
  count: 3,
  total: WEEK_ANALYSES.length,
};

const WEEKLY_COUNTRIES: WeeklyCountryData[] = [
  { slug: "co", axisKey: "desorientacion", lastTitle: "La sospecha antes del voto",            lastSlug: "la-sospecha-antes-del-voto",        lastAxis: "Desorientación epistemológica" },
  { slug: "ar", axisKey: "mediaciones",    lastTitle: "El revés de la motosierra",              lastSlug: "el-reves-de-la-motosierra",         lastAxis: "Erosión de mediaciones" },
  { slug: "cl", axisKey: "desrepresentacion", lastTitle: "La constitución que no fue, otra vez", lastSlug: "la-constitucion-que-no-fue",       lastAxis: "Desrepresentación" },
  { slug: "br", axisKey: "estetizacion",   lastTitle: "Fluminense y los nuevos altares",        lastSlug: "fluminense-y-los-nuevos-altares",   lastAxis: "Estetización de la cultura" },
  { slug: "bo", axisKey: "mediaciones",    lastTitle: "El MAS sin Evo, sin Arce, sin destino",  lastSlug: "el-mas-sin-evo-sin-arce",           lastAxis: "Erosión de mediaciones" },
];

const WEEKLY_SLUGS = WEEKLY_COUNTRIES.map(c => c.slug);

// Últimas 12 semanas (8–19 de 2026)
const HEATMAP_WEEKS: WeekLabel[] = Array.from({ length: 12 }, (_, i) => ({
  week: 8 + i, year: 2026, label: `S${8 + i}`,
}));

const HEATMAP_DATA: HeatmapCell[] = [
  { axisKey: "deculturacion",     week: 10, year: 2026, count: 1 },
  { axisKey: "deculturacion",     week: 12, year: 2026, count: 1 },
  { axisKey: "deculturacion",     week: 16, year: 2026, count: 1 },

  { axisKey: "mediaciones",       week:  8, year: 2026, count: 2 },
  { axisKey: "mediaciones",       week:  9, year: 2026, count: 1 },
  { axisKey: "mediaciones",       week: 10, year: 2026, count: 2 },
  { axisKey: "mediaciones",       week: 11, year: 2026, count: 1 },
  { axisKey: "mediaciones",       week: 12, year: 2026, count: 1 },
  { axisKey: "mediaciones",       week: 13, year: 2026, count: 2 },
  { axisKey: "mediaciones",       week: 14, year: 2026, count: 3 },
  { axisKey: "mediaciones",       week: 15, year: 2026, count: 2 },
  { axisKey: "mediaciones",       week: 16, year: 2026, count: 1 },
  { axisKey: "mediaciones",       week: 17, year: 2026, count: 1 },
  { axisKey: "mediaciones",       week: 18, year: 2026, count: 2 },
  { axisKey: "mediaciones",       week: 19, year: 2026, count: 2 },

  { axisKey: "desrepresentacion", week:  8, year: 2026, count: 1 },
  { axisKey: "desrepresentacion", week:  9, year: 2026, count: 1 },
  { axisKey: "desrepresentacion", week: 11, year: 2026, count: 3 },
  { axisKey: "desrepresentacion", week: 13, year: 2026, count: 1 },
  { axisKey: "desrepresentacion", week: 14, year: 2026, count: 1 },
  { axisKey: "desrepresentacion", week: 17, year: 2026, count: 2 },
  { axisKey: "desrepresentacion", week: 19, year: 2026, count: 1 },

  { axisKey: "estetizacion",      week:  9, year: 2026, count: 1 },
  { axisKey: "estetizacion",      week: 12, year: 2026, count: 2 },
  { axisKey: "estetizacion",      week: 15, year: 2026, count: 2 },
  { axisKey: "estetizacion",      week: 17, year: 2026, count: 1 },
  { axisKey: "estetizacion",      week: 18, year: 2026, count: 1 },
  { axisKey: "estetizacion",      week: 19, year: 2026, count: 1 },

  { axisKey: "desorientacion",    week:  8, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week:  9, year: 2026, count: 2 },
  { axisKey: "desorientacion",    week: 10, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week: 11, year: 2026, count: 2 },
  { axisKey: "desorientacion",    week: 13, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week: 14, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week: 15, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week: 16, year: 2026, count: 2 },
  { axisKey: "desorientacion",    week: 17, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week: 18, year: 2026, count: 1 },
  { axisKey: "desorientacion",    week: 19, year: 2026, count: 3 },

  { axisKey: "atencion",          week: 10, year: 2026, count: 1 },
  { axisKey: "atencion",          week: 12, year: 2026, count: 2 },
  { axisKey: "atencion",          week: 14, year: 2026, count: 1 },
  { axisKey: "atencion",          week: 18, year: 2026, count: 2 },
];

const LAST_DISPATCH = {
  number: 47,
  title: "La sospecha como arma",
  lede: "Cuando la duda sobre el proceso electoral se convierte en táctica política, el voto pierde densidad democrática. Esta semana en Colombia, Argentina y Bolivia el síntoma fue el mismo: las instituciones existen pero ya no median.",
};

/* === PAGE ====================================================== */

export default function HomePage() {
  const conceptos = getAllConceptos().map(c => ({ slug: c.slug, name: c.name }));

  const whileAwaySlides = WEEK_ANALYSES.map(s => ({
    slug: s.slug,
    countrySlug: s.countrySlug,
    country: s.country,
    axisKey: s.axisKey,
    axisName: s.axis,
    publishedIso: s.publishedIso ?? "",
  }));

  return (
    <HomeClientLayout conceptos={conceptos} weeklyCountrySlugs={WEEKLY_SLUGS}>

      {/* Mientras estuviste fuera — aparece si ≥14 días sin visitar */}
      <WhileYouWereAway slides={whileAwaySlides} year={YEAR} week={WEEK} />

      {/* Bloque "Esta semana" */}
      <section style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-4) var(--mi-space-5)",
        background: "var(--mi-bg-paper)",
      }}>
        {/* Novedades desde última visita */}
        <NewSinceLastVisit slides={WEEK_ANALYSES.map(s => ({ slug: s.slug, publishedIso: s.publishedIso ?? "" }))} />

        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-2)",
        }}>
          Semana {WEEK} · {YEAR}
        </div>
        <div style={{
          display: "flex",
          alignItems: "baseline",
          gap: "var(--mi-space-3)",
          flexWrap: "wrap",
        }}>
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-2xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--mi-ink)",
          }}>
            Esta semana ·{" "}
            <Link
              href={`/ejes/${FEATURED_AXIS.slug}`}
              style={{ color: `var(--mi-axis-${FEATURED_AXIS.axisKey})` }}
            >
              {FEATURED_AXIS.name}
            </Link>
          </h1>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-sm)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
          }}>
            {FEATURED_AXIS.count} de {FEATURED_AXIS.total} análisis lo activaron
          </span>
        </div>
      </section>

      {/* Carrusel */}
      <div style={{ padding: "var(--mi-space-5) var(--mi-space-5) 0" }}>
        <CarruselEditorial slides={WEEK_ANALYSES} />
      </div>

      {/* Mapa + Heatmap */}
      <div style={{ padding: "0 var(--mi-space-5)" }}>
        <MapaHeatmapSection
          weeklyCountries={WEEKLY_COUNTRIES}
          heatmapData={HEATMAP_DATA}
          weeks={HEATMAP_WEEKS}
        />
      </div>

      {/* Bloque despacho */}
      <section style={{
        margin: "0 var(--mi-space-5) var(--mi-space-6)",
        background: "var(--mi-bg-dark)",
        color: "var(--mi-bg-paper)",
        padding: "var(--mi-space-5)",
        border: "var(--mi-border-bold)",
        boxShadow: "var(--mi-shadow-card)",
      }}>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-accent-gold)",
          marginBottom: "var(--mi-space-3)",
        }}>
          Despacho {LAST_DISPATCH.number} · Semana {WEEK}
        </div>
        <h2 style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "var(--mi-text-2xl)",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          color: "var(--mi-bg-paper)",
          marginBottom: "var(--mi-space-3)",
        }}>
          {LAST_DISPATCH.title}
        </h2>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-base)",
          lineHeight: "var(--mi-leading-normal)",
          color: "rgba(244,233,210,0.8)",
          marginBottom: "var(--mi-space-4)",
          maxWidth: "64ch",
        }}>
          {LAST_DISPATCH.lede}
        </p>
        <div style={{ display: "flex", gap: "var(--mi-space-3)", flexWrap: "wrap" }}>
          <Link
            href={`/despachos/${YEAR}/${WEEK}`}
            className="mi-btn"
            style={{
              background: "var(--mi-accent-gold)",
              color: "var(--mi-ink)",
              border: "2px solid var(--mi-accent-gold)",
            }}
          >
            Leer despacho →
          </Link>
          <Link
            href="https://mapainestable.substack.com"
            className="mi-btn mi-btn--ghost"
            style={{ borderColor: "var(--mi-accent-gold)", color: "var(--mi-accent-gold)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Suscribirse
          </Link>
        </div>
      </section>

    </HomeClientLayout>
  );
}
