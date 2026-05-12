# Guía de estilo · Portadas Mapa Inestable

**Para:** Gemini / cualquier modelo de imagen que genere portadas para borradores y despachos.
**Referencia técnica:** [design-system.md](./design-system.md) — Dirección "Grabado".

---

## Cómo se usa esta guía

Cada borrador y despacho de Mapa Inestable lleva en su frontmatter un campo `cover_prompt`. El prompt es **específico de la pieza** (qué escena, qué tensión, qué símbolos) y termina con esta línea:

> *Aplicá la guía completa de estilo: `70-Producto/design-system/cover-style-guide.md`*

Cuando pegues el prompt en Gemini, pegá también el bloque "Instrucciones para Gemini" de más abajo. Eso garantiza que cualquier portada respete la dirección visual del proyecto sin tener que repetir 40 líneas en cada prompt.

---

## El espíritu: viñeta política, no postal corporativa

La portada es una **ilustración caricaturesca con vocación de viñeta política**. Pensar en la tradición de la *Revista Humor* argentina (1978–1999) cuando ridiculizaba al poder con un dibujo y dos líneas; pensar en los grabados del Taller de Gráfica Popular mexicano; pensar en Antonio Berni cuando recortaba al político de la escena social.

La portada no decora el borrador: **lo provoca**. Si la imagen no agrega tensión a la pieza, está mal.

### Las cuatro cualidades que toda portada tiene que tener

1. **Mordaz, no neutral** — Posiciona, exagera, ridiculiza si hace falta. La ilustración política sudamericana no es ornamental; es opinión condensada en forma.
2. **Legible desde lejos** — Una silueta principal, un gesto claro, un símbolo central. Si tenés que mirar dos veces para entender qué pasa, no funciona como portada.
3. **Materialmente impresa** — Granulado de papel, registro mal alineado, líneas tramadas. Nunca brillosa, nunca digital limpia. Si parece banner de SaaS, perdimos.
4. **Sudamericana** — Los cuerpos, los rostros, los uniformes, los símbolos: locales. No genéricos. La política sudamericana tiene caras y trajes que no son los de Washington ni Bruselas.

---

## Paleta cromática

Mapa Inestable opera dentro de una paleta cerrada. Cada portada usa **tres o cuatro colores como máximo**, elegidos del conjunto.

### Núcleo (siempre presente al menos uno)

| Rol | Hex | Cuándo |
|---|---|---|
| Terracota dominante | `#C5663A` | Fondo por defecto, pieles, atmósfera cálida |
| Tinta verde-negra | `#1F2A12` | Trazo principal, sombras sólidas, contornos. **Reemplaza al negro.** Nunca usar `#000000`. |
| Papel crema | `#F4E9D2` | Fondo alternativo, contraste claro, alivio |
| Verde profundo | `#1F2A12` / `#3D4A26` | Vegetación, vestimenta institucional, sombras |

### Acentos (uno por portada, máximo)

| Rol | Hex | Cuándo |
|---|---|---|
| Oro de marca | `#E8B14B` | Símbolos de poder, brillos institucionales, ironía de "lo dorado" |
| Dorado pálido | `#E8C58A` | Acentos sutiles, halos, papel envejecido |
| Terracota profundo | `#B45729` | Énfasis, alertas visuales |

### Color del eje activado (opcional)

Cuando el borrador tiene un eje principal claro, podés introducir el color del eje como acento secundario:

| Eje | Hex | Cuándo aparece |
|---|---|---|
| Deculturación | `#6B4A38` | Erosión cultural, símbolos perdidos |
| Erosión de mediaciones | `#4A5C30` | Instituciones vacías, partidos en ruina |
| Desrepresentación | `#8A4A55` | Política sin densidad, congreso fantasmal |
| Estetización | `#B45729` | Imagen sin anclaje, símbolo como mercancía |
| Desorientación | `#2D4A6B` | Pantallas, niebla, deformación de lo real |
| Atención | `#C8993E` | Algoritmo, multitudes mirando, captura visual |

### Reglas no negociables

- **Nunca** gris corporativo (`#888`, `#666`, etc.). La tinta es verde-negra `#1F2A12`.
- **Nunca** azul brillante saturado tipo Facebook / tech bro.
- **Nunca** fondos blancos `#FFFFFF`. Usar siempre crema `#F4E9D2` como mínimo.
- Máximo 4 colores en pantalla. Si necesitás un quinto, está mal compuesta.

---

## Estilo de ilustración

### Trazo

