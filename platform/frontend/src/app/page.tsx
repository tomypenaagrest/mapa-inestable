import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";

export const metadata: Metadata = {
  title: { absolute: "Mapa Inestable · Cartografía política del sur" },
  description: "Análisis estructural de Sudamérica. Los procesos que transforman la política, la cultura y la percepción de la realidad en diez países.",
  openGraph: {
    title: "Mapa Inestable · Cartografía política del sur",
    description: "Análisis estructural de Sudamérica. Los procesos que transforman la política, la cultura y la percepción de la realidad en diez países.",
  },
};

/* === DATOS MOCK (reemplazar por fetch al backend) ============== */

const COUNTRY_TO_CAPITAL: Record<string, string> = {
  ar: "Buenos Aires", br: "Brasília", cl: "Santiago", co: "Bogotá",
  bo: "La Paz", pe: "Lima", uy: "Montevideo", py: "Asunción",
  ec: "Quito", ve: "Caracas",
};

const FEATURED = {
  country: "Colombia",
  countrySlug: "co",
  axis: "Desorientación epistemológica",
  axisKey: "desorientacion",
  title: "La sospecha antes del voto",
  lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Lo nuevo no es el discurso —es de Trump, Bolsonaro, Milei— sino que ahora sea pronunciado por la izquierda. Cuando ambos lados operan bajo sospecha permanente, el voto deja de ser un acto democrático.",
  source: "La Silla Vacía",
  date: "27 abr 2026",
  slug: "la-sospecha-antes-del-voto",
};

const GRID_ANALYSES = [
  {
    country: "Argentina", countrySlug: "ar",
    axis: "Erosión de mediaciones", axisKey: "mediaciones",
    title: "El revés de la motosierra",
    desc: "Los gobernadores que sostuvieron el ajuste empiezan a despegarse. La pregunta es quién media entre el palacio y el territorio.",
    source: "Infobae",
    slug: "el-reves-de-la-motosierra",
  },
  {
    country: "Chile", countrySlug: "cl",
    axis: "Desrepresentación", axisKey: "desrepresentacion",
    title: "La constitución que no fue, otra vez",
    desc: "Tres procesos fallidos. La pregunta ya no es qué constitución, sino si todavía hay un demos para escribirla.",
    source: "CIPER",
    slug: "la-constitucion-que-no-fue",
  },
  {
    country: "Brasil", countrySlug: "br",
    axis: "Estetización", axisKey: "estetizacion",
    title: "Fluminense y los nuevos altares",
    desc: "El club como única estructura de pertenencia funcional. Cuando todo se desarma, queda el escudo.",
    source: "Folha",
    slug: "fluminense-y-los-nuevos-altares",
  },
  {
    country: "Bolivia", countrySlug: "bo",
    axis: "Erosión de mediaciones", axisKey: "mediaciones",
    title: "El MAS sin Evo, sin Arce, sin destino",
    desc: "Dos décadas de hegemonía se desarman sin que aparezca quién venga después. La izquierda boliviana frente al vacío.",
    source: "Los Tiempos",
    slug: "el-mas-sin-evo-sin-arce",
  },
];

const WEEK_COUNTRY_SLUGS = [
  FEATURED.countrySlug,
  ...GRID_ANALYSES.map(a => a.countrySlug),
].filter((slug, idx, arr) => arr.indexOf(slug) === idx);

const WEEK_CITIES = WEEK_COUNTRY_SLUGS.map(s => COUNTRY_TO_CAPITAL[s]).filter(Boolean);
const CITIES_DISPLAY = WEEK_CITIES.length <= 4
  ? WEEK_CITIES.join(" · ")
  : WEEK_CITIES.slice(0, 4).join(" · ") + ` + ${WEEK_CITIES.length - 4} más`;

/* === COMPONENTES ================================================ */

