# Spec 13 — Página comparativa cross-país (LB 2024)

**Estado:** pendiente
**Depende de:** Spec 12 (las fichas-país tienen que tener Pulso ciudadano implementado)
**Prioridad:** media
**Tipo:** visualización editorial + página
**Tamaño:** S (1 día post-Spec 12)
**Bloqueado por:** Spec 12 cerrada

---

## 1. Por qué esta spec existe

Spec 12 puebla cada ficha-país con sus 12 indicadores. Eso resuelve la pregunta "¿cómo está Argentina?", pero no resuelve la pregunta "¿qué patrones cruzan la región?".

Cuando se tienen 12 indicadores × 17 países = 204 datapoints comparables, hay tres usos que la ficha-país no cubre:

- **Editorial (Tomás):** detectar patrones invisibles desde adentro de una ficha. Ej: "los 4 países con fraude electoral percibido > 80% son Honduras, Bolivia, Paraguay, Perú" — historia que solo aparece en vista comparativa.
- **Conversación con el mapa invertido:** habilita coloreado del mapa Torres García por indicador seleccionado (futura). Sin la vista comparativa el mapa solo navega; con ella, comunica.
- **Descubrimiento / SEO:** lectores que no llegan por país sino por tema ("apoyo a la democracia 2024") tienen una entrada al sitio.

## 2. Definición de "hecho"

Al cierre de la spec:

1. Existe la ruta `/comparar/[indicador]` (decidir nombre exacto en H1: `/comparar` o `/datos`).
2. El usuario ve un ranking ordenable de los 17 países para el indicador seleccionado, con valor + barra visual + ranking.
3. Hay un selector lateral con los 12 indicadores agrupados por eje (mismo grouping que la ficha-país).
4. Cada barra del ranking enlaza a la ficha-país correspondiente.
5. Cada indicador tiene un bloque corto de "lectura" curado por Tomás (1-3 oraciones).
6. La página tiene cita única al pie con link al sitio oficial de Latinobarómetro.
7. Se agrega un link "Comparar →" en cada `<IndicatorCard>` de la ficha-país que lleva al ranking del indicador respectivo (link bidireccional con Spec 12).

**No-objetivos (explícitos):**
- ❌ Heatmap matriz 12×17 (queda para spec futura si se demuestra demanda)
- ❌ Comparador de a 2-3 países side-by-side
- ❌ Coloreado del mapa invertido por indicador (cambia la UI del mapa, spec aparte)
- ❌ Filtros por sub-región / agrupación / cohortes
- ❌ Exportación a CSV / imagen

## 3. Decisiones de scope ya tomadas

| Decisión | Resolución |
|---|---|
| Forma de la vista | Ranking por indicador (un indicador a la vez, 17 países ordenados). Descartados heatmap masivo y comparador 2-país. |
| Ubicación | Página standalone `/comparar/[indicador]`. Descartado integrar como modo del mapa (cambia mapa, spec aparte). |
| Audiencia | Misma que ficha-país: pública pero diseñada para que Tomás la use como insumo editorial. |
| Componentes | Reusa `<IndicatorBar>` de Spec 12 (full-width en lugar de sidebar). Componentes nuevos mínimos. |
| Indicador por defecto | "Apoyo a la democracia" (`/comparar` redirige a `/comparar/apoyo-democracia`). |

## 4. Plan en 4 historias

### H1 · Ruta + page shell + redirect raíz · **XS**

- Crear `platform/frontend/src/app/comparar/[indicador]/page.tsx`.
- Crear `platform/frontend/src/app/comparar/page.tsx` que redirige a `/comparar/apoyo-democracia`.
- Layout: header con nombre del indicador + cita corta + chip del eje · grid 1+1 (selector lateral / ranking principal).
- Sin contenido funcional, solo shell con datos hardcodeados de un país para validar layout.

### H2 · Selector lateral + ranking principal · **S**

- Componente `<IndicatorSelector />` que lista los 12 indicadores agrupados por los 6 ejes (mismo orden que ficha-país, mismos colores `--mi-axis-{key}`).
- Ranking principal: 17 filas, cada una con: bandera + nombre país, barra horizontal del valor, valor numérico, link "Ficha →".
- Ordenamiento por defecto: descendente por valor.
- Click en una fila → navega a `/pais/[slug]` con anchor scroll al indicador correspondiente.
- Línea vertical de promedio regional como referencia visual.

