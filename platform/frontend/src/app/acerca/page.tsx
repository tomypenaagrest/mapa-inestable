import Link from "next/link";
import type { Metadata } from "next";
import { EJES } from "@/lib/ejes";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Acerca · Mapa Inestable",
  description: "Qué es Mapa Inestable, su hipótesis central, el método y el marco conceptual que organiza el análisis.",
};

const AXIS_COLORS: Record<string, string> = {
  deculturacion:              "#7B5EA7",
  mediaciones:                "#3D7AB5",
  desrepresentacion:          "#C5663A",
  estetizacion:               "#4A9467",
  desorientacion:             "#B5502A",
  atencion:                   "#C8A94A",
};

export default function AcercaPage() {
  return (
    <StaticPage
      mark="Cartografía política del sur"
      title="Acerca"
      manifest="¿Cómo se sostiene la vida democrática cuando se debilitan las mediaciones culturales, políticas y cognitivas que la hicieron posible?"
      sections={[
        {
          label: "La hipótesis",
          h2: "Transición sin reemplazo",
          children: (
            <>
              <p>
                Las estructuras que organizaban la vida colectiva pierden capacidad de mediación. No desaparecen: se vacían. Los partidos siguen existiendo, los medios siguen publicando, las iglesias siguen convocando. Pero ya no articulan la experiencia de la mayoría ni producen pertenencia duradera.
              </p>
              <p>
                Mapa Inestable rastrea esa pérdida. No como diagnóstico de crisis sino como mapa de transformación: qué estructuras se debilitan, en qué países, con qué velocidad, y qué procesos llenan —o no llenan— el espacio que dejan.
              </p>
            </>
          ),
        },
        {
          label: "Los 6 ejes",
          h2: "El sistema conceptual",
          children: (
            <ul className="es-eje-list">
              {EJES.map((eje) => (
                <Link key={eje.slug} href={`/ejes/${eje.slug}`} className="es-eje-item">
                  <span
                    className="es-eje-pin"
                    style={{ background: AXIS_COLORS[eje.axisKey] ?? "var(--mi-ink-mute)" }}
                    aria-hidden="true"
                  />
                  {eje.name}
                </Link>
              ))}
            </ul>
          ),
        },
        {
          label: "El método",
          h2: "Cuatro pasos",
          children: (
            <>
              <p>
                Cada análisis parte de un evento concreto —el disparador— y lo desplaza hacia el proceso estructural que ese evento revela. El desplazamiento se nombra con uno de los seis ejes. El análisis cierra con una pregunta, no con una conclusión.
              </p>
              <p>
                <Link href="/metodo">Leer el método en detalle →</Link>
              </p>
            </>
          ),
        },
        {
          label: "Cobertura geográfica",
          h2: "Diez países",
          children: (
            <p>
              Argentina, Brasil, Chile, Colombia, Bolivia, Perú, Uruguay, Paraguay, Ecuador y Venezuela. La misma lente aplicada a cada uno. No comparamos para jerarquizar: comparamos para entender el patrón que atraviesa la región.{" "}
              <Link href="/mapa">Ver el mapa →</Link>
            </p>
          ),
        },
        {
          label: "Autoría",
          children: (
            <>
              <p>
                Tomás Peña Agrest. Periodista y analista político radicado en Buenos Aires. Mapa Inestable es una herramienta de pensamiento para leer Sudamérica en clave estructural. Desde marzo de 2024.
              </p>
              <p>
                Contacto:{" "}
                <a href="mailto:tpena@brevity.pro">tpena@brevity.pro</a>
                {" · "}
                <a href="https://mapainestable.substack.com" target="_blank" rel="noopener noreferrer">
                  Substack ↗
                </a>
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
