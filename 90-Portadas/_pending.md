---
tipo: tracker
scope: portadas-borradores-diarios
arrancado: 2026-05-13
---

# Tracker · Portadas pendientes

Checklist de las portadas de borradores diarios. Se va tachando a medida que se generan, descargan y guardan en `90-Portadas/diario/`.

**Convención de nombre de archivo:** mismo `slug` del borrador + `.png`.

---

## Ya generadas (scope: borradores diarios) ✅

- [x] **Argentina** — *La cena que reemplazó al partido* — `la-cena-que-reemplazo-al-partido.png`
- [x] **Bolivia** — *La refundación entra en comisión* — `la-refundacion-entra-en-comision.png`
- [x] **Perú** — *La elección que no cabía en una sola hoja* — `la-eleccion-que-no-cabia-en-una-sola-hoja.png`
- [x] **Chile** — *Una manera de gobernar* — `una-manera-de-gobernar.png`
- [x] **Bolivia** — *El precio que ya no pasa por el banco* — `el-precio-que-ya-no-pasa-por-el-banco.png`
- [x] **Uruguay** — *La cubierta donde no se esperaba ver al Frente Amplio* — `la-cubierta-donde-no-se-esperaba-ver-al-frente-amplio.png`
- [x] **Paraguay** — *El honor que quería tener voto* — `el-honor-que-queria-tener-voto.png`
- [x] **Paraguay** — *El país convertido en activo* — `el-pais-convertido-en-activo.png`
- [x] **Ecuador** — *La excepción que ya no interrumpe* — `la-excepcion-que-ya-no-interrumpe.png`
- [x] **Venezuela** — *Esperar como forma de gobernar* — `esperar-como-forma-de-gobernar.png`
- [x] **Uruguay** — *El último país que aún conversa* — `el-ultimo-pais-que-aun-conversa.png`

**Scope inicial cerrado** — las 11 portadas del agente diario están en `90-Portadas/diario/`.

---

## Resumen

- **Total scope inicial:** 11 borradores diarios
- **Hechas:** 11
- **Pendientes:** 0

## Próximo paso: implementación en el sitio

Las imágenes ya viven en el vault pero el frontend todavía no las renderiza. Eso se trata en **[Spec 37 · Portadas en el sitio](../70-Producto/specs/37-portadas-en-el-sitio.md)** — define schema (campo `cover_image` en frontmatter), pipeline (`sync-covers.mjs`), componentes (`<CoverImage />` + `<CoverPlaceholder />`) e integración en thumbnails y heros.

## Próximos scopes (cuando se desbloquee Spec 37)

- **Publicaciones de Substack** (`50-Publicaciones/`, 13 piezas) — para renovar la galería del archivo histórico. Spec 37 r2.
- **Despachos semanales** (carpeta `90-Portadas/despachos/`, vacía) — cuando armes el primer despacho con el skill. Spec 37 r3.
- **Borradores manuales** (`60-Borradores/`, 12 piezas + plantilla) — descartado por ahora (no son vistas públicas del sitio).

## Notas operativas

- Si Gemini te descarga el archivo como `image.png` o similar, renombralo a `<slug>.png` antes de moverlo a la carpeta.
- En el SO, si tenés extensiones ocultas, al renombrar escribí el slug **sin** `.png` al final (el sistema agrega la extensión automáticamente). Eso evita el `.png.png` duplicado.
- Después de cada batch confirmado, este archivo se actualiza y se manda el siguiente.
