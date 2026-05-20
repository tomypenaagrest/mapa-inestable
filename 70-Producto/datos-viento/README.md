# datos-viento — Coding editorial de la capa viento

Sistema de coding editorial para la **capa viento** del Mapa Inestable (EPIC 03). Codifica la orientación político-económica de cada país sudamericano en escala **-3 (muy pro-estado) a +3 (muy pro-mercado)**.

Ver spec completa: `70-Producto/specs/41-pipeline-datos-politicos-viento.md`

---

## Estructura

```
datos-viento/
├── _compilado/
│   ├── viento.json              ← JSON compilado (OUTPUT — no editar a mano)
│   └── _log-YYYY-W##.md         ← log de cada corrida del build
├── ar/
│   ├── 2026-W18.md
│   └── 2026-W19.md
├── bo/
├── br/
├── cl/
├── co/
├── ec/
├── pe/
├── py/
├── uy/
└── ve/
```

- Una carpeta por país (slug de 2 letras).
- Un archivo `.md` por semana en cada carpeta.
- `_compilado/viento.json` es el output del pipeline — **no se edita a mano**.

---

## Escala numérica -3 a +3

| Rank | Label | Descripción |
|------|-------|-------------|
| **-3** | muy pro-estado | Cambios estructurales fuertes: estatizaciones, controles de precio, expansión fiscal |
| **-2** | pro-estado | Cambios moderados: programas sociales, regulaciones sectoriales, aumento de gasto |
| **-1** | leve pro-estado | Señales suaves: anuncios menores, declaraciones sin acciones materiales |
| **0** | neutro / sin cambio | No hubo cambios materiales, o los cambios se compensan |
| **+1** | leve pro-mercado | Señales suaves: anuncios menores, declaraciones sin acciones materiales |
| **+2** | pro-mercado | Cambios moderados: desregulación, recortes de gasto, ajustes fiscales |
| **+3** | muy pro-mercado | Cambios estructurales fuertes: privatizaciones, desregulación masiva, ortodoxia FMI |

**La escala mide dirección del cambio en la semana, no posicionamiento absoluto.**
Un gobierno fuertemente pro-mercado con una semana sin novedades tiene rank 0, no +3.

---

## Schema de cada archivo de coding

```yaml
---
country_slug: ar             # slug de 2 letras (debe coincidir con la carpeta)
country_name: Argentina
year: 2026
week: 20                     # número ISO de semana (sin padding en el valor)
fecha_coding: 2026-05-16     # YYYY-MM-DD
codificador: tomas
rank: 1                      # entero -3..+3 (REQUERIDO)
direccion: pro-mercado       # derivado de rank — pro-estado|neutro|pro-mercado
intensidad: 0.6              # opcional 0-1: qué tan decisiva fue la semana
estado: borrador             # borrador | publicada (solo publicadas entran al JSON)

# Reservados para Spec 41B (algoritmo híbrido — no usar en r1):
# algorithmic_baseline:
#   rank: null
#   generated_at: null
#   source_signals: []
# override_reason: null
---

# Justificativo

[Obligatorio: 1-3 frases que explican el rank. Si no hubo cambios respecto a la semana anterior, decirlo explícitamente.]

# Eventos clave de la semana

- [Evento 1 con fuente] [tendencia: ↑ pro-mercado | ↓ pro-estado | → neutro]
- [Evento 2]

# Coding previo (contexto)

- Semana X: rank Y — [resumen del justificativo]
- Semana X-1: rank Y — [resumen]
- Semana X-2: rank Y — [resumen]
```

**Nombre del archivo:** `YYYY-W##.md` — año ISO + semana ISO con 2 dígitos, ej. `2026-W20.md`.

---

## Cómo codificar

1. Activar el skill `coding-viento` en Cowork: "codifiquemos viento" o "codificá [país]".
2. El skill crea el borrador con el rank de la semana anterior como tentativo.
3. Completar justificativo + confirmar/ajustar rank.
4. Decirle al skill "publicalo" → cambia `estado: publicada`.
5. El skill dispara el build automáticamente (o esperarlo a las 19:00 ART del viernes).

**Regla de oro:** el `estado: borrador` nunca entra al JSON. Solo `estado: publicada` es visible en el sitio.

---

## Cómo correr el pipeline manualmente

```bash
# Desde la raíz del repo
node platform/data/coding-viento/build_viento.mjs

# Dry run (no escribe archivos)
node platform/data/coding-viento/build_viento.mjs --dry-run
```

El script:
1. Lee todos los `*.md` con `estado: publicada` de las 10 carpetas de países.
2. Valida: `rank` ∈ {-3..+3}, `intensidad` ∈ [0,1], campos obligatorios presentes.
3. Genera `_compilado/viento.json` (fuente canónica).
4. Copia a `platform/frontend/src/data/coding-viento/viento.json` (para el frontend).
5. Escribe `_compilado/_log-YYYY-W##.md` con resumen de la corrida.

---

## Países cubiertos

| Slug | País |
|------|------|
| ar | Argentina |
| bo | Bolivia |
| br | Brasil |
| cl | Chile |
| co | Colombia |
| ec | Ecuador |
| pe | Perú |
| py | Paraguay |
| uy | Uruguay |
| ve | Venezuela |
