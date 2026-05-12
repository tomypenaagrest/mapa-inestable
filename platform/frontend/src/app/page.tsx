import Link from "next/link";
import type { Metadata } from "next";
import { getAllConceptosMeta } from "@/lib/conceptos";
import { getAllAutores } from "@/lib/autores";
import { getHomeData } from "@/lib/home";
import { getAllCountryAgendas } from "@/lib/agendas";
import { EJES } from "@/lib/ejes";
import CarruselEditorial, { type CarruselSlide } from "@/components/CarruselEditorial";
import MapaHeatmapSection from "@/components/MapaHeatmapSection";
import HomeClientLayout from "@/components/HomeClientLayout";
import NewSinceLastVisit from "@/components/NewSinceLastVisit";
import WhileYouWereAway from "@/components/WhileYouWereAway";

export const metadata: Metadata = {
  title: { absolute: "Mapa Inestable · Cartografía política del sur" },
  description: "Análisis estructural de Sudamérica. Los procesos que transforman la política, la cultura y la percepción de la realidad en diez países.",
  openGraph: {
    title: "Mapa Inestable · Cartografía política del sur",
    description: "Análisis estructural de Sudamérica. Los procesos que transforman la política, la cultura y la percepción de la realidad en diez países.",
  },
};

export default function HomePage() {
  const data             = getHomeData();
  const conceptos        = getAllConceptosMeta();
  const autores          = getAllAutores().map(a => ({ slug: a.slug, name: a.name }));
  const agendasByCountry = getAllCountryAgendas();

  // Carrusel: publicaciones reales mapeadas a CarruselSlide
  const slides: CarruselSlide[] = data.cards.map(p => {
    const eje = EJES.find(e => e.axisKey === p.ejePrincipal);
    return {
      slug:        p.slug,
      countrySlug: p.countrySlug ?? "",
      country:     p.country     ?? "",
      axis:        eje?.name     ?? p.ejePrincipal,
      axisKey:     p.ejePrincipal,
      title:       p.title,
      lede:        p.subtitle    ?? "",
      date:        p.published_at,
      publishedIso: p.fecha,
      href:        `/publicaciones/${p.slug}`,
    };
  });

  const whileAwaySlides = data.cards.map(p => {
    const eje = EJES.find(e => e.axisKey === p.ejePrincipal);
    return {
      slug:        p.slug,
      countrySlug: p.countrySlug ?? "",
      country:     p.country     ?? "",
      axisKey:     p.ejePrincipal,
      axisName:    eje?.name     ?? p.ejePrincipal,
      publishedIso: p.fecha,
    };
  });

  const weeklyCountrySlugs = data.weeklyCountries.map(c => c.slug);

  return (
    <HomeClientLayout conceptos={conceptos} autores={autores} weeklyCountrySlugs={weeklyCountrySlugs}>

      {/* Mientras estuviste fuera — aparece si ≥14 días sin visitar */}
      <WhileYouWereAway
        slides={whileAwaySlides}
        year={data.currentYear}
        week={data.currentWeek}
      />

      {/* Bloque "Esta semana" — omitido si no hay corpus de la semana actual */}
      {data.thisWeek && (
        <section style={{
          borderBottom: "var(--mi-border-bold)",
          padding: "var(--mi-space-4) var(--mi-space-5)",
          background: "var(--mi-bg-paper)",
        }}>
          <NewSinceLastVisit
            slides={data.cards.map(p => ({ slug: p.slug, publishedIso: p.fecha }))}
          />
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-2)",
          }}>
            Semana {data.thisWeek.week} · {data.thisWeek.year}
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
                href={`/ejes/${data.thisWeek.ejeSlug}`}
                style={{ color: `var(--mi-axis-${data.thisWeek.ejeKey})` }}
              >
                {data.thisWeek.ejeName}
              </Link>
            </h1>
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-sm)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-soft)",
            }}>
              {data.thisWeek.activations} de {data.thisWeek.total} análisis lo activaron
            </span>
          </div>
        </section>
      )}

      {/* Carrusel — placeholder honesto si no hay publicaciones */}
      <div style={{ padding: "var(--mi-space-5) var(--mi-space-5) 0" }}>
        {slides.length > 0 ? (
          <CarruselEditorial slides={slides} />
        ) : (
          <p style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "13px",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            EL ARCHIVO ESTÁ ARRANCANDO<br />
            Las primeras publicaciones aparecen acá apenas estén cargadas.
          </p>
        )}
      </div>

      {/* Mapa + Heatmap */}
      <div style={{ padding: "0 var(--mi-space-5)" }}>
        <MapaHeatmapSection
          weeklyCountries={data.weeklyCountries}
          heatmapData={data.heatmap}
          weeks={data.heatmapWeeks}
          agendasByCountry={agendasByCountry}
        />
      </div>

      {/* Bloque despacho — omitido si no hay despachos en el vault */}
      {data.latestDispatch && (
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
            Despacho {data.latestDispatch.number} · Semana {data.latestDispatch.week}
          </div>
          <h2 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-2xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--mi-bg-paper)",
            marginBottom: "var(--mi-space-3)",
          }}>
            {data.latestDispatch.title}
          </h2>
          {data.latestDispatch.subtitle && (
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-base)",
              lineHeight: "var(--mi-leading-normal)",
              color: "rgba(244,233,210,0.8)",
              marginBottom: "var(--mi-space-4)",
              maxWidth: "64ch",
            }}>
              {data.latestDispatch.subtitle}
            </p>
          )}
          <div style={{ display: "flex", gap: "var(--mi-space-3)", flexWrap: "wrap" }}>
            <Link
              href={`/despachos/${data.latestDispatch.year}/${data.latestDispatch.week}`}
              className="mi-btn"
              style={{
                background: "var(--mi-accent-gold)",
                color: "var(--mi-ink)",
                border: "2px solid var(--mi-accent-gold)",
              }}
            >
              Leer despacho →
            </Link>
            <a
              href="https://mapainestable.substack.com"
              className="mi-btn mi-btn--ghost"
              style={{ borderColor: "var(--mi-accent-gold)", color: "var(--mi-accent-gold)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Suscribirse
            </a>
          </div>
        </section>
      )}

    </HomeClientLayout>
  );
}
