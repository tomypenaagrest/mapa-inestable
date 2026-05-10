---
spec: 21
titulo: Identidad visual r2 — Logo escalador y sistema cromático ampliado
estado: borrador
autor: Tomás (con Claude)
fecha: 2026-05-09
depende_de: [03, 11, 18]
reemplaza: 03 (parcialmente — la sección "logo" queda obsoleta; la sección "portada" se mantiene)
afecta: [header global, design-system.md, design-tokens.css, OG images, favicon]
prioridad: alta
---

# 21 · Identidad visual r2 — Logo escalador y sistema cromático ampliado

## Resumen ejecutivo

El logo del proyecto se reemplaza. El nuevo logo (`logo mapa inestable 3.png` en raíz del workspace) introduce un cambio narrativo importante: una **figura humana escalando la silueta invertida de Sudamérica**. La metáfora — un sujeto intentando orientarse en una geografía vuelta del revés — alinea la identidad con la hipótesis central del proyecto. Deja de ser "homenaje a Torres García" y pasa a ser "Torres García + el sujeto que lo habita".

Esta spec:

1. Documenta el logo nuevo con su paleta, tipografía y elementos.
2. Define las **variantes necesarias** para los distintos contextos del sitio (header chico, hero, OG image, favicon).
3. **Amplía el design system** con un "oro de marca" más saturado que el `--mi-accent-gold` actual.
4. Decide si el **escalador como motivo** se usa solo en el logo o aparece como elemento recurrente del sitio.
5. Documenta el cambio tipográfico "Polo S" → "S POLO" y sus implicaciones para otros bloques editoriales (frame strip de país, Spec 15 §4.2).
6. Marca **Spec 03 como reemplazada** en su sección de logo.

**Lo que NO entra:**
- Re-diseño del sitio entero (la paleta Grabado se mantiene; solo se amplía).
- Cambio del color base terracota dominante.
- Decisión sobre el comparador de paleta de la sesión anterior (esa task sigue agendada).

---

## 1. Lo que cambia respecto a los logos anteriores

Existen tres versiones del logo en la carpeta raíz del workspace:

| Archivo | Versión | Descripción |
|---|---|---|
| `logo mapa inestable 1.png` | v1 | Versión inicial, simple |
| `logo mapa inestable 2.png` | v2 | Iteración intermedia |
| **`logo mapa inestable 3.png`** | **v3 (nuevo)** | **Reemplaza** v1 y v2 |

El cambio narrativo principal es la **incorporación de la figura del escalador** trepando la silueta. En las versiones anteriores el motivo era solo cartográfico (silueta + sol + decoraciones); en v3 hay un sujeto que trepa el mapa. Esa figura **es la diferencia clave** y debería tratarse como elemento de identidad protagónico, no decoración.

Otras diferencias respecto a v1/v2:

- Tipografía "MAPA INESTABLE" prominente en la base del logo en display robusto.
- Inversión del label tipográfico: "Polo S" → "S POLO" (la "S" arriba aislada como marca).
- Aparecen dos peces: uno verde-negro (continuidad con el dibujo de Torres García) y otro dorado (elemento nuevo, identidad propia).
- Asterisco/punto dorado en esquina inferior derecha (firma del proyecto).
- Olas decorativas en la base (separan tipografía del fondo).
- Textura granulada de papel impreso explícita (más prominente que en versiones anteriores).

---

## 2. Anatomía del logo v3

### 2.1 Elementos identificados (de arriba a abajo, izquierda a derecha)

