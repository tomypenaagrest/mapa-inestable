# QA — Spec 05: Archivo + buscador

URL base: `/analisis`

---

## Listado y orden

- [ ] `/analisis` carga sin error
- [ ] Se muestran 20 análisis (todos los mock), ordenados fecha desc
- [ ] Cada tarjeta muestra: fecha · país · eje (con color de eje) · título · lede · "Leer →"
- [ ] "Leer →" navega al análisis individual correcto (`/analisis/[pais]/[slug]`)

## Buscador

- [ ] Escribir "petro" → filtra a análisis de Colombia sobre Petro
- [ ] Escribir "Bolivia" → muestra análisis donde aparece Bolivia en el texto (título, lede o pasos)
- [ ] Highlights dorados aparecen en el término buscado dentro de título y lede
- [ ] Limpiar el campo → vuelven todos los análisis
- [ ] Término sin resultados (ej. "zzz") → muestra estado vacío con mensaje + botón "Ver todos"
- [ ] La URL se actualiza con `?q=petro` después de ~300ms (no en cada tecla)
- [ ] Pegar la URL con `?q=petro` en nueva pestaña → reproduce el estado de búsqueda

## Filtros

- [ ] Checkbox "Colombia" → solo análisis de Colombia; URL incluye `?pais=co`
- [ ] Combinación País + Eje → resultados son la intersección
- [ ] Los conteos en paréntesis reflejan el universo restante (no el total absoluto)
- [ ] "Limpiar filtros ×" restablece todo y limpia la URL
- [ ] URL `?pais=co&eje=desrepresentacion` funciona al pegar en nueva pestaña
- [ ] Filtro por año: checkbox "2025" → solo análisis de 2025

## URL como fuente de verdad

- [ ] Browser back/forward navega entre estados de filtro correctamente
- [ ] Compartir URL con filtros aplicados reproduce el estado exacto

## Navegación hacia el archivo

- [ ] Header del sitio muestra "Archivo" entre Ensayos y Mapa
- [ ] Footer muestra links Despachos / Archivo / Ensayos
- [ ] Desde `/ejes/desrepresentacion` → "Ver todos en archivo →" lleva a `/analisis?eje=desrepresentacion`
- [ ] Desde `/pais/co` → "Ver todos en archivo →" lleva a `/analisis?pais=co`

## Mobile (< 768px)

- [ ] Panel de filtros lateral desaparece
- [ ] Aparece `<details>Filtros</details>` arriba de los resultados, colapsado por defecto
- [ ] Expandir el details muestra los mismos filtros funcionales
- [ ] Buscador queda visible y accesible

## Edge cases

- [ ] `/analisis?page=99` (página inexistente) no rompe la página — carga la última disponible
- [ ] Solo 1 resultado → paginación no aparece
- [ ] Filtro que reduce a 0 → estado vacío correcto, sin error
