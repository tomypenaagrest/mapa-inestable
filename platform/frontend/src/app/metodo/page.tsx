import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Método",
  description: "Cuatro pasos para leer una escena. El procedimiento que organiza cada análisis de Mapa Inestable.",
};

const PASOS = [
  {
    num: "01",
    label: "Disparador",
    descripcion:
      "Una escena concreta. Una noticia, una imagen, una estadística específica con fuente trazable.",
    pedagogico:
      "El disparador no es el tema: es el evento puntual desde el que arranca el análisis. Sin disparador no hay pieza. Esta distinción importa: hablar de \"la crisis de representación en Argentina\" no es un disparador. El 18 de marzo de 2026, el Senado rechazó por tercera vez el mismo pliego judicial en tres meses —eso sí lo es. El disparador ancla el análisis en algo que ocurrió, con fecha y fuente. Evita la deriva hacia lo genérico.",
    ejemplo: "\"El 22 de abril, Gustavo Petro publicó en X una serie de mensajes cuestionando la capacidad del Consejo Nacional Electoral de garantizar elecciones limpias.\"",
  },
  {
    num: "02",
    label: "Desplazamiento",
    descripcion:
      "Del evento concreto al proceso estructural que ese evento revela.",
    pedagogico:
      "El desplazamiento es el movimiento central del método. Toma el disparador y pregunta: ¿qué proceso más largo, más amplio, más estructural está visible en este evento? No se trata de explicar por qué ocurrió el evento —eso es periodismo de causas— sino de identificar qué revela sobre transformaciones en curso que el evento hace momentáneamente visibles. El desplazamiento puede ir del suceso a la institución, del evento a la norma que lo vuelve posible, del dato a la condición que lo produce.",
    ejemplo: "\"Lo que Petro hace no es describir una amenaza real de fraude: está instalando el marco. La retórica del fraude preventivo ya no tiene dueño ideológico.\"",
  },
  {
    num: "03",
    label: "Conceptualización",
    descripcion:
      "Interpretación a través de uno o más de los seis ejes. Acá entra el marco.",
    pedagogico:
      "La conceptualización nombra lo que el desplazamiento reveló. Usa los ejes como vocabulario interpretativo: no como categorías rígidas que se aplican mecánicamente, sino como lentes que permiten ver algo que sin ellas quedaría invisible. Un mismo evento puede activar varios ejes; la conceptualización elige cuál es el eje principal y por qué. Si el desplazamiento muestra el qué, la conceptualización muestra el cómo y el por qué estructural.",
    ejemplo: "\"El eje de Desorientación epistemológica se activa aquí en su forma más aguda: no como confusión involuntaria, sino como estrategia deliberada.\"",
    cta: { label: "Conocer los seis ejes →", href: "/ejes" },
  },
  {
    num: "04",
    label: "Apertura",
    descripcion:
      "Una pregunta sin respuesta. El análisis no cierra: deja la tensión abierta.",
    pedagogico:
      "La apertura es la señal de que el análisis no pretende clausurar. Si el análisis termina con una conclusión —\"esto muestra que la democracia está en crisis\"— cierra la pregunta. Si termina con una pregunta que el análisis volvió necesaria pero que no puede responder por sí solo, deja abierta la tensión. La apertura no es retórica: es el reconocimiento de que los procesos estructurales son más grandes que cualquier análisis.",
    ejemplo: "\"¿Puede una democracia sostenerse cuando el procedimiento que la funda —el voto— ya no opera como árbitro?\"",
  },
];