| # | Elemento | Color aproximado | Rol |
|---|---|---|---|
| 1 | Sol con rayos | Dorado saturado | Identidad — referencia Torres García |
| 2 | "S POLO" | Verde-negro / Dorado | Marker editorial — sur arriba |
| 3 | Cruz `+` con coordenadas "S 34°41' W 56°9'" | Verde-negro | Cita del original (coordenadas de Montevideo) |
| 4 | Silueta de Sudamérica invertida | Verde-negro | Eje visual |
| 5 | **Escalador (figura humana con piolet)** | **Dorado** | **Elemento narrativo nuevo — protagonista** |
| 6 | "Ecuador" | Verde-negro | Marker editorial — norte abajo |
| 7 | Pez verde + ondas | Verde-negro | Continuidad Torres García |
| 8 | Pez dorado + ondas | Dorado | Identidad propia (nuevo) |
| 9 | Tipografía "MAPA INESTABLE" | Verde-negro | Wordmark |
| 10 | Olas decorativas inferiores | Verde-negro | Separación visual |
| 11 | Asterisco/punto | Dorado | Firma — posible favicon |
| 12 | Textura granulada papel | Sobreimposición | Identidad táctil |

### 2.2 Paleta del logo

Tres colores principales sobre fondo terracota:

| Color | Aproximación hex | Token DS sugerido |
|---|---|---|
| Fondo terracota | `#C5663A` (similar a `--mi-bg`) | `--mi-bg` (existente) |
| Tinta verde-negro | `#1F2A12` | `--mi-ink` (existente) |
| **Dorado de marca** | **~`#E8B14B`** | **`--mi-brand-gold` (NUEVO)** |

El dorado del logo v3 es **más saturado** que el `--mi-accent-gold` (`#E8C58A`) actual del DS. El `--mi-accent-gold` es un dorado pálido, el del logo es un dorado pleno. No son intercambiables.

### 2.3 Tipografía

"MAPA INESTABLE" usa una tipografía display de peso muy alto, casi stencil/block. Las características visibles:
- Letras de proporción ancha (no condensada).
- Peso black (más pesado que un Bold normal).
- Contraste vertical fuerte, casi sin contraste curvo.
- Algunas letras (la "A", la "I") tienen corte de stencil sutil.

**Hipótesis tipográfica**: probablemente **Alfa Slab One** (la display del DS) renderizada en tamaño grande con tracking ajustado. La "block-stencil feel" puede venir del grano de la textura sobreimpuesta, no de la fuente misma.

**A confirmar**: si es Alfa Slab One, todo el DS es coherente. Si es otra (ej. Bungee, Anton, Ultra), hay que sumarla al stack del DS.

---

## 3. Variantes necesarias

El logo v3 es cuadrado (1:1) y muy detallado. No funciona literal en todos los contextos. Se requieren cinco variantes derivadas.

### 3.1 Logo completo (full)

**Uso:** OG image, página `/acerca`, header de mail (Substack), footer del sitio.

**Especificación:**
- Aspect ratio 1:1 (1080×1080 por default, escalable).
- Todos los elementos del logo v3 visibles.
- Es el archivo PNG actual (`logo mapa inestable 3.png`).

### 3.2 Logo horizontal (header del sitio)

**Uso:** header global del sitio (Spec 18 §B4 lo redimensiona a 96px de alto).

**Composición propuesta:**

```
[ Silueta + escalador  ]   MAPA INESTABLE
[ (vertical, 96px alto)]   (Alfa Slab One, peso pleno)
                            cartografía política del sur
```

A la izquierda: la silueta con el escalador trepando (sin sol, sin "S POLO", sin coordenadas, sin peces, sin olas — solo silueta + escalador). A la derecha: tipografía "MAPA INESTABLE" en una línea + tagline "cartografía política del sur" debajo en mono lowercase (Spec 18 §B4 r1).

**Por qué simplificar:** un header de 96px no permite leer detalles. La silueta + el escalador se mantienen como pieza identificable; el resto del logo se va a otros contextos.

### 3.3 Monograma (silueta + escalador, sin texto)

**Uso:** marca de agua sutil en `/acerca`, separador visual entre secciones, favicon de tabs grandes (Apple Touch Icon 180×180).

**Especificación:**
- Cuadrado o levemente vertical.
- Solo silueta + escalador.
- En dos modos: sobre terracota (default) y sobre cream (reverso).

