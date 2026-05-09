# Épica E002 — Página comparativa cross-país

> **Estado:** propuesta de planificación · `2026-05-08`
> **Tamaño T-shirt:** **S** (chica) — 1-2 días post-E001
> **Bloquea:** vista cross-país del dataset Latinobarómetro 2024
> **Bloqueado por:** E001 cerrada (dataset cargado, módulo TS publicado, componentes `<IndicatorCard>` y `<IndicatorBar>` en uso)

---

## 1. Por qué existe

E001 puebla cada ficha-país con sus 12 indicadores. Eso resuelve la pregunta "¿cómo está Argentina?", pero no resuelve la pregunta "¿qué patrones cruzan la región?".

Cuando se tienen 12 indicadores × 17 países = 204 datapoints comparables, hay tres usos que la ficha-país no cubre:

- **Editorial (Tomás):** detectar patrones invisibles desde adentro de una ficha. Ej: "los 4 países con fraude electoral percibido > 80% son Honduras, Bolivia, Paraguay, Perú" — eso es una historia que solo aparece en vista comparativa.
- **Conversación con el mapa invertido:** habilita coloreado del mapa Torres García por indicador seleccionado. Sin la vista comparativa el mapa solo navega; con ella, comunica.
- **Descubrimiento / SEO:** lectores que no llegan por país sino por tema ("apoyo a la democracia 2024") tienen una entrada al sitio.

---

## 2. Definición de "hecho"

Al cierre de la épica:

1. Existe la ruta `/comparar/[indicador]` (o `/datos/[indicador]`, decidir nombre en H1).
2. El usuario ve un ranking ordenable de los 17 países para el indicador seleccionado, con valor + delta vs 2023 + barra visual.
3. Hay un selector lateral con los 12 indicadores agrupados por eje (mismo grouping que la ficha-país).
4. Cada barra del ranking enlaza a la ficha-país correspondiente.
5. Cada indicador tiene un bloque corto de "lectura" curado por Tomás (1-3 oraciones: qué se ve acá, qué historia cuenta).
6. La página tiene cita única al pie con link al PDF original (igual patrón que la ficha-país).
7. Se agrega un link "Ver comparativa →" en la sección Pulso ciudadano de cada ficha-país que lleva al ranking del indicador respectivo.

**No-objetivos (explícitos):**
- ❌ Heatmap matriz 12×17 (queda para E003 si E002 demuestra demanda)
- ❌ Comparador de a 2-3 países (queda para E003)
- ❌ Coloreado del mapa invertido por indicador (épica de mapa, no de datos)
- ❌ Filtros por sub-región / agrupación / cohortes
- ❌ Exportación a CSV / imagen (nice-to-have, fuera de scope v1)

---

## 3. Decisiones de scope ya tomadas

| Decisión | Resolución |
|---|---|
| Forma de la vista | Ranking por indicador (un indicador a la vez, 17 países ordenados). Descartados heatmap masivo y comparador 2-país. |
| Ubicación | Página standalone `/comparar/[indicador]`. Descartado integrar como modo del mapa (épica futura). |
| Audiencia | Misma que ficha-país: pública pero diseñada para que Tomás la use como insumo editorial. |
| Componentes | Reusa `<IndicatorBar>` de E001 (full-width en lugar de sidebar). Componentes nuevos mínimos. |
| Indicador por defecto | "Apoyo a la democracia" (`/comparar` redirige a `/comparar/apoyo-democracia`). |

---

## 4. Plan en 4 historias

### H1 · Ruta + page shell + redirect raíz · **XS**
- Crear `platform/frontend/src/app/comparar/[indicador]/page.tsx`.
- Crear `platform/frontend/src/app/comparar/page.tsx` que redirige a `/comparar/apoyo-democracia`.
- Layout: header con nombre del indicador + cita corta + chip del eje · grid 1+1 (selector lateral / ranking principal).
- Sin contenido funcional, solo shell con datos hardcodeados de un país para validar layout.

### H2 · Selector lateral + ranking principal · **S**
- Componente `<IndicatorSelector />` que lista los 12 indicadores agrupados por los 6 ejes (mismo orden que la ficha-país, mismos colores `--mi-axis-{key}`).
- Ranking principal: 17 filas, cada una con: bandera + nombre país, barra horizontal del valor, valor numérico, delta vs 2023 con flecha, link "Ficha →".
- Ordenamiento por defecto: descendente por valor.
- Click en una fila → navega a `/pais/[slug]` con scroll-to del indicador correspondiente (anchor link).
- El país se ordena automáticamente por valor; resaltar promedio regional como línea vertical de referencia.

