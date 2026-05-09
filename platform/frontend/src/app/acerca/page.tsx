import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca",
  description: "Qué es Mapa Inestable, su hipótesis central, el método y el marco conceptual que organiza el análisis.",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--mi-font-mono)",
  fontSize: "var(--mi-text-xs)",
  letterSpacing: "var(--mi-tracking-widest)",
  textTransform: "uppercase",
  color: "var(--mi-ink-mute)",
  display: "block",
  marginBottom: "var(--mi-space-3)",
};

const sectionStyle: React.CSSProperties = {
  borderTop: "var(--mi-border-thick)",
  paddingTop: "var(--mi-space-6)",
  paddingBottom: "var(--mi-space-6)",
};

export default function AcercaPage() {
  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

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
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Acerca del proyecto</span>
      </div>

      {/* Hero textual */}
      <div style={{
        background: "var(--mi-bg)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
        boxShadow: "0 var(--mi-shadow-hero)",
      }} className="mi-grain">
        <div className="mi-container">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
            marginBottom: "var(--mi-space-3)",
          }}>
            Acerca de
          </div>
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(52px, 7vw, var(--mi-text-display))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "var(--mi-ink)",
            textTransform: "uppercase",
            marginBottom: "var(--mi-space-4)",
          }}>
            Mapa Inestable
          </h1>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-lg)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
          }}>
            Cartografía política del sur · Año II
          </div>
        </div>
      </div>

      <div className="mi-container" style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-9)" }}>

        {/* Hipótesis central */}
        <div style={{
          border: "var(--mi-border-thick)",
          boxShadow: "var(--mi-shadow-hero)",
          background: "var(--mi-bg-paper)",
          padding: "var(--mi-space-6) var(--mi-space-7)",
          marginBottom: "var(--mi-space-7)",
          maxWidth: "var(--mi-container-prose)",
        }}>
          <span style={{
            ...labelStyle,
            color: "var(--mi-accent-warn)",
            marginBottom: "var(--mi-space-4)",
          }}>
            Hipótesis central
          </span>
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-2xl)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink)",
            letterSpacing: "var(--mi-tracking-tight)",
          }}>
            Las estructuras que organizaban la vida colectiva pierden capacidad de mediación. Mapa Inestable rastrea esa pérdida.
          </p>
        </div>

        {/* Qué hacemos */}
        <section style={sectionStyle}>
          <span style={labelStyle}>Qué hacemos</span>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--mi-space-7)",
            alignItems: "start",
          }}>
            <div style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-lg)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-ink-soft)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--mi-space-4)",
            }}>
              <p>
                Mapa Inestable no reacciona a la coyuntura. Identifica transformaciones estructurales en política, cultura y percepción de la realidad. La diferencia no es de tema sino de escala temporal: lo que aquí importa no es lo que pasó esta semana sino lo que lleva años ocurriendo sin que nadie lo nombre con precisión.
              </p>
              <p>
                Cubrimos diez países de Sudamérica —Argentina, Brasil, Chile, Colombia, Bolivia, Perú, Uruguay, Paraguay, Ecuador y Venezuela— con la misma lente conceptual aplicada a cada uno. No comparamos para jerarquizar: comparamos para entender el patrón que atraviesa la región.
              </p>
              <p>
                El análisis adopta la forma de una pieza por país, escrita desde un evento concreto que funciona como entrada al proceso estructural que ese evento revela. Cada pieza sigue el mismo procedimiento de cuatro pasos.
              </p>
            </div>
            <div style={{
              background: "var(--mi-bg-cream)",
              border: "var(--mi-border-thick)",
              padding: "var(--mi-space-5)",
            }}>
              <span style={{ ...labelStyle, marginBottom: "var(--mi-space-4)" }}>Pregunta central</span>
              <p style={{
                fontFamily: "var(--mi-font-title)",
                fontStyle: "italic",
                fontSize: "var(--mi-text-lg)",
                lineHeight: "var(--mi-leading-relaxed)",
                color: "var(--mi-ink)",
              }}>
                ¿Cómo se sostiene la vida democrática cuando se debilitan las mediaciones culturales, políticas y cognitivas que la hicieron posible?
              </p>
            </div>
          </div>
        </section>

        {/* Cómo leer Mapa Inestable */}
        <section style={sectionStyle}>
          <span style={labelStyle}>Cómo leer Mapa Inestable</span>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--mi-space-4)",
          }}>
            {[
              {
                label: "Análisis",
                desc: "Piezas por país siguiendo el método de cuatro pasos. Cada análisis parte de un evento concreto y lo desplaza hacia el proceso estructural que revela.",
                href: "/analisis",
                cta: "→ /analisis",
              },
              {
                label: "Despacho",
                desc: "Integración semanal de los análisis. Una lectura del período que pone en relación lo que ocurrió en distintos países bajo el mismo marco.",
                href: "/despachos",
                cta: "→ /despachos",
              },
              {
                label: "Ensayos",
                desc: "Piezas más largas que trabajan un eje conceptual en profundidad. El análisis extendido que la forma del despacho no permite.",
                href: "/ensayos",
                cta: "→ /ensayos",
              },
            ].map(({ label, desc, href, cta }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "var(--mi-border-thick)",
                  background: "var(--mi-bg-paper)",
                  boxShadow: "var(--mi-shadow-card)",
                  padding: "var(--mi-space-5)",
                  gap: "var(--mi-space-3)",
                  textDecoration: "none",
                }}
                className="mi-eje-card"
              >
                <h3 style={{
                  fontFamily: "var(--mi-font-display)",
                  fontSize: "var(--mi-text-xl)",
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                  color: "var(--mi-ink)",
                }}>
                  {label}
                </h3>
                <p style={{
                  fontFamily: "var(--mi-font-body)",
                  fontSize: "var(--mi-text-sm)",
                  lineHeight: "var(--mi-leading-relaxed)",
                  color: "var(--mi-ink-soft)",
                  flex: 1,
                }}>
                  {desc}
                </p>
                <div style={{
                  borderTop: "var(--mi-border-dashed)",
                  paddingTop: "var(--mi-space-2)",
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  letterSpacing: "var(--mi-tracking-wider)",
                  textTransform: "uppercase",
                  color: "var(--mi-ink)",
                }}>
                  {cta}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* El marco */}
        <section style={sectionStyle}>
          <span style={labelStyle}>El marco</span>
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-base)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink-soft)",
            marginBottom: "var(--mi-space-5)",
            maxWidth: "60ch",
          }}>
            El proyecto se sostiene sobre dos piezas: un conjunto de conceptos que nombran las transformaciones en curso, y un procedimiento que organiza cómo se las analiza.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--mi-space-4)",
            maxWidth: "720px",
          }}>
            <Link
              href="/ejes"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-paper)",
                boxShadow: "var(--mi-shadow-card)",
                padding: "var(--mi-space-5)",
                gap: "var(--mi-space-3)",
                textDecoration: "none",
              }}
              className="mi-eje-card"
            >
              <h3 style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-accent-warn)",
              }}>
                Los seis ejes
              </h3>
              <p style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-sm)",
                lineHeight: "var(--mi-leading-relaxed)",
                color: "var(--mi-ink-soft)",
                flex: 1,
              }}>
                Marco interpretativo que lee las transformaciones estructurales en política, cultura y cognición.
              </p>
              <div style={{
                borderTop: "var(--mi-border-dashed)",
                paddingTop: "var(--mi-space-2)",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
              }}>
                → /ejes
              </div>
            </Link>

            <Link
              href="/metodo"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-paper)",
                boxShadow: "var(--mi-shadow-card)",
                padding: "var(--mi-space-5)",
                gap: "var(--mi-space-3)",
                textDecoration: "none",
              }}
              className="mi-eje-card"
            >
              <h3 style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-accent-warn)",
              }}>
                El método
              </h3>
              <p style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-sm)",
                lineHeight: "var(--mi-leading-relaxed)",
                color: "var(--mi-ink-soft)",
                flex: 1,
              }}>
                Procedimiento de análisis en cuatro pasos: disparador, desplazamiento, conceptualización, apertura.
              </p>
              <div style={{
                borderTop: "var(--mi-border-dashed)",
                paddingTop: "var(--mi-space-2)",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
              }}>
                → /metodo
              </div>
            </Link>
          </div>
        </section>

        {/* Autoría + fecha + contacto */}
        <section style={{
          ...sectionStyle,
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "var(--mi-space-7)",
        }}>
          <div>
            <span style={labelStyle}>Autoría</span>
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-base)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-ink-soft)",
              maxWidth: "44ch",
            }}>
              Tomás Peña Agrest. Periodista y analista político radicado en Buenos Aires. Mapa Inestable es una herramienta de pensamiento para leer Sudamérica en clave estructural.
            </p>
          </div>
          <div>
            <span style={labelStyle}>Año II</span>
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-sm)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-ink)",
            }}>
              Desde marzo de 2024
            </p>
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
              marginTop: "var(--mi-space-2)",
            }}>
              Despacho semanal · Análisis por país
            </p>
          </div>
          <div>
            <span style={labelStyle}>Contacto</span>
            <a
              href="mailto:tpena@brevity.pro"
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-sm)",
                color: "var(--mi-ink)",
                borderBottom: "1px solid var(--mi-ink)",
                display: "inline-block",
                marginBottom: "var(--mi-space-3)",
              }}
            >
              tpena@brevity.pro
            </a>
            <br />
            <a
              href="https://mapainestable.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}
            >
              Substack ↗
            </a>
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              color: "var(--mi-ink-mute)",
              lineHeight: "var(--mi-leading-relaxed)",
              marginTop: "var(--mi-space-3)",
            }}>
              El sitio es el repositorio canónico. Substack es el canal de distribución por email — los despachos llegan al inbox desde allí.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