### H3 · Bloques de "lectura" curados · **S**

- Tomás escribe 12 micro-textos (1-3 oraciones cada uno), uno por indicador, que aparecen al pie del ranking.
- Estructura: "Qué se ve" (síntesis) + "Por qué importa" (link al eje correspondiente).
- Almacenar en `platform/data/latinobarometro-2024/lecturas.json` o como markdown en `platform/frontend/src/content/comparativas/`.
- Si no hay lectura escrita, mostrar placeholder neutral.

### H4 · Navegación cruzada con la ficha-país · **XS**

- En la sección "Pulso ciudadano · Latinobarómetro 2024" de `/pais/[slug]`, cada `<IndicatorCard>` gana un link "Comparar →" abajo del valor.
- En el header de `/comparar/[indicador]`, agregar breadcrumb "Datos · Latinobarómetro 2024 · {Nombre del indicador}".
- Smoke test: las dos rutas se enlazan correctamente en ambos sentidos.

## 5. Dependencias y orden

```
Spec 12 (cerrada) ──► H1 (shell) ──► H2 (selector + ranking) ──► H4 (navegación)
                                                          │
                                                          └─► H3 (lecturas) en paralelo con Tomás escribiendo
```

H3 es el único que requiere trabajo de Tomás (escribir las 12 lecturas). H1, H2 y H4 son código puro.

## 6. Estimación

| Camino | Tiempo |
|---|---|
| Solo Claude (con lecturas listas) | 1 día |
| Claude programa + Tomás escribe lecturas en paralelo | 1 día calendario |
| Solo Tomás | 2-3 días |

**Recomendación:** ejecutar inmediatamente después de Spec 12 H4, aprovechando que el dataset y los componentes están frescos.

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El ranking se ve plano sin contexto del eje | Media | Codificar visualmente el eje con color en el header del indicador y chip de cada fila |
| Las lecturas curadas no se escriben | Alta | Usar placeholder neutral; bloque opcional, no obligatorio |
| Selector con 12 items se ve denso en mobile | Media | En mobile colapsar selector como `<select>` nativo o drawer (atender Spec 02) |
| Promedio regional no comunica nada en indicadores muy heterogéneos | Baja | Agregar segunda línea de referencia "mediana" en iteración futura si hace falta |
| Confusión sobre qué vista usar (ficha vs comparativa) | Media | UX clara: ficha es "profundidad", comparativa es "estructura". Breadcrumb y links cruzados ayudan |

## 8. Lo que esta spec habilita después

- **Heatmap matriz 12×17** (futura): una vez probado el ranking, agregar vista alternativa con todos los indicadores en una sola pantalla. Reusa todos los componentes y datos.
- **Mapa invertido coloreado por indicador** (futura): el dataset estructurado lo alimenta directamente. Hover sobre un país → ve el indicador activo. Click → entra a la ficha. Spec aparte porque cambia la UI del mapa.
- **Comparador de a 2-3 países** (futura): vista lateral side-by-side. Reusa `<IndicatorBar>` y datos.
- **Series históricas:** una vez que la vista comparativa funciona con un solo año, agregar 1995-2023 transforma cada barra en una línea de tiempo. Cambia el componente, no la arquitectura.

## Apéndice · Estructura de archivos resultante

```
platform/
├── data/
│   └── latinobarometro-2024/
│       └── lecturas.json                          ← H3 (nuevo)
└── frontend/
    └── src/
        ├── app/
        │   └── comparar/
        │       ├── page.tsx                       ← H1 (redirect)
        │       └── [indicador]/
        │           └── page.tsx                   ← H1, H2
        ├── components/
        │   ├── IndicatorBar.tsx                   ← de Spec 12 (reusado)
        │   ├── IndicatorSelector.tsx              ← H2 (nuevo)
        │   └── IndicatorRanking.tsx               ← H2 (nuevo)
        └── lib/
            └── latinobarometro-2024.ts            ← de Spec 12 (sin cambios)
```
