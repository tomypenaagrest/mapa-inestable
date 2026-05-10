---
spec: 23
titulo: Frontmatter estructurado en outputs del agente diario
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-10
afecta: [scheduled task `mapa-inestable-borrador-diario`, `60-Borradores/diario/`, `platform/frontend/src/lib/content.ts`]
depende_de: []
relaciona_con: [Spec 24 (promover a publicación), Spec 25 (pipeline visible)]
prioridad: alta
---

# 23 · Frontmatter estructurado en outputs del agente diario

## Resumen ejecutivo

El scheduled task `mapa-inestable-borrador-diario` produce cada día un análisis de país en `60-Borradores/diario/<País> - <Título> - YYYY-MM-DD.md`. Hoy esos archivos no tienen frontmatter — el sitio (`platform/frontend/src/lib/content.ts`, función `getAllAgentDrafts()`) parsea el filename con un regex y extrae el lede mirando el primer párrafo en *italics*. Es frágil: cualquier desviación del agente (punto en el título, fecha mal formateada, falta del italic, etc.) rompe el parsing y la pieza desaparece del sitio.

Esta spec **modifica el SKILL del agente** para que escriba un frontmatter YAML estructurado con todos los campos que el sitio necesita, y **simplifica `lib/content.ts`** para leer del frontmatter en lugar de heurísticas sobre filename/cuerpo.

**Beneficio:** robustez del pipeline, datos estructurados para enriquecer el sitio (filtro por eje, búsqueda, badges de fuentes), y prepara el camino para Specs 24 y 25.

---

## Estado actual

### Cómo escribe el agente hoy

El SKILL del scheduled task vive en `C:\Users\Tomi\OneDrive\Documentos\Claude\Scheduled\mapa-inestable-borrador-diario\SKILL.md`. Produce archivos como:

```
60-Borradores/diario/Argentina - La cena que reemplazó al partido - 2026-05-10.md
```

Con cuerpo:

```markdown
# La cena que reemplazó al partido

*Mientras el escándalo Adorni sacudía al gabinete, Javier Milei recibió en Olivos…*

---

La noche del lunes 5 de mayo…

## El consejo invisible
…

## La atención como infraestructura
…

---

**Fuentes**

- [Milei reunió en Olivos a un grupo de influencers libertarios… — Infobae, 05/05/2026](https://...)
- […]
```

### Cómo lo parsea el sitio

`platform/frontend/src/lib/content.ts` (funciones `parseAgentFilename`, `getAllAgentDrafts`):

- **Filename → metadata**: regex `^(.+?) - (.+?) - (\d{4}-\d{2}-\d{2})\.md$` extrae país, título, fecha. Mapeo país → countrySlug hardcoded.
- **Cuerpo → lede**: `extractLede` busca el primer párrafo que matchea `^\*([^*\n]+)\*` y lo devuelve.
- **Eje conceptual**: NO se extrae. El sitio asume "Erosión de mediaciones" o lo deja vacío.
- **Fuentes**: NO se separan, vienen como markdown en el cuerpo.

### Problemas conocidos

1. Si el agente pone un punto o un guion en el título, el regex puede partir mal.
2. Si el lede no es un párrafo en *italics*, queda vacío.
3. El eje conceptual queda sin asignar — no se puede filtrar `/analisis/borradores` por eje.
4. No hay un campo "fuente disparadora" diferenciado del resto.
5. Si dos archivos tienen el mismo título (raro pero posible) los slugs colisionan.

---

## Propuesta

### 1. Frontmatter que el agente debe escribir

Cada archivo nuevo debe arrancar con este bloque YAML:

```yaml
---
tipo: borrador-agente
estado: borrador
country: Argentina
country_slug: ar
title: "La cena que reemplazó al partido"
slug: la-cena-que-reemplazo-al-partido
fecha: 2026-05-10
semana: 19
year: 2026
ejes:
  - mediaciones
  - atencion
eje_principal: mediaciones
lede: "Mientras el escándalo Adorni sacudía al gabinete, Javier Milei recibió en Olivos a una decena de influencers libertarios. Una hora y media de reunión a puertas cerradas, sin partido, sin ministros, sin prensa."
disparador:
  url: https://www.infobae.com/politica/2026/05/05/milei-reunio-en-olivos-a-un-grupo-de-influencers-libertarios-para-recargar-la-batalla-cultural-desde-las-redes/
  medio: Infobae
  fecha_publicacion: 2026-05-05
  titulo: "Milei reunió en Olivos a un grupo de influencers libertarios"
fuentes_count: 10
agent_run_id: 2026-05-10T18:09:31-03:00
agent_version: v1.2
---
```

**Campos obligatorios:** `tipo`, `country`, `country_slug`, `title`, `slug`, `fecha`, `eje_principal`, `lede`.
**Campos recomendados:** `ejes` (lista, primer eje = principal), `disparador.url`, `disparador.medio`.
**Campos meta:** `agent_run_id`, `agent_version` (para debugging del agente, no se muestran).