### 3.4 Wordmark (solo tipografía)

**Uso:** signature en email, citaciones académicas, OG image alternativa para X/Twitter.

**Especificación:**
- "MAPA INESTABLE" en Alfa Slab One peso pleno.
- Una línea o dos líneas según contexto.
- Sin elementos gráficos.

### 3.5 Mark (favicon) y app icon

**Decisión r1 confirmada en sesión:**

- **Favicon (browser tabs, 16×16 y 32×32)**: el **asterisco/punto dorado** de la esquina inferior derecha del logo v3. Geométrico, simple, identificable a tamaño mínimo.
- **App icon (iOS / PWA, 180×180+)**: **el monograma** (§3.3) — silueta + escalador sobre terracota, **sin nombre**. La narrativa del escalador trepando se mantiene a esa escala; el wordmark se sacrifica porque no se lee a 180px y compite con el ícono del sistema operativo.

Diferenciación:
- Favicon = signal mínimo (existencia de la marca).
- App icon = identidad narrativa (el escalador como protagonista).

Esto requiere producir **dos archivos distintos** (no es la misma imagen escalada).

### 3.6 Variante reverso (claro sobre oscuro)

**Uso:** banda terracota oscura (`--mi-bg-dark` o `--mi-bg-warm`), placas de redes con fondo oscuro.

**Especificación:** invertir los colores — silueta en cream, dorado en cream o blanco. Mantener el escalador como elemento visible.

---

## 4. Cambios al design system

### 4.1 Token nuevo: `--mi-brand-gold`

```css
:root {
  /* ... tokens existentes ... */
  
  /* Oro de marca (logo v3 r2 — Spec 21) */
  --mi-brand-gold: #E8B14B;
  --mi-brand-gold-warm: #D89A35;  /* hover/state activo */
  --mi-brand-gold-pale: var(--mi-accent-gold);  /* alias del existente */
}
```

El token existente `--mi-accent-gold` (`#E8C58A`) se preserva como **dorado pálido decorativo** (úsalo en highlights de texto, badges suaves, fondos de chip). El nuevo `--mi-brand-gold` (`#E8B14B`) es el **oro de identidad** (logo, escalador como motivo, asterisco como mark).

Diferencia funcional:
- `--mi-accent-gold`: decorativo, secundario.
- `--mi-brand-gold`: identidad, asociado a "Mapa Inestable" como marca.

### 4.2 Mixin de textura granulada

El logo v3 tiene textura de papel impreso. El DS ya tiene `.mi-grain` (líneas paralelas suaves a baja opacidad — `design-system.md`). El logo v3 sugiere algo **más granulado** — más cerca de "ruido orgánico" que de "líneas paralelas".

**Propuesta:** agregar una variante:

```css
.mi-grain-paper {
  /* SVG noise filter, opacity 0.04, multiply blend mode */
  background-image: url("data:image/svg+xml,...");
  mix-blend-mode: multiply;
  opacity: 0.06;
  pointer-events: none;
}
```

Aplica en heroes, secciones con fondo terracota, cards de eje. NO en cuerpo de lectura (rompe la legibilidad).

**Decisión pendiente:** confirmar si vale el costo extra (peso del SVG inline, performance) o si el `.mi-grain` actual alcanza.

### 4.3 Tipografía display — confirmación

Si el wordmark del logo v3 usa **Alfa Slab One** (lo más probable), el DS no necesita cambios — ya está como `--mi-font-display`.

Si usa **otra fuente** (Bungee Inline, Anton, Ultra, custom), agregarla al stack:

```css
:root {
  --mi-font-display: 'Alfa Slab One', serif;
  --mi-font-display-pleno: 'Bungee', 'Alfa Slab One', serif;  /* solo si es distinta */
}
```

