import type { Metadata } from "next";
import { getAllConceptos } from "@/lib/conceptos";
import { EJES_BY_SLUG } from "@/lib/ejes";
import { getApareceTotalCount } from "@/lib/aparece-en";
import GlosarioIndex from "@/components/GlosarioIndex";

export const metadata: Metadata = {
  title: "Conceptos · Mapa Inestable",
  description: "Las categorías analíticas con las que Mapa Inestable interpreta los procesos políticos de Sudamérica.",
};

export default function ConceptosPage() {
  const conceptos = getAllConceptos();

  const items = conceptos.map((concepto) => {
    const primaryEjeSlug = concepto.ejesRelacionados[0];
    const eje = primaryEjeSlug ? EJES_BY_SLUG[primaryEjeSlug] : null;
    const citadoCount = getApareceTotalCount(concepto.slug);

    return {
      href: `/concepto/${concepto.slug}`,
      tag: eje ? `Eje · ${eje.name}` : undefined,
      tagHref: eje ? `/ejes/${primaryEjeSlug}` : undefined,
      titulo: concepto.name,
      descripcion: concepto.definicion
        ? concepto.definicion.length > 140
          ? concepto.definicion.slice(0, 140) + "…"
          : concepto.definicion
        : undefined,
      citadoCount,
    };
  });

  return (
    <GlosarioIndex
      label="Glosario"
      title="Conceptos"
      bajada="Las categorías analíticas con las que Mapa Inestable interpreta los procesos políticos de Sudamérica."
      count={conceptos.length}
      items={items}
    />
  );
}