- **Línea negra-verde gruesa**, hecha a mano (no vector limpio).
- Variación de presión visible: en algunos puntos engrosa, en otros adelgaza.
- Contornos cerrados, no abstractos. Las figuras se reconocen.
- **Cross-hatching** (líneas tramadas cruzadas) para sombras y volúmenes. Nunca degradés digitales.

### Figuras

- **Caricaturescas**, no realistas, no infantiles tampoco.
- Cabezas un poco más grandes que el cuerpo (estilo viñeta política clásica).
- Gestos expresivos y exagerados: cejas, manos, boca. El rostro lleva la mitad del mensaje.
- Rasgos sudamericanos cuando aplique. **Diversidad real**, no estereotipos.
- Si se representa a un político real, **caricaturizarlo, no imitarlo fotográficamente**. La caricatura habilita la crítica; el realismo la convierte en propaganda o difamación.

### Composición

- **Una sola idea fuerte**: una escena, un personaje, un símbolo.
- Foco central o leve regla de tercios. Sin profundidad de campo cinematográfica.
- Borde duro: la escena puede tener un marco grueso de tinta verde-negra que la encierre, como las viñetas impresas.
- Composiciones planas (estilo grabado) preferibles a perspectiva fotográfica.

### Textura

- **Granulado de papel siempre visible**. Tipo papel reciclado de revista impresa.
- **Registro mal alineado**: en algunos puntos los colores se desplazan un par de píxeles fuera del contorno negro, como en imprenta cuando el rodillo no está calibrado. Eso es firma del sistema, no error.
- Manchas, salpicaduras, marcas de tinta toleradas y bienvenidas.

### Lo que NO va

- ❌ Render 3D, photoreal, IA-realismo brilloso.
- ❌ Estética "infografía moderna" con íconos planos vectoriales.
- ❌ Estilo Pixar, Disney, dibujo animado familiar.
- ❌ Glow, lens flare, bokeh, profundidad cinematográfica.
- ❌ Texto incrustado en la ilustración (el título va arriba en otra capa, no dentro del dibujo).
- ❌ Banderas o logos partidarios literales (usar formas abstractas o símbolos derivados).
- ❌ Tipografía manuscrita digital "amigable" tipo Comic Sans / Handwritten.
- ❌ Sonrisas plácidas. Los rostros tienen tensión.

---

## Formato técnico

- **Aspect ratio:** 3:2 horizontal (1500×1000 px sugerido) — formato de portada de Substack y de hero del sitio.
- **Resolución:** 1500×1000 mínimo, 3000×2000 ideal.
- **Sin texto incrustado** salvo que el prompt lo pida explícitamente (carteles dentro de la escena, pintadas en pared, titulares de diario figurados). El título de la pieza se overlay-ea aparte con Alfa Slab One.
- **Margen visual interno:** dejar 8–10% de aire en todos los bordes para que el overlay tipográfico no compita con figuras críticas.

---

## Referencias visuales (para fijar mentalmente la dirección)

- **Revista Humor** (Argentina, 1978–1999) — tapa de Cascioli, Fontanarrosa cuando dibujaba a Mafalda o a militares, Limura. **Esta es la referencia primaria.**
- **Taller de Gráfica Popular** (México, 1937–2010) — Méndez, Beltrán, los grabados anti-fascistas.
- **Antonio Berni** — *Juanito Laguna* y *Ramona Montiel* en plano editorial.
- **Sábat** (Hermenegildo, Argentina/Uruguay) — retratos políticos en *Clarín*, tinta, gestualidad.
- **Liniers** cuando sale del registro intimista y entra al político.
- **Quino** post-Mafalda, las viñetas sin diálogo.

**No referenciar:** ilustradores de The New Yorker estilo Christoph Niemann (demasiado pulcro), ilustración editorial estadounidense estilo Vox / The Atlantic (demasiado vectorial), street art tipo Banksy (demasiado pop-fashion).

---

## Instrucciones para Gemini

> *Pegá este bloque al final de cualquier `cover_prompt` cuando lo mandes al modelo.*