### H3 · Bloques de "lectura" curados · **S**
- Tomás escribe 12 micro-textos (1-3 oraciones cada uno), uno por indicador, que aparecen al pie del ranking.
- Estructura: "Qué se ve" (síntesis) + "Por qué importa" (link al eje correspondiente).
- Almacenar en `platform/data/latinobarometro-2024/lecturas.json` o como markdown en `platform/frontend/src/content/comparativas/`.
- Si Tomás no escribió la lectura, mostrar placeholder neutral.

### H4 · Navegación cruzada con la ficha-país · **XS**
- En la sección "Pulso ciudadano · Latinobarómetro 2024" de `/pais/[slug]`, cada `<IndicatorCard>` gana un link "Comparar →" abajo del valor.
- En el header de `/comparar/[indicador]`, agregar breadcrumb "Datos · Latinobarómetro 2024 · {Nombre del indicador}".
- Smoke test: verificar que las dos rutas se enlazan correctamente en ambos sentidos.

---

## 5. Dependencias y orden

```
E001 (cerrada) ──► H1 (shell) ──► H2 (selector + ranking) ──► H4 (navegación)
                                                       │
                                                       └─► H3 (lecturas) puede ir en paralelo con Tomás escribiendo
```

H3 es el único que requiere trabajo de Tomás (escribir las 12 lecturas). H1, H2 y H4 son código puro.

---

## 6. Estimación

| Camino | Tiempo |
|---|---|
| Solo Claude (con lecturas listas) | 1 día |
| Claude programa + Tomás escribe lecturas en paralelo | 1 día calendario |
| Solo Tomás | 2-3 días |

**Recomendación:** ejecutar inmediatamente después de E001 H4 (integración en ficha-país), aprovechando que el dataset y los componentes están frescos.

---

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El ranking se ve plano sin el contexto del eje | Media | Codificar visualmente el eje con el color en el header del indicador y en el chip de cada fila |
| Las lecturas curadas no se escriben | Alta | Usar placeholder neutral; bloque opcional, no obligatorio |
| Selector con 12 items se ve denso en mobile | Media | En mobile colapsar selector como `<select>` nativo o drawer |
| Promedio regional no comunica nada en indicadores muy heterogéneos | Baja | Agregar segunda línea de referencia "mediana" en una iteración futura si hace falta |
| Confusión sobre qué vista usar (ficha vs comparativa) | Media | UX clara: ficha es "profundidad", comparativa es "estructura". El breadcrumb y los links cruzados ayudan |

---

## 8. Lo que esta épica habilita después

- **E003 — Heatmap matriz 12×17:** una vez probado el ranking, agregar vista alternativa con todos los indicadores en una sola pantalla. Reusa todos los componentes y datos de E002.
- **E004 — Mapa invertido coloreado por indicador:** el dataset estructurado de E001+E002 alimenta directamente al mapa principal. El usuario hover sobre un país → ve el indicador activo. Click → entra a la ficha.
- **E005 — Comparador de a 2-3 países:** vista lateral side-by-side. Útil para análisis ("Argentina vs Brasil vs Uruguay en confianza institucional"). Reusa `<IndicatorBar>` y datos.
- **Series históricas (épica de datos):** una vez que la vista comparativa funciona con un solo año, agregar 1995-2023 transforma cada barra en una línea de tiempo. Cambia el componente, no la arquitectura.

---

## Apéndice — Estructura de archivos resultante

```
platform/
├── data/
│   └── latinobarometro-2024/
│       └── lecturas.json                          # nuevo (H3)
└── frontend/
    └── src/
        ├── app/
        │   └── comparar/
        │       ├── page.tsx                       # nuevo (H1) — redirect
        │       └── [indicador]/
        │           └── page.tsx                   # nuevo (H1, H2)
        ├── components/
        │   ├── IndicatorBar.tsx                   # de E001 (reusado)
        │   ├── IndicatorSelector.tsx              # nuevo (H2)
        │   └── IndicatorRanking.tsx               # nuevo (H2)
        └── lib/
            └── latinobarometro-2024.ts            # de E001 (reusado, sin cambios)
```