function PasoBlock({
  num, label, descripcion, pedagogico, ejemplo, cta,
}: {
  num: string;
  label: string;
  descripcion: string;
  pedagogico: string;
  ejemplo: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div style={{
      border: "var(--mi-border-thick)",
      boxShadow: "var(--mi-shadow-card)",
      background: "var(--mi-bg-paper)",
      marginBottom: "var(--mi-space-5)",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "var(--mi-border-dashed)",
        padding: "var(--mi-space-4) var(--mi-space-5)",
        display: "flex",
        alignItems: "baseline",
        gap: "var(--mi-space-4)",
      }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-4xl)",
          fontWeight: 400,
          color: "var(--mi-ink)",
          lineHeight: 1,
          userSelect: "none",
          opacity: 0.12,
        }}>
          {num}
        </span>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink)",
          fontWeight: 500,
        }}>
          {label}
        </span>
      </div>

      {/* Cuerpo */}
      <div style={{ padding: "var(--mi-space-5)" }}>
        <p style={{
          fontFamily: "var(--mi-font-title)",
          fontStyle: "italic",
          fontSize: "var(--mi-text-lg)",
          lineHeight: "var(--mi-leading-normal)",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-4)",
        }}>
          {descripcion}
        </p>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-base)",
          lineHeight: "var(--mi-leading-relaxed)",
          color: "var(--mi-ink-soft)",
          marginBottom: "var(--mi-space-4)",
        }}>
          {pedagogico}
        </p>

        {/* Ejemplo */}
        <div style={{
          background: "var(--mi-bg-cream)",
          borderLeft: "3px solid var(--mi-ink)",
          padding: "var(--mi-space-3) var(--mi-space-4)",
          marginBottom: cta ? "var(--mi-space-4)" : 0,
        }}>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            display: "block",
            marginBottom: "var(--mi-space-2)",
          }}>
            Ejemplo
          </span>
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-sm)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink)",
          }}>
            {ejemplo}
          </p>
        </div>

        {cta && (
          <Link
            href={cta.href}
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wider)",
              textTransform: "uppercase",
              color: "var(--mi-ink)",
              borderBottom: "2px solid var(--mi-ink)",
              paddingBottom: 3,
            }}
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MetodoPage() {
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
        <Link href="/acerca" style={{ color: "var(--mi-ink-mute)" }}>Acerca</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Método · Marco conceptual</span>
      </div>

      {/* Hero */}
      <div style={{
        background: "var(--mi-bg)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
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
            Marco · Procedimiento de análisis
          </div>
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(52px, 7vw, var(--mi-text-display))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "var(--mi-ink)",
            textTransform: "uppercase",
            marginBottom: "var(--mi-space-5)",
          }}>
            Método
          </h1>
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "56ch",
          }}>
            Cada análisis de Mapa Inestable sigue una estructura constante. No es retórica: es el procedimiento que permite distinguir la noticia del proceso.
          </p>
        </div>
      </div>

      {/* Los 4 pasos */}
      <div className="mi-container--narrow" style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-7)" }}>
        {PASOS.map(paso => (
          <PasoBlock key={paso.num} {...paso} />
        ))}
      </div>

      {/* Por qué así */}
      <div style={{
        background: "var(--mi-bg-cream)",
        borderTop: "var(--mi-border-bold)",
        borderBottom: "var(--mi-border-bold)",
      }}>
        <div className="mi-container--narrow" style={{ padding: "var(--mi-space-7) var(--mi-space-6)" }}>
          <h2 style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-5)",
          }}>
            Por qué así
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--mi-space-7)",
          }}>
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-base)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-ink-soft)",
            }}>
              El disparador en lugar del tema evita la generalización prematura. Cuando el análisis arranca de un evento concreto, la abstracción que produce tiene que ganarse su lugar: no puede simplemente declararse. El tema llega después, como nombre de lo que el evento reveló, no como punto de partida.
            </p>
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-base)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-ink-soft)",
            }}>
              La apertura en lugar del cierre es una decisión epistemológica. Los procesos estructurales no terminan cuando termina el análisis. Si el análisis cierra con una conclusión, miente sobre la naturaleza de su objeto. La pregunta final no es retórica: es el reconocimiento de que el proceso sigue, que el análisis es una intervención temporal sobre algo que todavía está ocurriendo.
            </p>
          </div>
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-sm)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink-mute)",
            marginTop: "var(--mi-space-5)",
            borderTop: "var(--mi-border-dashed)",
            paddingTop: "var(--mi-space-5)",
            maxWidth: "70ch",
          }}>
            Cada despacho cubre los países que se movieron estructuralmente esa semana. La cantidad varía: 2 a 5 análisis es lo común. No forzamos cobertura para llenar — si una semana en un país no hay desplazamiento, no hay análisis.
          </p>
        </div>
      </div>

      {/* Ejemplo trabajado */}
      <div className="mi-container--narrow" style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-8)" }}>
        <h2 style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-5)",
        }}>
          Ejemplo trabajado
        </h2>
        <div style={{
          border: "var(--mi-border-thick)",
          boxShadow: "var(--mi-shadow-card)",
          background: "var(--mi-bg-paper)",
        }}>
          <div style={{
            background: "var(--mi-ink)",
            padding: "var(--mi-space-3) var(--mi-space-5)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-accent-gold)",
            }}>
              Colombia · Desorientación epistemológica
            </span>
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              27 abr 2026 · 8 min
            </span>
          </div>
          <div style={{ padding: "var(--mi-space-5)" }}>
            <h3 style={{
              fontFamily: "var(--mi-font-title)",
              fontWeight: 700,
              fontSize: "var(--mi-text-2xl)",
              lineHeight: "var(--mi-leading-snug)",
              letterSpacing: "var(--mi-tracking-tight)",
              color: "var(--mi-ink)",
              marginBottom: "var(--mi-space-3)",
            }}>
              La sospecha antes del voto
            </h3>
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-base)",
              lineHeight: "var(--mi-leading-relaxed)",
              color: "var(--mi-ink-soft)",
              marginBottom: "var(--mi-space-5)",
              maxWidth: "56ch",
            }}>
              A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Lo nuevo no es el discurso —es de Trump, Bolsonaro, Milei— sino que ahora sea pronunciado por la izquierda.
            </p>
            <Link
              href="/analisis/co/la-sospecha-antes-del-voto"
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
                borderBottom: "2px solid var(--mi-ink)",
                paddingBottom: 3,
              }}
            >
              Ver el análisis completo →
            </Link>
          </div>
        </div>
      </div>

      {/* Cross-links */}
      <div style={{
        borderTop: "var(--mi-border-thick)",
        background: "var(--mi-bg-paper)",
      }}>
        <div className="mi-container--narrow" style={{
          padding: "var(--mi-space-5) var(--mi-space-6)",
          display: "flex",
          gap: "var(--mi-space-6)",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            Marco conceptual
          </span>
          {[
            { label: "Los seis ejes", href: "/ejes" },
            { label: "Acerca del proyecto", href: "/acerca" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
                borderBottom: "1px solid var(--mi-ink)",
                paddingBottom: 2,
              }}
            >
              {label} →
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
