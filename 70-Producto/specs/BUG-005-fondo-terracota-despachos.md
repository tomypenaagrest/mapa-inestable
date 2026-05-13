# BUG-005 — Fondo terracota en despachos dificulta la lectura

**Estado:** resuelto en código (fix aplicado 2026-05-12) · spec escrita **post-facto**
**Prioridad:** alta — afecta la legibilidad de todo el corpus de despachos
**Componentes afectados:** `app/despachos/[ano]/[semana]/page.tsx`
**Nota de proceso:** este BUG fue **arreglado directamente sin spec previa**. Rompe el patrón spec-first del proyecto. La spec se escribe retroactivamente para dejar el cambio documentado y validable.

---

## Problema

La página del despacho individual (`/despachos/[ano]/[semana]`) tiene **todo el body con fondo terracota** (`--mi-bg` `#C5663A`) y texto en crema (`--mi-bg-paper` `#F4E9D2`). Eso funciona como portada visual pero **rompe la lectura larga**: el cuerpo del despacho (3-8 párrafos de prosa) sobre terracota saturada genera fatiga visual rápida.

Comparación con el análisis individual (`/analisis/[pais]/[slug]`): el análisis usa `--mi-bg-paper` (crema) como wrapper exterior y `--mi-ink` (verde-negro) como tinta. Lectura cómoda.

Tomás reportó el bug con screenshot del Despacho Nº 14 (Colombia, semana 18 2026).

---

## Causa raíz

En `app/despachos/[ano]/[semana]/page.tsx`:

```tsx
return (
  <div style={{ background: "var(--mi-bg)", minHeight: "100vh" }}>
    {/* ... todo el despacho hereda este background ... */}
    <div className="mi-prose" style={{ color: "var(--mi-bg-paper)" }}>
      {/* ... cuerpo del despacho sobre terracota ... */}
    </div>
  </div>
);
```

El wrapper exterior pinta terracota para todo el alto del viewport. El cuerpo `.mi-prose` hereda ese fondo y mantiene su texto en crema. Funciona visualmente para el hero (Nº gigante + título + subtítulo) pero no para 1.000+ palabras de prosa.

El análisis individual usa el patrón inverso: wrapper crema, tinta verde-negro. El despacho debería seguir ese patrón en el cuerpo.

---

## Comportamiento deseado

1. **Meta-bar superior** (verde-negro con dorado para fecha) — sin cambios.
2. **Hero del despacho** (Semana N · Año, Nº N gigante, título, subtítulo, chips de ejes activados) — **se conserva sobre fondo terracota**. Es el signal visual "esto es un despacho" y diferencia editorial respecto al análisis individual. Texto crema sobre terracota saturada funciona bien en bloques cortos.
3. **Cuerpo del despacho** (prosa larga, blockquote, headings internos) — **fondo crema, tinta verde-negro**. Lectura larga cómoda. Misma legibilidad que el análisis individual.
4. **CTA Substack al pie** — fondo crema heredado, colores ajustados para contraste correcto.

---

## Solución implementada (2026-05-12)

### Cambios en `app/despachos/[ano]/[semana]/page.tsx`

**1. Wrapper exterior pasa a crema:**

```diff
- <div style={{ background: "var(--mi-bg)", minHeight: "100vh" }}>
+ <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>
```

**2. Hero terracota encapsulado:**

El hero (header + ejes chips) se envuelve en un nuevo `<div style={{ background: "var(--mi-bg)" }}>` que termina antes del cuerpo. La franja terracota queda acotada a la portada editorial.

```tsx
{/* Hero terracota — portada editorial del despacho */}
<div style={{ background: "var(--mi-bg)" }}>
  {/* Header con Nº gigante + título + subtítulo */}
  <div style={{ borderBottom: "var(--mi-border-bold)", ... }} className="mi-grain">
    {/* ... */}
  </div>
  {/* Ejes chips */}
  {ejesObjs.length > 0 && (<div>...</div>)}
</div>
{/* fin hero terracota */}
```

**3. Cuerpo a tinta verde-negro:**

```diff
- <div className="mi-prose" style={{ color: "var(--mi-bg-paper)" }}>
+ <div className="mi-prose" style={{ color: "var(--mi-ink)" }}>
```

**4. CTA Substack ajustado para fondo crema:**

- Texto introductorio "Recibir el próximo despacho por email": `--mi-bg-paper` con opacity 0.6 → `--mi-ink-mute` (sin opacity).
- Link "Leer en Substack ↗": `--mi-accent-gold` → `--mi-brand-gold-warm` (`#c08332`). El `--mi-accent-gold` (`#E8C58A`) es un dorado pálido que no tiene contraste suficiente sobre crema; el warm sí.
- Link "Suscribirse ↗": `--mi-bg-paper` con opacity 0.6 → `--mi-ink-mute`. Borde inferior `rgba(244,233,210,0.4)` → `--mi-rule-soft`.