**Acción requerida**: confirmar qué fuente es. Si Tomás puede pasarme un crop alto del wordmark, la identifico. Si no, asumimos Alfa Slab One y se valida visualmente al implementar.

---

## 5. El escalador como motivo

### 5.1 Pregunta abierta

¿La figura del escalador aparece **solo en el logo**, o **se reusa** como motivo recurrente en otros lugares del sitio?

### 5.2 Opciones evaluadas

**Opción A — Solo en el logo.**
- Decisión conservadora.
- Pro: mantiene el escalador como elemento singular, evita gastarlo.
- Contra: pierde la oportunidad de tejer la metáfora en el sitio.

**Opción B — Motivo recurrente discreto.**
- El escalador aparece en:
  - Estado vacío de cualquier tab/listado ("no hay análisis para este filtro" + escalador chiquito en un costado).
  - Loading screens (escalador con animación sutil de progresión).
  - Marca de agua en bottom de `/acerca` y `/método`.
  - Cover fallback de ensayos (Spec 19 §3.4) — el escalador como elemento alternativo a la composición tipográfica.
- Pro: refuerza la metáfora del proyecto en momentos editoriales.
- Contra: requiere disciplina para no saturar; cuanto más aparece, menos significa.

**Opción C — Motivo simbólico solo en momentos editoriales fuertes.**
- El escalador aparece solo en:
  - Logo (siempre).
  - Cover de despachos especiales (despacho de cierre de año, despacho temático).
  - Página `/acerca` como ilustración del proyecto.
- Pro: cada aparición carga peso; no se gasta.
- Contra: requiere curaduría editorial — Tomás decide cuándo "merece" la aparición.

**Recomendación: Opción C.** Es la que mejor cuida el motivo. La figura del escalador es un elemento narrativo fuerte; aparece poco, dice mucho.

**Decisión r1 confirmada en sesión: Opción C.** El escalador aparece solo en momentos editoriales fuertes (logo, app icon, `/acerca`, despachos especiales). No se usa como ícono de UI ni como decoración recurrente.

### 5.3 Lo que NO debe pasar

- El escalador como ícono de UI (botón "ir arriba", flecha de scroll). Mata la metáfora.
- El escalador animado de manera juguetona ("salta cuando hacés click"). Choca con la sobriedad editorial del proyecto.
- El escalador en badges decorativos sin contexto. Lo descomerciliza pero también lo banaliza.

---

## 6. Cambio "Polo S" → "S POLO" (resuelto: render de Gemini)

### 6.1 Lo que se observa

En el logo v3, el label arriba del polo dice "**S** POLO" (la "S" prominente arriba, "POLO" debajo en menor tamaño), no "Polo S" como en el dibujo original de Torres García y como aparecía en versiones anteriores del sitio.

### 6.2 Resolución

Confirmado en sesión: **fue un render del modelo de imagen (Gemini) al generar el logo, no una decisión editorial.** No tiene peso interpretativo y no se replica en otros lugares del sitio.

### 6.3 Política derivada

- **Dentro del logo v3**: "S POLO" se mantiene tal como salió. Es parte de la composición visual del logo y rehacerlo introduce más riesgo del que vale.
- **Fuera del logo**: en cualquier otro contexto editorial — frame strip de país (Spec 15 §4.2), referencias en cuerpo de análisis, OG images, mocks — se usa la forma estándar "Polo S" o "Polo Sur".
- **Spec 15 §4.2 no se modifica**: el frame strip queda como estaba, sin adoptar el mark "S".

---

## 7. Implementación técnica

### 7.1 Archivos a producir

| Archivo | Formato | Tamaño | Uso |
|---|---|---|---|
| `logo-completo.png` | PNG | 1080×1080 | OG image, mail, /acerca |
| `logo-completo.svg` | SVG | viewBox 1080×1080 | Web (escalable) |
| `logo-horizontal.svg` | SVG | viewBox 480×96 | Header |
| `logo-monograma.svg` | SVG | viewBox 256×256 | Marca de agua |
| `logo-wordmark.svg` | SVG | viewBox 480×80 | Email, citas |
| `favicon.svg` + `.ico` | SVG + ICO | 16×16 a 256×256 | Browser tabs |
| `apple-touch-icon.png` | PNG | 180×180 | iOS |
| `og-default.png` | PNG | 1200×630 | OG image fallback |

