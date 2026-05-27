---
tipo: prompt-product-design
spec: 50
fecha: 2026-05-26
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make, otro agente con design context]
naturaleza: subproducto del diseño de Spec 50. Las decisiones del diseño se tomaron con mocks HTML inline en Cowork. Este prompt queda como respaldo para regenerar variantes con otra herramienta o pasarle el contexto a una persona externa
---

# Prompt para Product Design — Spec 50 (reading experience mobile)

## Cómo usar este documento

Si vas a re-generar las variantes de diseño de Spec 50 con otra herramienta (v0, Lovable, Figma Make, otra sesión de Claude), copiá las secciones marcadas como **[PROMPT]** abajo, ajustándolas a la herramienta. Cada sección es un prompt independiente que pide UNA cosa específica.

El orden recomendado es: 1 (tipográfico) → 2 (elementos editoriales) → 3 (portada). Es el mismo orden que se usó en Cowork.

Si la herramienta acepta un solo prompt grande, concatená las 3 secciones precedidas por el bloque de **contexto compartido**.

---

## Contexto compartido (siempre incluir antes de cualquier prompt)

> Estás diseñando la página de lectura de un análisis político del proyecto **Mapa Inestable** — una plataforma editorial de análisis estructural sobre Sudamérica. El producto es la prosa larga; la identidad visual se llama "Grabado" y reclama la tradición del Taller de Gráfica Popular mexicano, Joaquín Torres García, los panfletos políticos del cono sur y las revistas culturales impresas latinoamericanas. No es Medium. No es Substack genérico. Es un periódico crítico latinoamericano contemporáneo.
>
> **Dispositivo de referencia.** Samsung A54, ancho de viewport 360px. Diseñá contra 360px. No emules iPhone — el lector real está en Android mid-range LATAM.
>
> **Paleta:**
> - Fondo dominante: terracota `#C5663A`
> - Fondo de papel: crema `#F4E9D2` (es el fondo del cuerpo de lectura)
> - Fondo profundo: verde-negro `#1F2A12` (no es negro)
> - Tinta principal: `#1F2A12` (sobre crema)
> - Tinta soft: `#3D4A26` (texto secundario)
> - Tinta mute: `#5C6638` (metadata)
> - Acento terracota oscuro: `#B45729` (para wikilinks internos y barras)
> - Acento dorado: `#E8B14B` (separadores, asterisco)
>
> **Familias tipográficas:**
> - Alfa Slab One — display, country names. Nunca body.
> - Fraunces (peso 600) — títulos h1, h2, h3 y pull-quotes (en italic).
> - Lora — body y lede (en italic). Es la prosa larga.
> - IBM Plex Mono (peso 400 y 500) — metadata, captions, axis pills, citas de fuente. Siempre uppercase con letter-spacing 0.06-0.08em.
>
> **Reglas inviolables del design system:**
> - `border-radius: 0` siempre. Nunca redondear nada.
> - Sombras sólidas sin blur (`box-shadow: 6px 6px 0 #1F2A12` típico). Nunca drop-shadow difusa.
> - Cero iconos "simpáticos". Si hace falta un símbolo, es asterisco, mapa, sello.
> - Densidad. No usar exceso de aire. Aire entre piezas, no como dominante.
> - Trazabilidad visible: fuente, eje, fecha siempre visibles, en mono uppercase.

---

## 1. [PROMPT] — Sistema tipográfico