```
DIRECCIÓN DE ESTILO (obligatoria):

Ilustración política sudamericana, estilo viñeta caricaturesca, en el espíritu
de la Revista Humor argentina (1978-1999) y del Taller de Gráfica Popular
mexicano. Trazo a mano grueso, línea negra-verde con variación de presión.
Cross-hatching para sombras (nunca degradés). Figuras caricaturizadas con
gestos exagerados, rostros expresivos, rasgos sudamericanos diversos no
estereotipados.

PALETA (cerrada, máximo 4 colores):
- Terracota #C5663A (dominante)
- Tinta verde-negra #1F2A12 (trazo principal — usar en lugar de negro puro)
- Papel crema #F4E9D2 (alternativa de fondo)
- Acento: oro de marca #E8B14B O dorado pálido #E8C58A (elegir uno)

PROHIBIDO: gris corporativo, blanco puro, azul tech saturado, render 3D,
fotorrealismo, glow/bokeh/lens flare, estética Pixar, íconos planos vectoriales,
sonrisas plácidas, banderas o logos partidarios literales, texto incrustado
en la escena (salvo carteles diegéticos), tipografía manuscrita digital.

TEXTURA: granulado de papel impreso siempre visible, registro mal alineado
(los colores se desplazan un par de píxeles del contorno como en imprenta
descalibrada), manchas y salpicaduras toleradas. La materialidad de la
impresión es parte del estilo, no defecto.

COMPOSICIÓN: una sola idea fuerte, una figura o escena central, plano frontal
o tres cuartos, no perspectiva cinematográfica. Borde duro opcional como
viñeta enmarcada. Sin radius en ningún elemento.

FORMATO: 3:2 horizontal, 1500×1000 px mínimo. Sin texto incrustado salvo que
el prompt específico lo indique. Dejar 8-10% de margen visual interno.
```

---

## Sobre el campo `cover_prompt` en los borradores

El campo `cover_prompt` aparece en el frontmatter YAML de cada borrador y despacho. Tiene dos características importantes:

1. **Es un campo interno del flujo de borrador.** No se renderiza en el sitio público — el frontend (ver `platform/frontend/src/lib/content.ts`) lee solamente los campos declarados explícitamente (`title`, `country`, `eje_principal`, etc.). `cover_prompt` queda como metadata para vos, no para el lector.

2. **No viaja a la publicación final.** Cuando un borrador se promueve a `50-Publicaciones/` (ver Spec 24), la promoción debe stripear este campo o dejarlo solamente en la versión-borrador. La portada generada con el prompt **sí** queda asociada a la publicación, pero el prompt en sí mismo es un artefacto del proceso, no de la pieza final.

### Ejemplo de uso en frontmatter

```yaml
---
tipo: borrador-agente
country: Argentina
country_slug: ar
title: "La cena que reemplazó al partido"
slug: la-cena-que-reemplazo-al-partido
eje_principal: atencion
# ... otros campos ...
cover_prompt: |
  Una cena larga en penumbra, mesa de madera tallada, una decena de figuras
  jóvenes con remeras y celulares prendidos iluminando sus caras. En la
  cabecera, un personaje caricaturizado de pelo largo gesticula. Detrás, en
  la pared, una pintura colonial enmarcada de un prócer mirando hacia abajo
  con cara de espanto. Atmósfera de banquete íntimo y reservado.

  Eje a evocar: atención (la captura algorítmica del vínculo político).
  Tono: irónico, intimista, ligeramente claustrofóbico.

  Aplicá la guía completa de estilo: 70-Producto/design-system/cover-style-guide.md
  Guardar la imagen como: 90-Portadas/diario/la-cena-que-reemplazo-al-partido.png
---
```

El bloque incluye: (a) descripción visual concreta, (b) eje a evocar, (c) tono, (d) referencia explícita a esta guía, (e) **ruta de destino con el slug exacto del borrador** para que al descargar la imagen de Gemini se nombre directo, sin pasos manuales.

### Convención de la línea `Guardar la imagen como`

Es **meta-instrucción operativa** para vos, no para el modelo. El modelo de imagen va a ignorar esa línea porque no describe contenido visual. Sirve para que al copiar el bloque, mandar a Gemini y descargar el resultado, ya tengas el nombre exacto al alcance.

Mapeo de rutas según tipo de pieza:

| Skill / origen | Ruta de destino |
|---|---|
| `agente-diario` (borradores diarios) | `90-Portadas/diario/<slug>.png` |
| `analisis-semanal` (análisis de país) | `90-Portadas/publicaciones/<slug>.png` |
| `despacho-semanal` (despacho integrado) | `90-Portadas/despachos/despacho-semana-<N>-<año>.png` |

El `<slug>` es el campo `slug:` del frontmatter del borrador. Si no hay slug (caso del despacho), usar el patrón `despacho-semana-<N>-<año>`.

---

## Pregunta abierta

¿Cuándo una portada deja de ser ilustración de la pieza y empieza a ser argumento autónomo de Mapa Inestable? La hipótesis de trabajo es que cuando la portada sostiene una segunda lectura (irónica, en contradicción con el titular, en diálogo desplazado con la escena), el sistema visual está haciendo su trabajo. Si solamente "ilustra" el contenido, está perdiendo una capa.

> El sistema visual no responde la pregunta. La hace visible.
