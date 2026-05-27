import { Suspense } from "react";
import type { Metadata } from "next";
import { AnalisisContent } from "./AnalisisContent";
import ArchivoConFiltros from "@/components/ArchivoConFiltros";
import { getAllPublications, type PublicationMeta } from "@/lib/content";
import { EJES, AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import type { AnalisisEntry } from "@/lib/analisis";

export const metadata: Metadata = {
  title: "Archivo — Mapa Inestable",
  description: "Todos los análisis publicados por Mapa Inestable. Filtrá por país, eje y año.",
};

function publicationToAnalisisEntry(p: PublicationMeta): AnalisisEntry | null {
  if (!p.ejePrincipal) return null;
  const eje = EJES.find(e => e.axisKey === p.ejePrincipal);
  if (!eje) return null;

  return {
    slug:                  p.slug,
    countrySlug:           p.countrySlug ?? "",
    country:               p.country ?? "—",
    axisSlug:              AXIS_KEY_TO_SLUG[p.ejePrincipal] ?? p.ejePrincipal,
    axisKey:               p.ejePrincipal,
    axisName:              eje.name,
    title:                 p.title,
    lede:                  p.subtitle ?? "",
    published_at:          p.published_at,
    published_iso:         p.fecha,
    year:                  p.year,
    week:                  p.week,
    step_disparador:       "",
    step_desplazamiento:   "",
    step_conceptualizacion:"",
    step_apertura:         "",
    substackUrl:           p.url,
    tipo:                  p.tipo === "despacho" ? "despacho" : "publicacion",
  };
}

export default function AnalisisPage() {
  const publications = getAllPublications();
  const analyses: AnalisisEntry[] = publications
    .map(publicationToAnalisisEntry)
    .filter((e): e is AnalisisEntry => e !== null);

  const fallback = (
    <div
      style={{
        background: "var(--mi-bg-paper)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-widest)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
      }}
    >
      Cargando archivo…
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      {/* Desktop */}
      <div className="mr-desktop-only">
        <AnalisisContent analyses={analyses} />
      </div>
      {/* Mobile — Patrón A */}
      <ArchivoConFiltros
        analyses={analyses}
        label="ARCHIVO"
        h1Title="Análisis"
        metaLabel="Año II"
      />
    </Suspense>
  );
}
