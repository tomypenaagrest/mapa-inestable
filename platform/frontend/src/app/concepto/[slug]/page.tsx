import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllConceptos, getConceptoBySlug } from "@/lib/conceptos";
import { EJES_BY_SLUG } from "@/lib/ejes";
import { getAparece, getApareceTotalCount } from "@/lib/aparece-en";
import EditorialShortDetail from "@/components/EditorialShortDetail";

export function generateStaticParams() {
  return getAllConceptos().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const concepto = getConceptoBySlug(slug);
  if (!concepto) return {};
  return {
    title: `${concepto.name} · Mapa Inestable`,
    description: concepto.definicion,
  };
}

export default async function ConceptoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concepto = getConceptoBySlug(slug);
  if (!concepto) notFound();

  const conceptos = getAllConceptos();
  const conceptoIndex = conceptos.findIndex((c) => c.slug === slug);

  // Tag: eje principal
  const primaryEjeSlug = concepto.ejesRelacionados[0];
  const eje = primaryEjeSlug ? EJES_BY_SLUG[primaryEjeSlug] : null;
  const tag = eje ? `Eje · ${eje.name}` : "Concepto";
  const tagHref = eje ? `/ejes/${primaryEjeSlug}` : undefined;

  // Meta items
  const metaItems = [
    ...(concepto.autores.length > 0
      ? [{ label: "Autor", value: concepto.autores.join(", ") }]
      : []),
    ...(concepto.ano ? [{ label: "Año", value: String(concepto.ano) }] : []),
    ...(concepto.obra ? [{ label: "Obra", value: concepto.obra }] : []),
  ];

  // Secciones del cuerpo
  const sections = [
    { label: "Argumento", html: concepto.argumentoHtml },
    { label: "Cita clave", html: concepto.citaHtml },
    { label: "Aplicación a Sudamérica", html: concepto.aplicabilidadHtml },
    { label: "Fuente", html: concepto.fuenteHtml },
  ].filter((s) => s.html && s.html.trim());

  // "Aparece en"
  const aparecePiezas = getAparece(slug);
  const apareceTotalCount = getApareceTotalCount(slug);

  // Navegación prev/next
  const prev = conceptoIndex > 0 ? conceptos[conceptoIndex - 1] : null;
  const next = conceptoIndex < conceptos.length - 1 ? conceptos[conceptoIndex + 1] : null;

  return (
    <EditorialShortDetail
      tag={tag}
      tagHref={tagHref}
      titulo={concepto.name}
      metaItems={metaItems}
      webIntro={concepto.web_intro ?? (concepto.definicion ? concepto.definicion : null)}
      sections={sections}
      aparecePiezas={aparecePiezas}
      apareceTotalCount={apareceTotalCount}
      prevLink={prev ? { label: prev.name, href: `/concepto/${prev.slug}` } : undefined}
      nextLink={next ? { label: next.name, href: `/concepto/${next.slug}` } : undefined}
    />
  );
}
