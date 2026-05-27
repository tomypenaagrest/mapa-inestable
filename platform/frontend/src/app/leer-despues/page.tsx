import type { Metadata } from "next";
import { getAllPublications, type PublicationMeta } from "@/lib/content";
import { EJES, AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import type { AnalisisEntry } from "@/lib/analisis";
import LeerDespuesContent from "./LeerDespuesContent";

export const metadata: Metadata = {
  title: "Leer después — Mapa Inestable",
  description: "Tu lista de análisis guardados para leer más tarde.",
};

function publicationToAnalisisEntry(p: PublicationMeta): AnalisisEntry | null {
  if (!p.ejePrincipal) return null;
  const eje = EJES.find(e => e.axisKey === p.ejePrincipal);
  if (!eje) return null;
  return {
    slug:                   p.slug,
    countrySlug:            p.countrySlug ?? "",
    country:                p.country ?? "—",
    axisSlug:               AXIS_KEY_TO_SLUG[p.ejePrincipal] ?? p.ejePrincipal,
    axisKey:                p.ejePrincipal,
    axisName:               eje.name,
    title:                  p.title,
    lede:                   p.subtitle ?? "",
    published_at:           p.published_at,
    published_iso:          p.fecha,
    year:                   p.year,
    week:                   p.week,
    step_disparador:        "",
    step_desplazamiento:    "",
    step_conceptualizacion: "",
    step_apertura:          "",
    substackUrl:            p.url,
    tipo:                   p.tipo === "despacho" ? "despacho" : "publicacion",
  };
}

export default function LeerDespuesPage() {
  const allAnalyses = getAllPublications()
    .map(publicationToAnalisisEntry)
    .filter((e): e is AnalisisEntry => e !== null);

  return <LeerDespuesContent allAnalyses={allAnalyses} />;
}
