---
spec: 36
titulo: Vaciar /ensayos — borrar los 7 placeholders y dejar la ruta con estado vacío
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [platform/frontend/src/app/ensayos/page.tsx, platform/frontend/src/app/ensayos/[slug]/page.tsx, platform/frontend/src/lib/essay-drafts.ts (a borrar)]
depende_de: []
relaciona_con: []
prioridad: alta
bloquea_a: que el sitio no muestre contenido inventado como si fuera del proyecto
---

# 36 · Vaciar /ensayos — borrar los 7 placeholders

## Problema concreto

`app/ensayos/page.tsx` tiene un array `ESSAYS: EssayEntry[]` con 7 entradas hardcodeadas (América Latina entre dos hegemonías, Estética de los movimientos antisistema, Soberanía cognitiva colectiva, El último de su tipo, El Caribe como laboratorio, Patrón de violencia política regional, Harari y la narrativa que ordena el caos). Cada una tiene título, lede, axisKey, fechas, reading time, etc., todos marcados con `draft: true`.

**Estos textos no son de autoría real.** Son placeholders/mockups que se generaron para mostrar la grilla de `/ensayos` mientras se desarrollaba el sitio. Migrarlos al vault como `tipo: ensayo` (lo que proponía la versión original de esta spec) los legitimaría como contenido del proyecto, lo cual es incorrecto.

Decisión: **vaciar `/ensayos`**, no migrar. La ruta sobrevive con estado vacío hasta que existan ensayos reales.

> **Nota histórica:** la primera versión de esta spec proponía migrar los 7 al vault. Tomás aclaró que no son piezas reales (10 may 2026). Reescrita con el alcance correcto.

---

## Propuesta

### 1. Vaciar el array `ESSAYS`

`platform/frontend/src/app/ensayos/page.tsx`:

```tsx
// Antes:
const ESSAYS: EssayEntry[] = [
  { slug: "america-latina-entre-dos-hegemonias", /* … */ draft: true },
  // … 6 más
];

// Después:
// Los ensayos reales viven en el vault y se cargarán dinámicamente cuando
// existan piezas con `tipo: ensayo`. Hasta entonces, la sección queda vacía.
const ESSAYS: EssayEntry[] = [];
```

### 2. Render del estado vacío

Cuando `essays.length === 0`, mostrar un bloque que diga:

```tsx
<div style={{
  padding: "var(--mi-space-8) var(--mi-space-6)",
  fontFamily: "var(--mi-font-body)",
  textAlign: "center",
  color: "var(--mi-ink-soft)",
  borderTop: "var(--mi-border-bold)",
}}>
  <div style={{
    fontFamily: "var(--mi-font-mono)",
    fontSize: "var(--mi-text-xs)",
    letterSpacing: "var(--mi-tracking-widest)",
    textTransform: "uppercase",
    color: "var(--mi-ink-mute)",
    marginBottom: "var(--mi-space-3)",
  }}>
    Sección en desarrollo
  </div>
  <h2 style={{
    fontFamily: "var(--mi-font-title)",
    fontSize: "var(--mi-text-2xl)",
    color: "var(--mi-ink)",
    marginBottom: "var(--mi-space-4)",
  }}>
    Todavía no hay ensayos publicados
  </h2>
  <p style={{ maxWidth: "52ch", margin: "0 auto", lineHeight: "var(--mi-leading-normal)" }}>
    Esta sección está reservada para piezas conceptuales de largo aliento que trabajen
    un eje a fondo. Mientras tanto, podés leer los{" "}
    <Link href="/despachos" style={{ color: "var(--mi-ink)", borderBottom: "1px solid var(--mi-ink)" }}>
      despachos del Substack
    </Link>{" "}
    o los{" "}
    <Link href="/analisis/borradores" style={{ color: "var(--mi-ink)", borderBottom: "1px solid var(--mi-ink)" }}>
      borradores del agente diario
    </Link>.
  </p>
</div>
```

### 3. Header de la página

Actualizar el header para reflejar el estado real:

```tsx
<span>0 ensayos publicados</span>  {/* en lugar de "8 borradores · 0 publicados" */}
```

Y el subtítulo:

```tsx
<p>
  Análisis de largo aliento que trabajan un eje conceptual en profundidad.
  <strong>Sección en preparación:</strong> todavía no hay piezas publicadas.
</p>
```

(Sacar la oración "los textos figuran como borradores" — ya no hay textos).

