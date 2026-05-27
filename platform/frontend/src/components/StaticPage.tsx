import type { ReactNode } from "react";
import "@/styles/editorial-secondary.css";

export interface StaticPageSection {
  label: string;
  h2?: string;
  children: ReactNode;
}

export interface StaticPageProps {
  mark: string;
  title: string;
  manifest: string;
  sections: StaticPageSection[];
}

export default function StaticPage({
  mark,
  title,
  manifest,
  sections,
}: StaticPageProps) {
  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Hero terracota — Patrón 3 */}
      <div className="es-static-hero">
        <span className="es-static-hero-mark">{mark}</span>
        <h1 className="es-static-hero-h1">{title}</h1>
        <p className="es-static-hero-manifest">{manifest}</p>
      </div>

      {/* Secciones apiladas */}
      {sections.map((section) => (
        <section key={section.label} className="es-static-section">
          <span className="es-static-section-label">{section.label}</span>
          {section.h2 && (
            <h2 className="es-static-section-h2">{section.h2}</h2>
          )}
          <div className="es-static-body">
            {section.children}
          </div>
        </section>
      ))}

    </div>
  );
}
