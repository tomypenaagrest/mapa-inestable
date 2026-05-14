---
bug: BUG-005
titulo: Contenido del vault no llega a Vercel — src/content/ está en .gitignore
estado: resuelto
detectado_por: Tomás
fecha_deteccion: 2026-05-13
fecha_resolucion: 2026-05-13
severidad: crítica (bloquea producción)
afecta:
  - .gitignore (raíz del repo)
  - platform/frontend/src/content/ (debía estar en git, estaba ignorado)
  - https://mapa-inestable-v1.vercel.app/ (todo el sitio en prod)
relaciona_con: [Spec 26 (cargar publicaciones del vault al sitio), Spec 32 (vista pública borradores diarios), BUG-004 (copy-content no recursa subcarpetas)]
---

# BUG-005 · Contenido del vault no llega a Vercel — `src/content/` está en `.gitignore`

## Síntoma

En https://mapa-inestable-v1.vercel.app/ los borradores diarios del agente **no aparecen** en `/analisis/borradores`. El listado queda vacío aunque hay 11 archivos `.md` en el vault local. Re-ejecutar el flujo de Spec 32 no soluciona el problema porque el bug no está en el código de la app sino en cómo se construye el deploy.

## Causa raíz

El `.gitignore` raíz del repo contenía la línea:

```
platform/frontend/src/content/
```

Esa línea ignora **toda la carpeta de contenido que el frontend lee en producción**. El flujo previsto era:

1. En dev: `platform/frontend/src/lib/content.ts` resuelve `VAULT_ROOT = path.join(process.cwd(), "..", "..")`, lee directo del vault de Obsidian. Funciona.
2. En prod: `VAULT_ROOT = path.join(process.cwd(), "src", "content")`. La idea era que el script `prebuild` (`scripts/copy-content.js`) copiara el vault a `src/content/` antes del build.

Lo que pasa en Vercel:

1. Vercel clona el repo de git → **sin `src/content/`** porque está en `.gitignore`.
2. Vercel corre `npm install` → OK.
3. Vercel corre `prebuild` → `node scripts/copy-content.js`.
4. El script busca el vault en `path.join(__dirname, "..", "..", "..")` que en Vercel resuelve a una carpeta fuera del repo del frontend.
5. **El vault no existe en Vercel** (es el OneDrive de Tomás en su PC).
6. El script imprime `[copy-content] No encontrado: ...` para cada carpeta esperada, pero **no falla** (no hace `process.exit(1)`).
7. El build de Next continúa con `src/content/` vacío.
8. `getAllAgentDrafts()` devuelve `[]`.
9. El sitio publica un listado vacío.

### Evidencia que confirma el diagnóstico

```bash
# Antes del fix:
cd platform/frontend
git ls-files src/content/ | wc -l  # → 0 (nada commiteado)
ls src/content/60-Borradores/diario/*.md | wc -l  # → 11 (existe en local)
grep "src/content" ../../.gitignore  # → platform/frontend/src/content/ (ignorado)
```

Para confirmar el patrón en otra carpeta que **sí funciona** (Spec 37):

```bash
git ls-files public/covers/ | wc -l  # → 11 (sí commiteado)
grep "public/covers" ../../.gitignore  # → vacío (no ignorado)
```

Las portadas de Spec 37 sí estaban commiteadas porque `public/covers/` nunca entró al `.gitignore`. Eso prueba que el patrón correcto es tener los assets del deploy commiteados en git.

## Resolución

1. **Sacar `platform/frontend/src/content/` del `.gitignore` raíz** y dejar un comentario explicativo:

```
# NOTA: platform/frontend/src/content/ NO se ignora.
# El script `npm run prebuild` (copy-content.js) lo regenera desde el vault
# antes de cada build local, pero ese script NO funciona en Vercel porque
# el vault no es accesible. Por eso src/content/ tiene que vivir en git
# para que Vercel tenga los .md disponibles en el deploy.
```

2. **Regenerar `src/content/` con el script** para tener la versión más reciente del vault:

```bash
cd platform/frontend
node scripts/copy-content.js
```

Output esperado:
```
[copy-content] Copiado 15-Países -> src/content/15-Países (21 archivos)
[copy-content] Copiado 60-Borradores -> src/content/60-Borradores (36 archivos)
[copy-content] Copiado 30-Autores -> src/content/30-Autores (15 archivos)
[copy-content] Copiado 35-Conceptos-clave -> src/content/35-Conceptos-clave (16 archivos)
[copy-content] Copiado 50-Publicaciones -> src/content/50-Publicaciones (14 archivos)
```

3. **Commitear y pushear** desde la raíz del repo:

```bash
git add .gitignore
git add platform/frontend/src/content/
git commit -m "fix: src/content/ debe vivir en git para que Vercel deploye con el corpus (BUG-005)"
git push
```

4. Vercel autodeploya y los borradores aparecen.

## Workflow editorial después del fix

A partir de ahora, cuando el agente diario genera un borrador nuevo (o cuando se modifica/promueve manualmente cualquier .md del vault), el flujo para que llegue a producción es:

```
1. Cambio en el vault (.md nuevo / modificado en 50-Publicaciones, 60-Borradores, etc.).
2. (Local) cd platform/frontend && npm run prebuild
   → copy-content.js + sync-covers.mjs corren y actualizan src/content/ y public/covers/
3. (Local) git add platform/frontend/src/content/ platform/frontend/public/covers/
4. git commit -m "content: ..." && git push
5. Vercel autodeploya.
```

Esto puede automatizarse con un git hook (`pre-commit` que corra `npm run prebuild`) o con un GitHub Action que sincronice periódicamente. Por ahora queda **manual** después de cada cambio editorial.

## Riesgos remanentes

- **Tamaño del repo:** ahora todos los `.md` del vault (que viven en `50-Publicaciones`, `60-Borradores`, `15-Países`, etc.) están duplicados en git. Con un corpus de ~100 piezas son ~1 MB acumulados, aceptable. Reconsiderar si pasa de 20 MB de markdown.
- **Sincronización olvidada:** si Tomás genera un borrador con el agente diario y se olvida de correr `npm run prebuild + commit + push`, el sitio queda desactualizado. Mitigación: documentar este workflow en CLAUDE.md y en la guía del agente.
- **Conflictos de merge:** dos commits que toquen el mismo `.md` van a chocar. Probabilidad baja porque el vault tiene un solo autor.

## Notas para futuras specs

La Spec 26 (cargar publicaciones del vault al sitio) y la Spec 32 (vista pública de borradores diarios) **asumían implícitamente** que `src/content/` estaba en git. Ninguna de las dos lo dejó explícito. Este bug habría sido evitable si las specs hubieran tenido un criterio de aceptación que verificara el deploy de Vercel, no solo el funcionamiento local. **Próximas specs que toquen contenido del vault → frontend deben incluir explícitamente "verificado en deploy de Vercel, no solo en `npm run dev`"**.

Spec 37 (portadas en el sitio) ya recogió esta lección: el riesgo del deploy de Vercel está documentado en §7 (Riesgos y consideraciones · "Vercel y la prebuild").
