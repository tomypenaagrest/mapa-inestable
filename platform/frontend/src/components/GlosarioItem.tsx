import Link from "next/link";
import "@/styles/editorial-secondary.css";

export interface GlosarioItemProps {
  href: string;
  tag?: string;
  tagHref?: string;
  titulo: string;
  descripcion?: string;
  citadoCount?: number;
}

export default function GlosarioItem({
  href,
  tag,
  tagHref,
  titulo,
  descripcion,
  citadoCount,
}: GlosarioItemProps) {
  return (
    <div className="es-item-wrapper">
      {/* Tag del eje — link separado, z-index sobre el stretched-link */}
      {tag && tagHref ? (
        <Link href={tagHref} className="es-item-tag-link">
          {tag}
        </Link>
      ) : tag ? (
        <span className="es-item-tag">{tag}</span>
      ) : null}

      {/* Área principal — stretched-link cubre todo el wrapper */}
      <Link href={href} className="es-item-main">
        <span className="es-item-title">{titulo}</span>
        {descripcion && (
          <span className="es-item-desc">{descripcion}</span>
        )}
        {citadoCount !== undefined && citadoCount > 0 ? (
          <span className="es-item-meta">Citado en {citadoCount} análisis →</span>
        ) : (
          <span className="es-item-meta">→ leer</span>
        )}
      </Link>
    </div>
  );
}
