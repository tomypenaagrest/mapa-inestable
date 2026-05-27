import Link from "next/link";
import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import "@/styles/editorial-secondary.css";

export const metadata: Metadata = {
  title: "Método · Mapa Inestable",
  description: "Cuatro pasos para leer una escena. El procedimiento que organiza cada análisis de Mapa Inestable.",
};

const PASOS = [
  {
    num: "1",
    label: "Disparador",
    desc: "Una escena concreta. Una noticia, una imagen, una estadística específica con fuente trazable.",
  },
  {
    num: "2",
    label: "Desplazamiento",
    desc: "Del evento concreto al proceso estructural que ese evento revela.",
  },
  {
    num: "3",
    label: "Conceptualización",
    desc: "Interpretación a través de uno o más de los seis ejes. Acá entra el marco.",
  },
  {
    num: "4",
    label: "Apertura",
    desc: "Una pregunta sin respuesta. El análisis no cierra: deja la tensión abierta.",
  },
];

export default function MetodoPage() {
  return (
    <StaticPage
      mark="Cartografía política del sur"
      title="Método"
      manifest="Cada análisis de Mapa Inestable sigue una estructura constante. No es retórica: es el procedimiento que permite distinguir la noticia del proceso."
      sections={[
        {
          label: "Cuatro pasos",
          children: (
            <div>
              {PASOS.map((paso) => (
                <div key={paso.num} className="es-method-step">
                  <span className="es-method-num">{paso.num}</span>
                  <div>
                    <span className="es-method-label">{paso.label}</span>
                    <span className="es-method-text">{paso.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          label: "Disparador",
          h2: "El evento puntual",
          children: (
            <>
              <p>
                El disparador no es el tema: es el evento concreto desde el que arranca el análisis. Sin disparador no hay pieza.
              </p>
              <p>
                Hablar de "la crisis de representación en Argentina" no es un disparador. El 18 de marzo de 2026, el Senado rechazó por tercera vez el mismo pliego judicial en tres meses —eso sí lo es. El disparador ancla el análisis en algo que ocurrió, con fecha y fuente.
              </p>
            </>
          ),
        },
        {
          label: "Desplazamiento",
          h2: "Del suceso al proceso",
          children: (
            <>
              <p>
                El desplazamiento es el movimiento central del método. Toma el disparador y pregunta: ¿qué proceso más largo, más amplio, más estructural está visible en este evento?
              </p>
              <p>
                No se trata de explicar por qué ocurrió el evento —eso es periodismo de causas— sino de identificar qué revela sobre transformaciones en curso que el evento hace momentáneamente visibles.
              </p>
            </>
          ),
        },
        {
          label: "Conceptualización",
          h2: "El marco como vocabulario",
          children: (
            <>
              <p>
                La conceptualización nombra lo que el desplazamiento reveló. Usa los ejes como vocabulario interpretativo: no como categorías rígidas que se aplican mecánicamente, sino como lentes que permiten ver algo que sin ellas quedaría invisible.
              </p>
              <p>
                <Link href="/ejes">Los seis ejes →</Link>
              </p>
            </>
          ),
        },
        {
          label: "Apertura",
          h2: "La pregunta que el análisis volvió necesaria",
          children: (
            <p>
              La apertura es la señal de que el análisis no pretende clausurar. Si el análisis termina con una conclusión, cierra la pregunta. Si termina con una pregunta que el análisis volvió necesaria pero no puede responder, deja abierta la tensión. Los procesos estructurales son más grandes que cualquier análisis.
            </p>
          ),
        },
        {
          label: "Por qué no es periodismo de coyuntura",
          children: (
            <>
              <p>
                El disparador en lugar del tema evita la generalización prematura. La abstracción que produce tiene que ganarse su lugar: no puede simplemente declararse.
              </p>
              <p>
                La apertura en lugar del cierre es una decisión epistemológica. Los procesos estructurales no terminan cuando termina el análisis. Si el análisis cierra con una conclusión, miente sobre la naturaleza de su objeto.
              </p>
              <p>
                <Link href="/acerca">Acerca del proyecto →</Link>
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