### 2. Valores válidos para `eje_principal` y `ejes`

```
deculturacion | mediaciones | desrepresentacion | estetizacion | desorientacion | atencion
```

(Los seis ejes del proyecto. Misma convención que `axisKey` en `lib/analisis.ts`.)

### 3. Cambios en el SKILL del agente

Ubicación: `C:\Users\Tomi\OneDrive\Documentos\Claude\Scheduled\mapa-inestable-borrador-diario\SKILL.md`

- Agregar al prompt del agente una sección "Estructura del archivo" que documente el frontmatter con un ejemplo completo
- Agregar la lista de seis ejes válidos y pedir al agente que asigne `eje_principal` después de redactar
- Pedir que extraiga del cuerpo redactado: lede (primer párrafo italics), `disparador` (primera fuente listada al final del archivo)
- Pedir `slug` calculado (kebab-case del título, sin acentos, sin signos)
- Mantener el filename actual `<País> - <Título> - YYYY-MM-DD.md` por compatibilidad — el sitio va a usar el frontmatter pero el filename sigue siendo legible al ojo en el vault

### 4. Cambios en `lib/content.ts`

Reemplazar `parseAgentFilename` y la heurística de `extractLede` por:

```ts
import matter from "gray-matter";

export interface AgentDraftMeta {
  slug:        string;     // <country_slug>/<slug-pieza>
  pieceSlug:   string;     // del frontmatter
  countrySlug: string;
  country:     string;
  title:       string;
  lede:        string;
  date:        string;     // del frontmatter
  ejePrincipal: string;
  ejes:        string[];
  disparador?: { url: string; medio?: string; titulo?: string };
  filename:    string;
}

export function getAllAgentDrafts(): AgentDraftMeta[] {
  // 1. listar 60-Borradores/diario/*.md
  // 2. para cada uno, parsear frontmatter con gray-matter
  // 3. validar campos obligatorios; si faltan, log warning y skip (NO crashear el build)
  // 4. ordenar desc por date
}
```

### 5. Compatibilidad con archivos existentes

Los 8 archivos actuales en `60-Borradores/diario/` no tienen frontmatter. Dos opciones:

- **5a (recomendada).** Migrar los 8 manualmente: agregar el frontmatter retrospectivo. Es trabajo de una sola vez, queda todo limpio. Estimado: 30 min con Claude Code.
- **5b.** Mantener fallback en `getAllAgentDrafts()`: si no hay frontmatter, intenta el parsing actual del filename. Soporta indefinidamente la mezcla. Más código, más superficie para bugs.

Spec recomienda **5a**.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `C:\Users\Tomi\OneDrive\Documentos\Claude\Scheduled\mapa-inestable-borrador-diario\SKILL.md` | Editar prompt: agregar sección de frontmatter, ejemplo, validaciones |
| `platform/frontend/src/lib/content.ts` | Reescribir `getAllAgentDrafts`, `getAgentDraft`. Agregar imports de gray-matter (ya está como dep) |
| `60-Borradores/diario/*.md` (8 archivos) | Agregar frontmatter retrospectivo |
| `platform/frontend/src/app/analisis/borradores/page.tsx` | Mostrar el `eje_principal` como pill cromático junto al nombre del país |
| `platform/frontend/src/app/analisis/borradores/[pais]/[slug]/page.tsx` | Mostrar disparador como bloque destacado al inicio si existe |

---

## Criterios de aceptación

1. ✅ Después de editar el SKILL del agente, el primer borrador que escriba mañana debe abrir con frontmatter completo válido.
2. ✅ Los 8 archivos existentes tienen frontmatter agregado a mano y validado.
3. ✅ `getAllAgentDrafts()` lee solo del frontmatter; si un archivo no lo tiene, se loguea un warning pero NO rompe el build (`return out.filter(Boolean)`).
4. ✅ `/analisis/borradores` muestra una pill cromática del eje principal en cada card.
5. ✅ La página de detalle muestra un bloque "Disparador" con el link y el medio cuando el frontmatter lo incluye.
6. ✅ Type-check (`tsc --noEmit`) pasa sin errores.
7. ✅ `next build` completa sin errores.

---

## Riesgos y mitigaciones

- **Riesgo:** el agente vuelve a escribir sin frontmatter o lo escribe mal formado. **Mitigación:** la 1ª corrida después del cambio se inspecciona manualmente; el SKILL incluye un ejemplo extenso copy/pasteable.
- **Riesgo:** romper los archivos existentes al agregar frontmatter retrospectivo. **Mitigación:** hacerlo en un commit separado, fácil revertir.

---

## Implementación sugerida

1. Editar el SKILL del agente (5-10 min).
2. Disparar el agente manualmente (`runScheduledTask`) para validar que produce frontmatter correcto.
3. Si la corrida quedó OK, migrar los 8 archivos existentes (Claude Code los procesa en batch leyendo el cuerpo y armando el frontmatter inferido).
4. Reescribir `getAllAgentDrafts()` con gray-matter.
5. Type-check + visual check de `/analisis/borradores`.
