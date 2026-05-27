import type { Metadata } from "next";
import { getAllAutores } from "@/lib/autores";
import { getApareceTotalCount } from "@/lib/aparece-en";
import GlosarioIndex from "@/components/GlosarioIndex";

export const metadata: Metadata = {
  title: "Autores · Mapa Inestable",
  description: "Los pensadores cuya obra sostiene el andamiaje teórico de Mapa Inestable.",
};

export default function AutoresPage() {
  const autores = getAllAutores();

  const items = autores.map((autor) => {
    const citadoCount = getApareceTotalCount(autor.slug);
    const tagParts = [autor.nacionalidad, autor.disciplina.split(",")[0]].filter(Boolean);

    return {
      href: `/autor/${autor.slug}`,
      tag: tagParts.length > 0 ? tagParts.join(" · ") : undefined,
      titulo: autor.name,
      descripcion: autor.descripcion
        ? autor.descripcion.length > 140
          ? autor.descripcion.slice(0, 140) + "…"
          : autor.descripcion
        : undefined,
      citadoCount,
    };
  });

  return (
    <GlosarioIndex
      label="Marco conceptual"
      title="Autores"
      bajada="Los pensadores cuya obra sostiene el andamiaje interpretativo de Mapa Inestable."
      count={autores.length}
      items={items}
    />
  );
}
