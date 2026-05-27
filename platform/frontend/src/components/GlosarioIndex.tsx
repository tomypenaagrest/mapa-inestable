import "@/styles/editorial-secondary.css";
import GlosarioItem, { type GlosarioItemProps } from "./GlosarioItem";

export interface GlosarioIndexProps {
  label: string;
  title: string;
  bajada: string;
  count: number;
  lastUpdated?: string;
  items: GlosarioItemProps[];
}

export default function GlosarioIndex({
  label,
  title,
  bajada,
  count,
  lastUpdated,
  items,
}: GlosarioIndexProps) {
  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Page header — Patrón 1 */}
      <div className="es-page-header">
        <span className="es-label">{label}</span>
        <h1 className="es-h1">{title}</h1>
        <p className="es-bajada">{bajada}</p>
      </div>

      {/* Meta row */}
      <div className="es-meta-row">
        {count} {title.toLowerCase()} publicados
        {lastUpdated && <> · última act. {lastUpdated}</>}
      </div>

      {/* Lista de items */}
      {items.length === 0 ? (
        <p className="es-empty">
          {title} en construcción. Próximamente disponible.
        </p>
      ) : (
        <div>
          {items.map((item) => (
            <GlosarioItem key={item.href} {...item} />
          ))}
        </div>
      )}

    </div>
  );
}
