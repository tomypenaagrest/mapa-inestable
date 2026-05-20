# coding-viento — Pipeline de datos políticos para capa viento

Script Node.js que compila el JSON de coding viento desde los `.md` editoriales del vault.

Ver spec completa: `70-Producto/specs/41-pipeline-datos-politicos-viento.md`

---

## Uso

```bash
# Desde la raíz del repo
node platform/data/coding-viento/build_viento.mjs

# Dry run (no escribe archivos)
node platform/data/coding-viento/build_viento.mjs --dry-run
```

---

## Qué hace `build_viento.mjs`

1. Recorre `70-Producto/datos-viento/<slug>/*.md` para los 10 países.
2. Filtra solo archivos con `estado: publicada` (ignora `estado: borrador`).
3. Parsea frontmatter con `gray-matter`.
4. Valida:
   - `rank` ∈ {-3, -2, -1, 0, 1, 2, 3} — **bloquea** si inválido
   - `intensidad` ∈ [0, 1] si presente — warning si fuera de rango
   - `country_slug` coincide con la carpeta padre — **bloquea** si no coincide
   - `week` coincide con el nombre del archivo — **bloquea** si no coincide
   - Secciones `# Justificativo` y `# Eventos clave de la semana` presentes — warning si ausentes
5. Construye el objeto `VientoData` (ver tipos en `platform/frontend/src/lib/viento.ts`).
6. Serializa a `70-Producto/datos-viento/_compilado/viento.json` (fuente canónica del vault).
7. Copia a `platform/frontend/src/data/coding-viento/viento.json` (para el frontend Next.js).
8. Escribe log de corrida en `70-Producto/datos-viento/_compilado/_log-YYYY-W##.md`.

---

## Dependencias

- `gray-matter` (disponible en `node_modules/` de la raíz del repo)
- Node.js ≥ 18 (para ESM nativo y `node:fs`, `node:path`)

---

## Frecuencia

- **On-publish**: el skill `coding-viento` dispara el build cada vez que un `.md` pasa de `borrador` a `publicada`.
- **Scheduled**: viernes 19:00 ART como red de seguridad (scheduled task de Cowork).
- **Manual**: cuando se corrige un coding pasado o se necesita regenerar el JSON.

---

## Salida

Dos archivos JSON idénticos (fuente canónica en vault + copia para frontend):

```json
{
  "version": "viento-v1.0.0",
  "computed_at": "2026-05-20T22:00:00.000Z",
  "range": {
    "start_week": { "year": 2026, "week": 18 },
    "end_week":   { "year": 2026, "week": 20 }
  },
  "by_country": {
    "ar": {
      "name": "Argentina",
      "series_semanal": [
        {
          "year": 2026,
          "week": 18,
          "rank": 3,
          "direccion": "pro-mercado",
          "intensidad": 0.85,
          "justificativo": "...",
          "eventos": ["..."],
          "codificador": "tomas",
          "fecha_coding": "2026-05-01"
        }
      ],
      "latest": { /* última semana publicada */ }
    }
  }
}
```

La capa viento (Spec 44) consume este JSON a través de `platform/frontend/src/lib/viento.ts`.
