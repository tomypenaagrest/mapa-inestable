import Link from "next/link";
import "@/styles/editorial-secondary.css";
import "@/styles/article.css";

export interface DetailSection {
  label: string;
  html: string;
}

export interface DetailMetaItem {
  label: string;
  value: string;
  href?: string;
}

export interface AparenceChip {
  title: string;
  href: string;
}

export interface EditorialShortDetailProps {
  tag: string;
  tagHref?: string;
  titulo: string;
  metaItems: DetailMetaItem[];
  webIntro?: string | null;
  webImage?: { src: string; caption?: string } | null;
  sections: DetailSection[];
  aparecePiezas?: AparenceChip[];
  apareceTotalCount?: number;
  prevLink?: { label: string; href: string };
  nextLink?: { label: string; href: string };
}

export default function EditorialShortDetail({
  tag,
  tagHref,
  titulo,
  metaItems,
  webIntro,
  webImage,
  sections,
  aparecePiezas = [],
  apareceTotalCount = 0,
  prevLink,
  nextLink,
}: EditorialShortDetailProps) {
  const visiblePiezas = aparecePiezas.slice(0, 6);
  const hasMore = apareceTotalCount > 6;

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Header del detalle */}
      <div className="es-detail-header">

        {/* Tag del eje (o tipo de entidad) */}
        {tagHref ? (
          <Link href={tagHref} className="es-detail-tag">{tag}</Link>
        ) : (
          <span className="es-detail-tag">{tag}</span>
        )}

        <h1 className="es-detail-h1">{titulo}</h1>

        {/* Meta row */}
        {metaItems.length > 0 && (
          <div className="es-detail-meta">
            {metaItems.map(({ label, value, href }) => (
              <span key={label} style={{ display: "flex", gap: 6 }}>
                <span className="es-detail-meta-label">{label} ·</span>
                {href ? (
                  <Link href={href} className="es-detail-meta-value" style={{ textDecoration: "none" }}>
                    {value}
                  </Link>
                ) : (
                  <span className="es-detail-meta-value">{value}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* web_intro */}
      {webIntro && (
        <p className="es-detail-intro">{webIntro}</p>
      )}

      {/* Imagen del autor (solo para autores con web_image) */}
      {webImage && (
        <div className="es-detail-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={webImage.src} alt={titulo} />
          {webImage.caption && (
            <p className="es-detail-image-caption">{webImage.caption}</p>
          )}
        </div>
      )}

      {/* Cuerpo de secciones — reutiliza tipografía de Spec 50 */}
      <div className="article-body">
        {sections
          .filter((s) => s.html && s.html.trim())
          .map((section) => (
            <section key={section.label}>
              <h2>{section.label}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.html }} />
            </section>
          ))}
      </div>

      {/* Bloque "Aparece en" */}
      {visiblePiezas.length > 0 && (
        <div className="es-aparece">
          <span className="es-aparece-label">Aparece en</span>
          <div className="es-aparece-chips">
            {visiblePiezas.map((pieza) => (
              <Link key={pieza.href} href={pieza.href} className="es-aparece-chip">
                {pieza.title}
              </Link>
            ))}
          </div>
          {hasMore && (
            <span className="es-aparece-ver-todos">Ver todos →</span>
          )}
        </div>
      )}

      {/* Navegación prev/next */}
      {(prevLink || nextLink) && (
        <nav className="es-detail-nav">
          {prevLink ? (
            <Link href={prevLink.href}>← {prevLink.label}</Link>
          ) : <span />}
          {nextLink ? (
            <Link href={nextLink.href}>{nextLink.label} →</Link>
          ) : <span />}
        </nav>
      )}

    </div>
  );
}
