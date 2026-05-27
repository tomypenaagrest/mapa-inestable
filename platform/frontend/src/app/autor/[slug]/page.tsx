import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllAutores, getAutorBySlug } from "@/lib/autores";
import { getAparece, getApareceTotalCount } from "@/lib/aparece-en";
import EditorialShortDetail from "@/components/EditorialShortDetail";

export function generateStaticParams() {
  return getAllAutores().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const autor = getAutorBySlug(slug);
  if (!autor) return {};
  return {
    title: `${autor.name} · Mapa Inestable`,
    description: autor.descripcion,
  };
}

export default async function AutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const autor = getAutorBySlug(slug);
  if (!autor) notFound();

  const autores = getAllAutores();
  const autorIndex = autores.findIndex((a) => a.slug === slug);

  // Tag: identidad del autor
  const tagParts = [autor.nacionalidad, autor.disciplina.split(",")[0]].filter(Boolean);
  const tag = `Autor · ${tagParts.join(" / ")}`;

  // Meta items
  const metaItems = [
    ...(autor.nacionalidad ? [{ label: "Origen", value: autor.nacionalidad }] : []),
    ...(autor.disciplina ? [{ label: "Campo", value: autor.disciplina.split(",")[0] }] : []),
  ];

  // Secciones del cuerpo
  const sections = [
    { label: "Obra clave para Mapa Inestable", html: autor.obraClaveHtml },
    { label: "Tesis centrales relevantes", html: autor.tesisCentralesHtml ?? "" },
    { label: "Por qué importa para Mapa Inestable", html: autor.porQueImportaHtml ?? "" },
    { label: "Citas registradas", html: autor.citasHtml ?? "" },
  ].filter((s) => s.html && s.html.trim());

  // "Aparece en"
  const aparecePiezas = getAparece(slug);
  const apareceTotalCount = getApareceTotalCount(slug);

  // Navegación prev/next
  const prev = autorIndex > 0 ? autores[autorIndex - 1] : null;
  const next = autorIndex < autores.length - 1 ? autores[autorIndex + 1] : null;

  return (
    <EditorialShortDetail
      tag={tag}
      titulo={autor.name}
      metaItems={metaItems}
      webIntro={autor.web_intro ?? (autor.descripcion ? autor.descripcion : null)}
      webImage={autor.web_image ? { src: autor.web_image } : null}
      sections={sections}
      aparecePiezas={aparecePiezas}
      apareceTotalCount={apareceTotalCount}
      prevLink={prev ? { label: prev.name, href: `/autor/${prev.slug}` } : undefined}
      nextLink={next ? { label: next.name, href: `/autor/${next.slug}` } : undefined}
    />
  );
}