> Diseñá 3 variantes del sistema tipográfico para la página de lectura de un análisis, mostrando el mismo contenido en cada una para comparar side-by-side. Ancho fijo 360px, fondo crema `#F4E9D2`, tinta `#1F2A12`.
>
> **Contenido a usar (real, del corpus del proyecto):**
> - Country name: `BOLIVIA` (Alfa Slab One, uppercase visual aunque no escrito así)
> - H1: "Bolivia después del MAS — el ajuste, la calle y la mediación huérfana"
> - Meta bar (con borde top + bottom 1px tinta, padding 10px vertical): `PUBLICADO · 20 MAY 2026   ·   LECTURA · 12 MIN`
> - Axis pills (3 lado a lado, fondo color del eje, texto crema, mono uppercase): `DESREPRESENTACIÓN` (fondo `#8A4A55`), `MEDIACIONES` (fondo `#4A5C30`), `ATENCIÓN` (fondo `#C8993E`, texto tinta porque dorado claro)
> - Lede (Lora italic, color `#3D4A26`): "Estado de situación a seis meses del gobierno de Paz Pereira: el ajuste sin proyecto cultural, la calle sin canalización y la persistencia analógica de un régimen de movilización que la región está perdiendo."
> - Body párrafo 1 (Lora): "La Central Obrera Boliviana entra esta semana en su tercera semana consecutiva de paro indefinido. El centro de La Paz está atravesado por bloqueos, marchas y consignas que ya no se limitan al pliego original."
> - H2 (Fraunces 600): "El fin de un ciclo"
> - Body párrafo 2: "Veinte años de hegemonía del Movimiento al Socialismo terminaron en octubre de 2025, no en una derrota ordenada sino en una implosión."
>
> **Las 3 variantes a generar:**
>
> | Variante | Body | LH body | h1 | h2 | Padding lateral | Comentario |
> |---|---|---|---|---|---|---|
> | **A** Conservadora | 16px | 1.60 | 30px | 22px | 20px | ~37 chars/línea — equilibrio para periódico crítico latinoamericano |
> | **B** Premium reading | 18px | 1.65 | 32px | 24px | 16px | ~34 chars/línea — estilo Substack/Aeon |
> | **C** Densa purista | 17px | 1.55 | 28px | 22px | 18px | ~37 chars/línea — respeta "densidad es virtud" |
>
> En todas: Alfa Slab country `44-48px`, line-height `1.0`. Margen h1 14-16px arriba, 12-14px abajo. Margen h2 24-28px arriba, 12-14px abajo. Meta bar mono `11px` letter-spacing 0.08em. Axis pills mono `10px` letter-spacing 0.08em.
>
> **Output esperado:** 3 phones de 360px lado a lado o stacked, cada uno con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`. Background del frame externo transparente.
>
> **Decisión que se tomó en este proyecto:** Variante A. La B se sintió más Substack-genérico; la C correcta conceptualmente pero el lh 1.55 fatigaba en 360.

---

## 2. [PROMPT] — Elementos editoriales

> Usando el sistema tipográfico Variante A (body 16/1.6, h1 30, h2 22, padding 20, fondo crema `#F4E9D2`, tinta `#1F2A12`), diseñá la página completa de lectura mostrando TODOS los elementos editoriales que el corpus usa.
>
> **Elementos a mostrar, con estas reglas exactas:**
>
> **2.1. Link externo simple.** Subrayado sólido tinta 1.5px, offset 3px. Mismo color del cuerpo (`#1F2A12`). Sobre frase larga dentro del párrafo.
>
> **2.2. Link externo con cita corta (al final de oración).** IBM Plex Mono 11px uppercase, entre corchetes, color `#5C6638`, subrayado 1px. Aparece al final de una frase para citar la fuente periodística: `[Infobae · 4 may 2026]`.
>
> **2.3. Wikilink interno.** Color terracota oscuro `#B45729`, subrayado punteado 1.5px offset 3px, peso 500. Sobre una palabra o frase corta dentro del párrafo (ej: "estetización", "transición política").
>
> **2.4. Blockquote.** Barra lateral terracota `#B45729` de 4px de ancho. Padding-left 16px. Lora italic 16/1.55, color `#3D4A26`. Margen vertical 20px.
>
> **2.5. Pull-quote.** Fraunces 600 italic 22px/1.30, color tinta. Doble borde horizontal (top y bottom 2px tinta). Padding 16px vertical. Margen vertical 28px. Opcional attribución debajo en mono 11px uppercase color `#5C6638`.
>
> **2.6. Imagen a sangre con caption.** `<figure>` con margin lateral negativo de 20px (rompe el padding del body, ocupa todo el ancho del phone 360). Aspect ratio 3:2. Caption debajo en mono 11px uppercase color `#5C6638`, padding lateral 20px (vuelve al padding del body). Margen vertical 22px.
>
> **2.7. Separador grabado.** Dos rayas horizontales 1px tinta con un asterisco dorado `#E8B14B` central, Alfa Slab One 20px. Margen vertical 28px.
>
> **2.8. Lista con asterisco terracota.** Bullets custom: asterisco Alfa Slab One 16px color `#B45729` en hanging indent. Items en Lora 16/1.55, padding-left 22px relativo a position relative del `<li>`. Margen 10px entre items.
>
> **2.9. H3 minor.** Fraunces 600 18px/1.25. Margen 22px arriba, 8px abajo.
>
> **Contenido sugerido:** mismo análisis Bolivia, ampliado con texto suficiente para mostrar todos los elementos en una sola página. Ver `50-Publicaciones/Bolivia después del MAS - el ajuste, la calle y la mediación huérfana.md` en el vault para texto real.
>
> **Output esperado:** un solo phone de 360px (no 3) con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`, mostrando los 9 elementos editoriales en un análisis continuo.

---

## 3. [PROMPT] — Decisión de portada (hero vs in-flow vs híbrida)

> Diseñá 3 variantes del comportamiento de la portada del análisis en mobile (ancho 360). En todas las variantes el sistema tipográfico es Variante A y los elementos editoriales son los del prompt 2.
>
> Mostrá una "fold line" punteada terracota a 640px desde arriba del frame del phone (es donde corta el viewport visible sin scroll en un Samsung A54).
>
> **Las 3 variantes:**
>
> **Opción 1 — Hero a sangre.** Portada `aspect-ratio: 16/10` arriba a sangre (ancho 100% del phone, sin padding). El country name + h1 + meta + axis + lede vienen después de la portada. Implicancia: la portada gasta todo el fold; texto editorial queda debajo.
>
> **Opción 2 — In-flow contenida.** El header completo (country, h1, meta bar, axis pills, lede) va arriba sin portada. La portada aparece DESPUÉS del lede, con padding lateral igual al body (20px), aspect-ratio 3:2, caption mono uppercase debajo. Después sigue el body. Implicancia: texto editorial domina el fold; la portada es respiro visual entre lede y body.
>
> **Opción 3 — Híbrida overlay.** Portada `aspect-ratio: 4/5` arriba a sangre, fondo verde-negro `#1F2A12`, con el country name + h1 + meta bar **superpuestos abajo a la izquierda** dentro de la portada en texto crema `#F4E9D2`. Después de la portada, axis pills + lede + body sobre crema. Implicancia: combina wow-effect + cabecera arriba del fold, pero exige que las portadas Gemini tengan zona oscura inferior-izquierda donde el texto crema sea legible.
>
> **Output esperado:** 3 phones de 360px stacked o lado a lado, con la fold line marcada en cada uno. Mostrar solo el fold + un primer scroll (~800px total por phone, alcanza para evaluar).
>
> **Decisión que se tomó en este proyecto:** Opción 2 (in-flow contenida). Razones: el producto es el análisis, no la imagen; "densidad es virtud" del design system; las portadas Gemini son experimentales en calidad y constancia (sostenerlas in-flow es más conservador). Opción 1 se descartó por sacrificar el fold editorial. Opción 3 se descartó por agregar constraint operativo a las portadas Gemini que no compensa el wow effect en la escala del proyecto.
>
> Para análisis de despachos especiales o portadas particularmente potentes, queda contemplado un flag editorial `featured: true` en frontmatter que permite sobreescribir la default in-flow con hero a sangre. Para el lanzamiento inicial no se usa.