### 7.2 Decisión PNG vs SVG para el logo completo

El logo v3 actual está en PNG con textura granulada visible. Convertirlo a SVG plano pierde la textura. Dos opciones:

**A. SVG sin textura.** Plano, escalable, ligero (~10-30 KB). Pierde el "feel" táctil.
**B. SVG con noise filter inline.** Aplica `<filter>` con `<feTurbulence>` para simular grano. Pesa más (~50-80 KB), pero conserva la textura. El render varía según el browser.

**Recomendación:** opción A para el logo horizontal del header (rapidez, claridad a 96px). Opción B para el logo completo (OG image, /acerca) — donde la textura aporta. Mantener también el PNG original como fallback (browsers viejos, redes sociales que requieren raster).

### 7.3 Migración

1. Crear carpeta `70-Producto/design-system/logo/` y guardar todas las variantes ahí.
2. En `platform/frontend/public/` colocar los archivos servidos directos (favicon, og-default).
3. Actualizar `<Header>` (Spec 18 §B4) para usar `logo-horizontal.svg`.
4. Actualizar `<Footer>` para usar `logo-completo.svg` o `logo-monograma.svg`.
5. Actualizar `app/layout.tsx` con metadata de OG image y favicon.
6. Smoke test: home, análisis individual, ficha de país, /acerca, share en X/Twitter (preview).

### 7.4 Reemplazo de logos viejos

**Decisión r1: archivar.** `logo mapa inestable 1.png` y `logo mapa inestable 2.png` se mueven a `70-Producto/design-system/logo/_archive/` con su nombre original. El historial queda pero salen de la raíz del workspace.

`logo mapa inestable 3.png` también se mueve a `70-Producto/design-system/logo/` (sin `_archive/`) como fuente activa, dejando la raíz limpia de archivos de logo.

---

## 8. Roadmap

### Fase A — Confirmaciones editoriales (½ día, charla con Tomás)

1. Confirmar tipografía del wordmark (Alfa Slab One u otra).
2. Confirmar "S POLO" como decisión nueva o render accidental.
3. Decidir entre Opción A/B/C para el escalador como motivo (§5.2). **Mi recomendación: C**.
4. Confirmar uso del asterisco como favicon (§3.5).
5. Decidir destino de logos v1 y v2 (§7.4). **Mi recomendación: archivar**.

### Fase B — Producción de variantes (1-2 días, diseño)

1. Generar SVG horizontal para el header (silueta + escalador + wordmark inline).
2. Generar SVG monograma (silueta + escalador, sin texto). Esto es también el **app icon** (§3.5).
3. Generar SVG wordmark (solo "MAPA INESTABLE").
4. Generar SVG favicon (asterisco) + .ico fallback.
5. Generar PNG OG image 1200×630 con composición ajustada al ratio.
6. Generar PNG apple-touch-icon 180×180 (= versión raster del monograma).

**Decisión r1 confirmada en sesión:** la producción NO la hago yo. Las vectorizaciones de Claude (Torres García, capitales) salieron pobres — la calidad necesaria para identidad visual está fuera de lo que puedo entregar con confianza. Esta fase la asume Tomás directamente o un diseñador externo. Vale el costo.

### Fase C — Integración técnica (1 sprint)

1. Sumar tokens `--mi-brand-gold` y `--mi-brand-gold-warm` a `design-tokens.css`.
2. Actualizar `design-system.md` con la sección de logo r2 reemplazando la actual.
3. Reemplazar el componente `<Logo>` del frontend con la variante horizontal.
4. Actualizar metadata global del sitio (favicon, OG image, apple-touch-icon).
5. Aplicar `.mi-grain-paper` (si se aprueba en §4.2) a heroes y secciones con fondo terracota.
6. Verificar contrastes a11y en cada uso del oro de marca sobre los fondos del DS.

