/**
 * Conjunto de slugs de ensayos que aún están en estado de borrador y NO fueron
 * publicados todavía. Usado por:
 * - `app/ensayos/page.tsx` para marcar `draft: true` en cada `EssayEntry`
 *   (ese flag desactiva el link a la pieza completa y muestra etiqueta "Borrador").
 * - `app/ensayos/[slug]/page.tsx` para mostrar una banda "BORRADOR — NO PUBLICADO"
 *   cuando alguien accede directamente a la URL del slug.
 *
 * Cuando un ensayo se publique de verdad, eliminar su slug de este set y quitar
 * la propiedad `draft: true` del array `ESSAYS` en `app/ensayos/page.tsx`.
 *
 * Las publicaciones reales del proyecto viven en el Substack de Mapa Inestable
 * (https://mapainestable.substack.com/) y están reflejadas en el vault de Obsidian
 * en `50-Publicaciones/`. El array `ESSAYS` apunta a textos del vault `60-Borradores/`
 * que todavía no migraron a Substack.
 */
export const DRAFT_ESSAY_SLUGS: ReadonlySet<string> = new Set<string>([
  "america-latina-entre-dos-hegemonias",
  "estetica-de-los-movimientos-antisistema",
  "soberania-cognitiva-colectiva",
  "el-ultimo-de-su-tipo",
  "caribe-como-laboratorio-del-fin-de-los-relatos-del-xx",
  "patron-de-violencia-politica-regional",
  "super-newsletter-sobre-harari",
]);

export function isEssayDraft(slug: string): boolean {
  return DRAFT_ESSAY_SLUGS.has(slug);
}