function HeroFeatured() {
  return (
    <article style={{
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      border: "var(--mi-border-bold)",
      background: "var(--mi-bg-paper)",
      boxShadow: "var(--mi-shadow-hero)",
      marginBottom: "var(--mi-space-7)",
    }}>
      {/* Arte — país display */}
      <div
        className="mi-grain"
        style={{
          background: "var(--mi-bg-dark)",
          color: "var(--mi-bg-paper)",
          padding: "var(--mi-space-6) var(--mi-space-6) var(--mi-space-5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 460,
        }}
      >
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-accent-gold)",
          border: "1px solid var(--mi-accent-gold)",
          padding: "4px 10px",
          alignSelf: "flex-start",
        }}>
          Análisis · {FEATURED.date}
        </div>

        <div style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "clamp(64px, 8vw, var(--mi-text-display))",
          lineHeight: 0.85,
          letterSpacing: "-0.03em",
          color: "var(--mi-bg)",
          textTransform: "uppercase",
          textShadow: "4px 4px 0 var(--mi-accent-gold)",
        }}>
          {FEATURED.country}
        </div>

        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          lineHeight: "var(--mi-leading-relaxed)",
          borderTop: "1px solid rgba(244,233,210,0.2)",
          paddingTop: "var(--mi-space-4)",
        }}>
          <div><span style={{ color: "var(--mi-accent-gold)" }}>País</span> · {FEATURED.country}</div>
          <div><span style={{ color: "var(--mi-accent-gold)" }}>Eje activado</span> · {FEATURED.axis}</div>
          <div><span style={{ color: "var(--mi-accent-gold)" }}>Fuente</span> · {FEATURED.source}</div>
        </div>
      </div>

      {/* Texto */}
      <div style={{
        padding: "var(--mi-space-6) var(--mi-space-6) var(--mi-space-5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "var(--mi-space-4)",
      }}>
        <span style={{
          alignSelf: "flex-start",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-bg-paper)",
          background: "var(--mi-ink)",
          padding: "4px 10px",
        }}>
          {FEATURED.axis}
        </span>

        <h1 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 700,
          fontSize: "var(--mi-text-4xl)",
          lineHeight: "var(--mi-leading-snug)",
          letterSpacing: "var(--mi-tracking-tight)",
          color: "var(--mi-ink)",
        }}>
          {FEATURED.title}
        </h1>

        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-lg)",
          lineHeight: "var(--mi-leading-normal)",
          color: "var(--mi-ink-soft)",
        }}>
          {FEATURED.lede}
        </p>

        <Link
          href={`/analisis/${FEATURED.countrySlug}/${FEATURED.slug}`}
          style={{
            alignSelf: "flex-start",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wider)",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            borderBottom: "2px solid var(--mi-ink)",
            paddingBottom: 4,
          }}
        >
          Leer análisis completo →
        </Link>
      </div>
    </article>
  );
}

function AnalysisCard({ a }: { a: typeof GRID_ANALYSES[0] }) {
  return (
    <article style={{
      background: "var(--mi-bg-paper)",
      border: "var(--mi-border-thick)",
      padding: "var(--mi-space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--mi-space-3)",
      boxShadow: "var(--mi-shadow-card)",
    }}>
      <span className="mi-country-tag">{a.country}</span>

      <h3 style={{
        fontFamily: "var(--mi-font-title)",
        fontWeight: 600,
        fontSize: "var(--mi-text-xl)",
        lineHeight: "var(--mi-leading-snug)",
        color: "var(--mi-ink)",
        flex: 1,
      }}>
        <Link href={`/analisis/${a.countrySlug}/${a.slug}`}>{a.title}</Link>
      </h3>

      <p style={{
        fontFamily: "var(--mi-font-body)",
        fontSize: "var(--mi-text-sm)",
        lineHeight: "var(--mi-leading-relaxed)",
        color: "var(--mi-ink-soft)",
      }}>
        {a.desc}
      </p>

      <div style={{
        borderTop: "var(--mi-border-dashed)",
        paddingTop: "var(--mi-space-2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "var(--mi-space-2)",
        flexWrap: "wrap",
      }}>
        <Link
          href={`/ejes/${AXIS_KEY_TO_SLUG[a.axisKey] ?? a.axisKey}`}
          className="mi-axis-pill"
          style={{ background: `var(--mi-axis-${a.axisKey})` }}
        >
          {a.axis}
        </Link>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          textTransform: "uppercase",
          letterSpacing: "var(--mi-tracking-wide)",
        }}>
          {a.source}
        </span>
      </div>
    </article>
  );
}

/* === MASTHEAD ================================================== */

function Masthead() {
  return (
    <section style={{
      background: "var(--mi-bg)",
      minHeight: "clamp(160px, 20vw, 200px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--mi-space-2)",
      padding: "var(--mi-space-5) var(--mi-space-6)",
      borderBottom: "var(--mi-border-bold)",
    }}>
      <Logo variant="icon" size="lg" color="var(--mi-bg-paper)" />
      <div style={{
        fontFamily: "var(--mi-font-display)",
        fontSize: "clamp(48px, 7vw, var(--mi-text-5xl))",
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        color: "var(--mi-bg-paper)",
        lineHeight: 1,
      }}>
        Mapa Inestable
      </div>
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-widest)",
        textTransform: "uppercase",
        color: "var(--mi-accent-gold)",
        marginTop: "var(--mi-space-1)",
      }}>
        Cartografía política del sur
      </div>
    </section>
  );
}

/* === PAGE ====================================================== */

export default function HomePage() {
  return (
    <div>
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
        <span style={{ color: "var(--mi-accent-gold)" }}>Semana 19 · 2026</span>
        <span>{CITIES_DISPLAY}</span>
      </div>

      <Masthead />

      <div className="mi-container" style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-7)" }}>

        <HeroFeatured />

        <section>
          <h2 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-2xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--mi-ink)",
            borderBottom: "var(--mi-border-bold)",
            paddingBottom: "var(--mi-space-3)",
            marginBottom: "var(--mi-space-5)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}>
            La semana
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-sm)",
              letterSpacing: "var(--mi-tracking-wide)",
              color: "var(--mi-ink-soft)",
              textTransform: "uppercase",
            }}>
              cuatro países
            </span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--mi-space-4)",
          }}>
            {GRID_ANALYSES.map(a => <AnalysisCard key={a.slug} a={a} />)}
          </div>
        </section>

      </div>
    </div>
  );
}