### Fase D — Aplicación selectiva del escalador como motivo (continua)

Si se aprueba Opción C (§5.2):
1. Diseñar la primera aparición del escalador como motivo: página `/acerca` con composición + texto.
2. Curar las apariciones futuras editorialmente — Tomás decide cuándo merece aparecer.

---

## 9. Decisiones tomadas

| # | Tema | Decisión |
|---|---|---|
| 1 | Reemplazo del logo | Sí. v3 reemplaza v1 y v2. Confirmado en sesión 2026-05-09 |
| 2 | Posición de Spec 03 | Marcada como reemplazada en su sección de logo (la sección "portada" se mantiene) |
| 3 | Token nuevo en DS | Agregar `--mi-brand-gold` `#E8B14B` distinto de `--mi-accent-gold` pálido |
| 4 | Cantidad de variantes | 5 + variante reverso (§3) |
| 5 | Favicon | Asterisco dorado (16×16, 32×32) |
| 6 | App icon (180×180) | Monograma — silueta + escalador, **sin wordmark** |
| 7 | Escalador como motivo | **Opción C confirmada** — solo momentos editoriales fuertes |
| 8 | "S POLO" en el logo | Render de Gemini, no decisión editorial. Se mantiene en el logo, no se replica en el resto del sitio. Frame strip de país (Spec 15 §4.2) NO se modifica |
| 9 | Logos v1 y v2 | Archivar en `70-Producto/design-system/logo/_archive/`. Logo v3 también se mueve a `70-Producto/design-system/logo/` |
| 10 | Producción de variantes | NO la hace Claude. La asume Tomás o un diseñador externo |

## 10. Decisiones pendientes

1. **Tipografía del wordmark "MAPA INESTABLE".** No confirmado todavía. Default operativo: asumir **Alfa Slab One** (la display ya existente en el DS) y validar visualmente al producir las variantes. Si no coincide, sumarla al stack en ese momento.

2. **Mixin `.mi-grain-paper` vale el costo o no.** Pendiente. Decisión post-implementación, viendo si la textura se extraña en heroes y secciones de fondo terracota. El DS funciona sin él.

---

## 11. Acciones inmediatas en otras specs

Esta spec genera updates en otras specs. No los hace por sí misma — son to-dos:

| Spec | Sección | Update |
|---|---|---|
| 03 | logo | Marcar como reemplazada por Spec 21. Sección "portada" se mantiene |
| 11 | §4.1 header | Reemplazar referencia al logo viejo por logo horizontal r2 |
| 15 | §4.2 frame strip | Sin cambios — "S POLO" se confirmó como render de Gemini (§6.2) |
| 18 | §B4 logo subdimensionado | Resolución del bug usa la nueva variante horizontal r2 |
| 19 | §3.4 cover fallback ensayos | Considerar el escalador como elemento alternativo en covers (si se aprueba opción B/C) |
| design-system.md | sección logo | Reemplazar entera con anatomía r2 |
| design-tokens.css | tokens de color | Sumar `--mi-brand-gold` y warm |

---

## Glosario

- **v1 / v2 / v3**: las tres versiones del logo del proyecto. v3 es la actual a partir de esta spec.
- **Escalador**: la figura humana con piolet trepando la silueta. Elemento narrativo nuevo del logo v3.
- **Wordmark**: la pieza tipográfica "MAPA INESTABLE" sin elementos gráficos.
- **Mark**: la marca mínima usable como favicon (asterisco dorado).
- **Monograma**: silueta + escalador sin texto.
- **`--mi-brand-gold`**: nuevo token de oro de identidad (`#E8B14B`), distinto del `--mi-accent-gold` pálido.
