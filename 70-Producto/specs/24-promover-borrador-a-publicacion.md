---
spec: 24
titulo: Promover borrador del agente a publicación de Substack
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-10
afecta: [50-Publicaciones/, 60-Borradores/diario/, scripts del proyecto, posiblemente plugin de Cowork]
depende_de: [Spec 23 (frontmatter en agente diario)]
relaciona_con: [Spec 25 (pipeline visible)]
prioridad: media
---

# 24 · Promover borrador del agente a publicación de Substack

## Resumen ejecutivo

El proyecto tiene dos carpetas de contenido en el vault:

- `60-Borradores/diario/` — outputs del agente automatizado, no publicados
- `50-Publicaciones/` — fichas de las publicaciones reales del Substack (URL, fecha, lede, tesis, ejes activados, citas reusables)

Hoy el camino entre las dos es completamente manual: si Tomás decide publicar un borrador, tiene que abrirlo, copiarlo a Substack, esperar la URL, crear un .md nuevo en `50-Publicaciones/`, completar el frontmatter, escribir las "notas de contenido", citas reusables, etc.

Esta spec define un **comando que automatiza ese pasaje** preservando la estructura exacta de las publicaciones existentes en `50-Publicaciones/` y dejando el borrador del agente marcado como "promovido a publicación".

**No automatiza la publicación en Substack** — esa sigue siendo manual (login, copiar/pegar, programar). Sí automatiza la transición vault → registro de publicación.

---

## Estado actual

### Estructura de un .md en 50-Publicaciones/

Ver cualquier archivo de 50-Publicaciones (por ej. `Reforma laboral en Colombia.md`). El frontmatter incluye:

```yaml
---
tags: [publicación]
tipo: publicación
estado: publicada
ejes: [[03 - Desrepresentación]]
fecha: 2025-06-01
url: https://mapainestable.substack.com/p/reforma-laboral-en-colombia
título-completo: "Reforma laboral en Colombia: Debate del siglo XXI, soluciones del siglo XX"
---
```

Y el cuerpo tiene secciones canónicas:
- Tesis principal (1 frase)
- Ejes activados (links a 10-Ejes/)
- Disparadores (links a 40-Disparadores/)
- Autores citados (links a 30-Autores/)
- Notas de contenido (1-2 frases por sección del texto)
- Preguntas que dejó abiertas
- Citas que pueden reaparecer
- Noticias de la semana incluidas (si es despacho)
- Diálogos posibles con otras publicaciones

### Estructura de un .md en 60-Borradores/diario/

Después de Spec 23: frontmatter con `eje_principal`, `ejes`, `lede`, `disparador.url`, etc. Cuerpo: el texto narrativo del agente con secciones `## ...`, sin las secciones canónicas de Publicaciones.

---

## Propuesta

### Comando

Comando ejecutado desde Claude Code (script `npm run promote-draft` o equivalente):

```bash
node scripts/promote-draft.mjs \
  --draft "60-Borradores/diario/Argentina - La cena que reemplazó al partido - 2026-05-10.md" \
  --substack-url "https://mapainestable.substack.com/p/la-cena-que-reemplazo-al-partido"
```

O versión interactiva (mejor): `npm run promote-draft` → menú con borradores no promovidos → input de URL.

### Qué hace el comando

1. **Lee** el borrador del agente y su frontmatter.
2. **Crea** un nuevo archivo en `50-Publicaciones/<Título>.md` con:
   - Frontmatter `tipo: publicación`, `estado: publicada`, `fecha: <fecha del frontmatter>`, `url: <substack-url>`, `ejes: [[NN - <Eje principal>]]`, `subtítulo: <lede>`.
   - Las secciones canónicas listadas arriba, con placeholders inteligentes:
     - "Tesis principal" infiere de la lede (Tomás puede editar después).
     - "Ejes activados" usa `eje_principal` y `ejes` del frontmatter.
     - "Disparadores" usa `disparador.url` si existe.
     - "Notas de contenido" extrae los `## headings` del cuerpo del borrador.
     - "Citas que pueden reaparecer" deja un placeholder vacío.