---

## Adaptación por herramienta

**Si la herramienta es v0 (Vercel):** prefijar cada PROMPT con `Generate React + Tailwind code for...`. Pedirle código export-ready, no solo mockup visual. v0 tiende a usar `rounded-md` y `shadow-md` por default — recordarle explícitamente las reglas inviolables (`border-radius: 0`, sombras sólidas sin blur).

**Si la herramienta es Lovable:** funciona mejor con prompts que describan la página completa como "una app de lectura editorial". Pasar el contexto compartido + un solo prompt mega-combinado en lugar de 3 separados.

**Si la herramienta es Figma Make:** pedir componentes Figma editables, no HTML. Funcionará bien para iterar refinos visuales pero después hay que traducir a código en VS Code manualmente.

**Si la herramienta es otra sesión de Claude con artifacts:** usar este prompt tal cual. Claude puede generar HTML inline con `mcp__visualize__show_widget` o como artifact persistente. El patrón funciona bien y fue el que se usó para diseñar Spec 50 originalmente.

---

## Outputs esperados de Spec 50 (referencia para validar lo generado)

Si los outputs no cumplen estos criterios, iterar:

- Las 3 variantes tipográficas se ven claramente distintas en ritmo de lectura.
- Los elementos editoriales se distinguen entre sí sin necesidad de leerlos (link externo ≠ wikilink ≠ blockquote ≠ pull-quote es evidente a primera vista).
- La portada in-flow tiene el caption mono uppercase debajo, no integrado en la imagen.
- El country name Alfa Slab One se siente "monumental" pero no rompe el ritmo del título Fraunces que sigue.
- Las axis pills tienen sus colores correctos (no genéricos): desrepresentación borgoña, mediaciones verde-oliva, atención dorado.
- Cero border-radius, cero sombras difusas. Si alguna esquina está redondeada, la herramienta no respetó el sistema.

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-26 | Creación como subproducto de Spec 50. Las decisiones del diseño ya se tomaron con mocks HTML inline en Cowork. Este prompt queda como respaldo reutilizable |
