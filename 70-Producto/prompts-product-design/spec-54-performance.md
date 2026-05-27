---
tipo: prompt-product-design
spec: 54
fecha: 2026-05-26
estado: reutilizable
herramientas_compatibles: [Claude (artifacts), otro agente con design context]
naturaleza: Spec 54 es transversal y técnica — no produce mockups visuales. Este "prompt" funciona más como referencia para un agente que vaya a regenerar la tabla de presupuestos o el sistema de medición. La mayor parte del trabajo de Spec 54 vive en código (next.config.js, lighthouserc.json, size-limit), no en design
---

# Prompt para Product Design — Spec 54 (performance budget LATAM)

## Cómo usar

Spec 54 NO tiene mockups visuales. Es spec sistémica. Este documento existe por consistencia con las otras specs de EPIC-04 pero su contenido es referencia técnica, no prompt visual.

Antes de leer, leer `70-Producto/prompts-product-design/spec-50-reading.md` para contexto compartido del proyecto.

---

## Contexto específico de Spec 54

> Mapa Inestable se lanza en julio 2026. EPIC-04 declaró performance como condición del lanzamiento: el 80% del consumo proyectado es mobile LATAM y la primera impresión define la conversión a Substack pago o consultoría.
>
> Target operativo: **4G LATAM urbano** (decisión cerrada en EPIC-04 r5). Se acepta degradación gradual en 3G inestable (~5-10% del mercado).
>
> El sitio tiene muy pocas imágenes (solo portadas Gemini en `90-Portadas/`), el mapa es SVG inline, las fuentes son 4 familias. Es un caso favorable para performance — la mayor optimización viene de no agregar peso innecesario.

---

## 1. [PROMPT] — Regenerar tabla de presupuestos por vista

> Diseñá una tabla de Markdown con presupuestos por vista para una plataforma editorial mobile LATAM con target 4G. Cuatro vistas: Home, Página de país (dashboard tabular), Lectura de análisis, Mapa standalone.
>
> Columnas:
> - LCP target (Largest Contentful Paint en ms)
> - FCP target (First Contentful Paint en ms)
> - CLS target (Cumulative Layout Shift, decimal)
> - INP target (Interaction to Next Paint en ms)
> - Bundle JS inicial gzipped (KB)
> - Bundle CSS gzipped (KB)
> - Imagen LCP máx gzipped (KB)
>
> Constraints contextuales:
> - El home tiene un mapa SVG inline (~25KB) + lógica gestual (~15KB) → presupuesto JS más alto.
> - La lectura es renderizado server-first con poca interactividad → presupuesto más bajo.
> - La página de país tiene tabs + heatmap + sparklines SVG (sin librería chart externa).
> - El mapa standalone es similar al home en peso pero sin carrusel + heatmap.
>
> Targets a respetar: LCP < 2.5s en las críticas, < 2.0s en lectura (la más liviana). Bundle home < 250KB, página país < 220KB, lectura < 180KB.

---

## 2. [PROMPT] — Regenerar configuración de Lighthouse-ci

> Generá un archivo `lighthouserc.json` para correr en CI sobre una app Next.js (App Router) mobile-first, target 4G LATAM. Debe:
>
> - Correr Lighthouse mobile sobre 4 URLs: `/`, `/pais/argentina`, `/analisis/borradores/argentina-sin-cruzadas`, `/mapa`.
> - Throttling 4G fast: RTT 150ms, throughput 1638.4 Kbps, CPU 4× slowdown.
> - Screen emulation 360×800 (Samsung A54), DPR 2.625.
> - Assertions:
>   - Performance score ≥ 0.85 (error).
>   - LCP ≤ 2500ms (error).
>   - FCP ≤ 1800ms (error).
>   - CLS ≤ 0.1 (error).
>   - Total Blocking Time ≤ 200ms (warn).

---

## 3. [PROMPT] — Regenerar configuración de size-limit

> Generá un archivo `.size-limit.json` que valide en CI que los bundles iniciales de las 4 rutas críticas no superen:
> - Home: 250 KB gzipped
> - Página de país: 220 KB gzipped
> - Lectura: 180 KB gzipped
> - Mapa: 260 KB gzipped
>
> Apuntar a los chunks generados por Next.js App Router (`.next/static/chunks/app/<ruta>/page-*.js`).

---

## Outputs esperados (validación)

- Tabla de presupuestos legible (no más de 4 vistas críticas + 1 categoría "secundarias" para el resto).
- Configuración Lighthouse y size-limit correcta sintácticamente.
- No incluir 3G, no incluir PWA, no incluir CDN externo.

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-26 | Creación como subproducto de Spec 54. Spec 54 es transversal/técnica — este prompt es referencia, no flujo de diseño visual |