3. **Marca** el borrador del agente como promovido: actualiza el frontmatter del .md original a `estado: promovido` y agrega `published_url: <substack-url>`. **No borra** el archivo — queda como registro auditable.
4. **Imprime** un resumen de lo creado y abre el editor en el archivo nuevo.

### Validaciones del comando

- ❌ Falla si el borrador no existe.
- ❌ Falla si el borrador ya está marcado `estado: promovido`.
- ❌ Falla si la `--substack-url` no matchea regex `https://mapainestable\.substack\.com/p/.+`.
- ⚠️ Warn si el frontmatter del borrador no es válido (Spec 23): igual procede pero avisa que algunos placeholders van a estar vacíos.
- ⚠️ Warn si ya existe un archivo en `50-Publicaciones/` con ese título: ofrece sobrescribir o cancelar.

### Actualización del MOC

Después de crear el archivo nuevo, **agregar una línea** a `50-Publicaciones/Publicaciones - MOC.md` en la tabla cronológica. El comando lo hace automáticamente: parsea la tabla, agrega la fila ordenada por fecha, regenera la tabla.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `scripts/promote-draft.mjs` (nuevo) | Implementación del comando. Node + gray-matter |
| `package.json` (raíz del repo o `platform/frontend/`) | Agregar `scripts.promote-draft`, dep gray-matter |
| `60-Borradores/diario/<archivo promovido>.md` | Frontmatter actualizado (`estado: promovido`, `published_url`) |
| `50-Publicaciones/<Título>.md` (nuevo) | Generado por el comando |
| `50-Publicaciones/Publicaciones - MOC.md` | Línea agregada a la tabla |

---

## Criterios de aceptación

1. ✅ El comando se ejecuta con `npm run promote-draft` desde la raíz.
2. ✅ El menú interactivo lista solo los borradores con `estado: borrador` (no los `promovido`).
3. ✅ Al promover, el .md nuevo cumple las convenciones de `50-Publicaciones/`: frontmatter, secciones canónicas, links a ejes/disparadores correctos.
4. ✅ El borrador original queda marcado `estado: promovido` y con `published_url`.
5. ✅ El MOC se actualiza con la línea nueva en orden cronológico.
6. ✅ Re-correr el comando sobre un borrador ya promovido falla con mensaje claro.
7. ✅ Si la URL no es de mapainestable.substack.com, falla con mensaje claro.
8. ✅ El sitio (`/analisis/borradores`) ya no muestra el borrador promovido (porque su `estado` cambió).

---

## Edge cases

- **Borrador con eje_principal sin contraparte en `10-Ejes/`** — el placeholder de "Ejes activados" pone `[[ENN - <Eje principal>]]` sin numerar. Tomás lo corrige al editar.
- **Borrador sin disparador en frontmatter** — la sección "Disparadores" arranca vacía con un comentario `<!-- TODO: agregar disparador -->`.
- **Substack devuelve URL distinta a la esperada** (ej. con query params) — el comando normaliza a `/p/<slug>` quitando `?` y `#`.
- **Múltiples borradores con el mismo título** — improbable pero el comando detecta colisiones y pide confirmación.

---

## No incluido en esta spec (futuro)

- Postear automáticamente a Substack (requiere su API o automation con Claude in Chrome).
- Detectar publicaciones nuevas en Substack y matchear con borradores promovidos (validación inversa).
- Generar un changelog de "promociones" semanal.

Estos quedan para iteraciones siguientes.

---

## Implementación sugerida

1. Crear el script base con menú interactivo y dry-run.
2. Validar contra los 8 borradores actuales que el output sería consistente con las publicaciones reales que ya tenés (sin escribir nada).
3. Activar la escritura, promover un borrador real, verificar.
4. Agregar el comando al MOC o a la documentación interna del proyecto.
