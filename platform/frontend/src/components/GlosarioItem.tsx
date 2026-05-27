import Link from "next/link";
import "@/styles/editorial-secondary.css";

export interface GlosarioItemProps {
  href: string;
  tag?: string;
  tagHref?: string;
  pinColor?: string;
  titulo: string;
  descripcion?: string;
  citadoCount?: number;
  metaText?: string;
}

export default function GlosarioItem({
  href,
  tag,
  tagHref,
  pinColor,
  titulo,
  descripcion,
  citadoCount,
  metaText,
}: GlosarioItemProps) {
  const defaultMeta = citadoCount !== undefined && citadoCount > 0
    ? `Citado en ${citadoCount} análisis →`
    : "→ leer";

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
        {pinColor && (
          <span style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: 2,
            background: pinColor,
            marginBottom: 6,
            verticalAlign: "middle",
            marginRight: 8,
          }} />
        )}
        <span className="es-item-title">{titulo}</span>
        {descripcion && (
          <span className="es-item-desc">{descripcion}</span>
        )}
        <span className="es-item-meta">{metaText ?? defaultMeta}</span>
      </Link>
    </div>
  );
}
