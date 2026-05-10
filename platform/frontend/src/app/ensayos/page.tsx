import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import EnsayosClient from "./EnsayosClient";
import type { EssayEntry } from "@/components/EssayCard";

export const metadata: Metadata = {
  title: "Ensayos",
  description: "Piezas de largo aliento que trabajan un eje a fondo. Sección en desarrollo: los textos figuran como borradores.",
  robots: { index: false, follow: false },
};

/* === DATOS ===================================================== */

// IMPORTANTE: estos 7 ensayos NO están publicados todavía. Son borradores en
// 60-Borradores/ del vault (Obsidian). Las publicaciones reales del proyecto
// son las del Substack — ver 50-Publicaciones/ en el vault.
// Marcados con `draft: true` para que la UI los muestre como borrador / próximamente
// y no linkee a páginas de pieza completa que no existen aún.
// Las fechas `publishedAt`/`publishedIso` se conservan solo como referencia interna
// de orden (semana/año del borrador); el componente las oculta cuando draft=true.
const ESSAYS: EssayEntry[] = [
  {
    slug: "america-latina-entre-dos-hegemonias",
    title: "América Latina entre dos hegemonías",
    lede: "El reordenamiento global presiona a la región desde el norte y el este. Las mediaciones que ordenaban la política exterior latinoamericana se disuelven cuando el marco mismo del orden mundial se vuelve incierto.",
    axisKey: "mediaciones",
    author: "Tomás Peña Agrest",
    week: 18,
    year: 2026,
    readingTime: 12,
    publishedAt: "—",
    publishedIso: "2026-05-08",
    featured: true,
    draft: true,
  },
  {
    slug: "estetica-de-los-movimientos-antisistema",
    title: "Estética de los movimientos antisistema",
    lede: "La derecha radical latinoamericana no conquistó el poder por sus ideas sino por su estética. La motosierra como símbolo, el insulto como política, el caos como promesa.",
    axisKey: "estetizacion",
    author: "Tomás Peña Agrest",
    week: 14,
    year: 2026,
    readingTime: 9,
    publishedAt: "—",
    publishedIso: "2026-04-05",
    draft: true,
  },
  {
    slug: "soberania-cognitiva-colectiva",
    title: "Soberanía cognitiva colectiva",
    lede: "Si la desorientación epistemológica es la enfermedad, ¿cuál es el tratamiento? No es más información. Es reconstruir la capacidad colectiva de distinguir lo real.",
    axisKey: "desorientacion",
    author: "Tomás Peña Agrest",
    week: 11,
    year: 2026,
    readingTime: 15,
    publishedAt: "—",
    publishedIso: "2026-03-17",
    draft: true,
  },
  {
    slug: "el-ultimo-de-su-tipo",
    title: "El último de su tipo",
    lede: "Los partidos políticos del siglo XX no van a desaparecer esta semana. Van a vaciarse lentamente hasta que solo quede la forma sin el contenido.",
    axisKey: "desrepresentacion",
    author: "Tomás Peña Agrest",
    week: 7,
    year: 2026,
    readingTime: 11,
    publishedAt: "—",
    publishedIso: "2026-02-17",
    draft: true,
  },
  {
    slug: "caribe-como-laboratorio-del-fin-de-los-relatos-del-xx",
    title: "El Caribe como laboratorio del fin de los relatos del siglo XX",
    lede: "Haití sin Estado funcional, Puerto Rico entre dos soberanías, Cuba en el gris de un orden que no termina de caer. El Caribe anticipa lo que le espera al continente.",
    axisKey: "deculturacion",
    author: "Tomás Peña Agrest",
    week: 50,
    year: 2025,
    readingTime: 14,
    publishedAt: "—",
    publishedIso: "2025-12-15",
    draft: true,
  },
  {
    slug: "patron-de-violencia-politica-regional",
    title: "Patrón de violencia política regional",
    lede: "No son crisis aisladas. La violencia política en América Latina en 2025 tiene una estructura común que los análisis nacionales no logran ver.",
    axisKey: "mediaciones",
    author: "Tomás Peña Agrest",
    week: 44,
    year: 2025,
    readingTime: 10,
    publishedAt: "—",
    publishedIso: "2025-11-03",
    draft: true,
  },
  {
    slug: "super-newsletter-sobre-harari",
    title: "Harari y la narrativa que ordena el caos",
    lede: "Yuval Noah Harari vende certezas. El éxito de sus libros en América Latina dice algo sobre la demanda de marcos de interpretación que ya no proveen las tradiciones políticas locales.",
    axisKey: "atencion",
    author: "Tomás Peña Agrest",
    week: 38,
    year: 2025,
    readingTime: 8,
    publishedAt: "—",
    publishedIso: "2025-09-22",
    draft: true,
  },
];

/* === PAGE ====================================================== */

export default function EnsayosPage() {
  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background: "var(--mi-ink)",
        color: "var(--mi-bg-paper)",
        padding: "6px var(--mi-space-6)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display: "flex",
        gap: "var(--mi-space-6)",
        alignItems: "center",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Ensayos</span>
        <span>{ESSAYS.length} borradores · 0 publicados</span>
      </div>

      {/* Header editorial */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
        background: "var(--mi-bg-paper)",
      }}>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-3)",
        }}>
          Piezas largas · sección en desarrollo
        </div>
        <h1 style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "var(--mi-text-5xl)",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-4)",
        }}>
          Ensayos
        </h1>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontStyle: "italic",
          fontSize: "var(--mi-text-base)",
          color: "var(--mi-ink-soft)",
          maxWidth: "62ch",
          lineHeight: "var(--mi-leading-normal)",
        }}>
          Análisis de largo aliento que trabajan un eje conceptual en profundidad. La forma larga que el despacho semanal no permite. <strong style={{ fontStyle: "normal", color: "var(--mi-ink)" }}>Sección en desarrollo:</strong> los textos figuran como borradores. Las publicaciones reales del proyecto viven en el{" "}
          <a
            href="https://mapainestable.substack.com/"
            style={{ color: "var(--mi-ink)", borderBottom: "1px solid var(--mi-ink)" }}
          >
            Substack de Mapa Inestable
          </a>.
        </p>
      </div>

      {/* Filtros + grid (client) */}
      <Suspense fallback={
        <div style={{
          padding: "var(--mi-space-8) var(--mi-space-6)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          Cargando ensayos…
        </div>
      }>
        <EnsayosClient essays={ESSAYS} />
      </Suspense>

    </div>
  );
}