---

## Decisiones editoriales tomadas (que merecían spec previa)

### Decisión 1: hero terracota se conserva, no pasa a crema completo

**Alternativa A** (literal a lo que pidió Tomás): todo el despacho pasa a crema, idéntico al análisis individual. **Pro**: legibilidad total. **Contra**: pierde el signal visual "esto es un despacho" — el lector recurrente que llega no distingue de inmediato entre un despacho y un análisis.

**Alternativa B** (la implementada): hero terracota preservado, cuerpo crema. **Pro**: legibilidad larga + portada editorial mantenida. **Contra**: corte visual abrupto entre franja terracota y zona crema.

**Razón de elegir B**: el problema reportado por Tomás era específicamente la **lectura larga**, no la portada. El hero (Nº gigante + título corto) sobre terracota se lee bien — no es texto largo. La portada terracota cumple función editorial.

**Esta decisión debería haberse confirmado con Tomás antes de implementar.** No lo hice.

### Decisión 2: link "Leer en Substack" cambia de `--mi-accent-gold` a `--mi-brand-gold-warm`

Sobre terracota, `--mi-accent-gold` (`#E8C58A`) funciona bien — es un dorado pálido que contrasta con el verde-negro de fondo. Sobre crema, el mismo dorado pálido pierde contraste (cream vs gold pale = poco diferencial).

Cambié al `--mi-brand-gold-warm` (`#c08332` — más saturado, más oscuro, mejor contraste sobre crema). Esa decisión introduce el token `--mi-brand-gold-warm` (Spec 21) en una vista que originalmente no lo usaba.

---

## Casos a verificar

| Caso | Resultado esperado |
|---|---|
| Despacho con cuerpo largo (>1500 palabras) | Cuerpo legible sobre fondo crema, sin fatiga |
| Despacho con cero ejes activados | Hero terracota cierra después del header (sin franja de chips) y empieza el cuerpo crema |
| Despacho con `d.url` ausente | CTA Substack se omite; el cuerpo crema continúa hasta el footer global |
| Despacho con `d.subtitle` ausente | Hero sin subtítulo; resto igual |
| Click en `Leer en Substack ↗` desde el CTA | Abre Substack en nueva pestaña; el link es legible sobre crema |
| Listado `/despachos` (página índice) | Sin cambios — esta spec solo toca el detalle individual |

---

## Archivos modificados

1. `platform/frontend/src/app/despachos/[ano]/[semana]/page.tsx` — cambios listados arriba.

---

## Lo que esta spec NO toca

- **Listado `/despachos`** (`page.tsx` del índice): no se modifica.
- **Modelo de datos del despacho** (`lib/despachos.ts`): no se modifica.
- **CSS de `.mi-prose`**: no se modifica. La clase ya funcionaba para fondo crema en el análisis individual; al cambiar el wrapper exterior del despacho, hereda esos estilos sin necesidad de override.
- **Estructura del hero**: el Nº gigante, título, subtítulo y chips se mantienen idénticos en composición y tipografía.

---

## Nota de proceso

Este BUG fue corregido **antes** de existir esta spec. Es un quiebre del patrón spec-first que el proyecto venía sosteniendo (los otros BUGs en `70-Producto/specs/` — BUG-001 a BUG-004 — se documentaron antes del fix).

**Por qué pasó:** interpreté el cambio como trivial ("cambiar un color de fondo"). Pero tomé decisiones editoriales que ahora quedan registradas post-facto — eso significa que Tomás no tuvo oportunidad de validar la **Decisión 1** (hero terracota preservado) ni la **Decisión 2** (cambio de token de dorado) antes de que estuvieran en el código.

**Reglas que esta sesión confirma para futuras tareas:**

1. Aunque el bug parezca trivial, si requiere tomar decisiones editoriales no obvias, escribir BUG-NNN antes del fix.
2. Si el bug parece 100% mecánico (ej. un typo, un import faltante), se puede ir directo al fix. Decisiones de paleta, de estructura visual, de tokens nuevos — siempre spec previa.
3. La spec siempre antes del código, salvo emergencia explícita.

---

## Estado de validación

| Aspecto | Validado por |
|---|---|
| El fix soluciona el problema reportado | ⏳ Pendiente — Tomás debe abrir el despacho post-fix |
| Decisión 1 (hero terracota preservado) | ⏳ Pendiente confirmación de Tomás. Si prefiere Alternativa A (todo crema), revertir el wrapper del hero |
| Decisión 2 (`--mi-brand-gold-warm` para link) | ⏳ Pendiente — verificar contraste en visual check |
| Build pasa | ⏳ Pendiente — correr `next build` después del cambio |

Si Tomás valida los puntos pendientes, este BUG queda cerrado.