### 4. Borrar `lib/essay-drafts.ts`

Ya no es necesario. El Set de slugs draft se usaba solo para los 7 placeholders.

### 5. Modificar `app/ensayos/[slug]/page.tsx`

- Quitar el import `import { isEssayDraft } from "@/lib/essay-drafts"`.
- La función `getEssayBySlug` ya devuelve null si no encuentra el archivo. Como ahora ya no hay ensayos publicados en el vault, cualquier `/ensayos/<slug>` directo devuelve 404.
- Cuando existan ensayos reales con `tipo: ensayo` en el vault, esa lógica se puede extender. Por ahora dejar el archivo simple sin banner de borrador.

```tsx
// Sacar:
import { isEssayDraft } from "@/lib/essay-drafts";
const isDraft = isEssayDraft(slug);

// Y todo el bloque {isDraft && <banner />}
// Y el ajuste del title con [Borrador]
```

### 6. (Opcional) Comentario en el .tsx documentando el contrato

Al inicio de `app/ensayos/page.tsx`:

```tsx
// Los ensayos reales (cuando existan) van a vivir en el vault de Obsidian.
// Para que aparezcan acá habría que:
// 1. Crear archivos en 60-Borradores/ (raíz) con `tipo: ensayo` en el frontmatter
// 2. Implementar getAllEssays() en lib/content.ts (similar a getAllPublications)
// 3. Reemplazar ESSAYS = [] por getAllEssays()
// Hoy el array está vacío y la página muestra estado vacío.
const ESSAYS: EssayEntry[] = [];
```

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/app/ensayos/page.tsx` | `ESSAYS = []`, agregar render de estado vacío, actualizar header |
| `platform/frontend/src/app/ensayos/[slug]/page.tsx` | sacar import y uso de `isEssayDraft`, sacar banner de borrador |
| `platform/frontend/src/lib/essay-drafts.ts` | **borrar** |

---

## Criterios de aceptación

1. ✅ `/ensayos` no muestra ninguna card. Muestra el bloque "Todavía no hay ensayos publicados" con links a `/despachos` y `/analisis/borradores`.
2. ✅ El header de la página dice "0 ensayos publicados" (o equivalente).
3. ✅ `/ensayos/america-latina-entre-dos-hegemonias` (cualquier slug viejo) → 404.
4. ✅ `lib/essay-drafts.ts` ya no existe.
5. ✅ Type-check pasa sin errores.
6. ✅ `next build` completa sin errores.

---

## No incluido en esta spec

- **No** se migra ningún texto al vault. Los 7 placeholders se borran.
- **No** se borra la ruta `/ensayos` completamente — sobrevive como estructura para contenido futuro.
- **No** se cambia el menú del header del sitio (el link "Ensayos" sigue ahí, llevando a la página vacía).
- Cuando aparezcan ensayos reales, la implementación dinámica vault-driven será otra spec.

---

## Implementación sugerida

1. Vaciar el array `ESSAYS = []` en `app/ensayos/page.tsx`.
2. Agregar el bloque de estado vacío (snippet de §2).
3. Actualizar header (contador y subtítulo).
4. En `app/ensayos/[slug]/page.tsx`: sacar import de `essay-drafts`, sacar bloque de banner draft.
5. Borrar `lib/essay-drafts.ts`.
6. Type-check + `next build`.
7. Visual check: `/ensayos` muestra estado vacío con links a /despachos y /analisis/borradores.

---

## Commit sugerido

```
fix(/ensayos): vaciar placeholders sin autoría real

Los 7 ensayos hardcodeados en app/ensayos/page.tsx (América Latina entre
dos hegemonías, Estética de los movimientos antisistema, etc.) eran
placeholders de UI, no piezas de autoría real. Tomás lo confirmó: no
deberían figurar como contenido del proyecto.

Cambios:
- ESSAYS = [] en app/ensayos/page.tsx.
- Render de estado vacío con links a /despachos y /analisis/borradores.
- Header actualizado: '0 ensayos publicados', subtítulo aclara que la
  sección está en preparación.
- app/ensayos/[slug]/page.tsx: sacar banner de borrador (ya no aplica).
- Borrar lib/essay-drafts.ts.

La ruta /ensayos sobrevive como contenedor para piezas conceptuales
reales que existan en el futuro. Para popularla, la próxima spec va a
agregar tipo:ensayo al vault + getAllEssays().
```
