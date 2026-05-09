# Spec 08 — Coherencia editorial pendiente

**Estado:** pendiente
**Prioridad:** baja-media — son polish, pero acumulados afectan la lectura
**Tipo:** decisiones editoriales + correcciones de detalle

---

## 1. Por qué

Esta spec agrupa decisiones de producto y correcciones de detalle que el sitio v1 actual deja abiertas. No son features nuevos: son **inconsistencias y deudas editoriales** detectadas al revisar la versión publicada en `mapa-inestable-v1.vercel.app`.

A diferencia de las specs 04-07 (que agregan páginas), acá se resuelven cosas que ya existen pero confunden o quedan ambiguas.

---

## 2. Decisiones editoriales pendientes

### 2.1. Año II — fecha de inicio explícita

**Problema.** El sitio dice "Año II · Semana 19" en el header y "Año II" en varios lugares, pero no declara cuándo arrancó el proyecto. Un visitante nuevo no puede ubicar temporalmente el contador.

**Opciones:**
- A. Declarar fecha de inicio en `/acerca` y nada más. El header sigue sin fecha. (Mínimo viable.)
- B. El header muestra la fecha además del contador: "Año II · Semana 19 · desde marzo 2024". (Explícito.)
- C. Eliminar el contador del header y dejarlo solo en despachos individuales y en `/acerca`. (Más limpio.)

**Recomendación:** **A**. La fecha de inicio es información referencial, no es lo primero que el lector necesita. Se declara en `/acerca`, en la sección "Año II".

**Acción:** sumar campo `ano_inicio` al modelo `About` (ya previsto en Spec 06).

---

### 2.2. "Buenos Aires · Bogotá · Santiago" — header dinámico vs. tagline fijo

**Problema.** El header de la home dice "Semana 19 · 2026 — Buenos Aires · Bogotá · Santiago" pero la semana cubre **4 países** (Argentina, Chile, Brasil, Bolivia). La leyenda sugiere 3 ciudades pero la grilla muestra 4. Inconsistencia leve pero confunde.

**Opciones:**
- A. Header dinámico: las ciudades se computan desde los países cubiertos en la semana actual. "BA · Bogotá · Santiago · Brasília · La Paz" se ajusta solo. Riesgo: queda largo cuando son 4-5 países.
- B. Header dinámico abreviado: solo iniciales o códigos ("AR · CL · BR · BO"). Más compacto pero pierde calidez.
- C. Tagline fijo: ciudades como gesto editorial constante (3 representativas), no como reflejo del contenido. Aceptás la inconsistencia como elección retórica.
- D. Eliminar las ciudades del header. El "Año II · Semana 19" alcanza.

**Recomendación:** **A**, dinámico. El sitio cubre Sudamérica, las ciudades **deben** reflejar lo que hay esa semana — si no, ¿para qué están? Si quedan largas, truncar a primeras 4 con "+ N más".

**Acción:** computar lista de ciudades desde `Analysis WHERE week = current_week`. Mapping `country_slug → ciudad capital`.

---

### 2.3. Relación con Substack

**Problema.** Substack sigue activo (`mapainestable.substack.com`). El sitio nuevo no menciona qué pasa con eso.

**Opciones:**
- A. Reemplazo total. Substack queda como archivo histórico con un aviso que redirige a `mapa-inestable-v1.vercel.app`. Todas las publicaciones nuevas van al sitio.
- B. Convivencia con cross-publishing. El despacho semanal se publica en ambos. Substack mantiene la lista de suscriptores.
- C. División de funciones. Análisis individuales y archivo en el sitio; Substack solo para el despacho semanal (que es lo que llega al inbox).

**Recomendación:** **C** — división de funciones. El sitio es el repositorio canónico, Substack es el canal de distribución por email. Esto aprovecha lo mejor de cada herramienta sin duplicar trabajo.

**Implicancias:**
- Cada despacho del sitio tiene un botón "Recibir por email" que conecta con el flujo de Substack.
- El bloque de cierre de cada despacho enlaza a Substack para suscripción.
- `/acerca` declara explícitamente esta relación.

**Acción:**
- Modelo `About` suma campo `substack_url`.
- Despacho público suma CTA "Recibir por email".
- Si en algún momento se reemplaza Substack por ConvertKit o equivalente, basta cambiar el campo en `About`.

---

### 2.4. Cantidad de análisis por semana — variable, sin explicación

**Observación.** Los despachos del archivo van con cantidades distintas: 47 → 3 análisis, 46 → 2, 45 → 4, 44 → 3. No es un bug, es decisión editorial: la semana define cuántos países movieron algo estructural. **Pero no está explicado**.

**Recomendación:** sumar a `/metodo` (Spec 06) una nota corta:

> "Cada despacho cubre los países que se movieron estructuralmente esa semana. La cantidad varía: 2 a 5 análisis es lo común. No forzamos cobertura para llenar — si una semana en un país no hay desplazamiento, no hay análisis."

**Acción:** texto agregado a la sección "Por qué así" de `/metodo`.

---

### 2.5. Ensayos — sección listada pero ¿con qué?

**Observación.** El menú expone `/ensayos` pero no fui capaz de verificar qué hay ahí. Conviene confirmar:

**Opciones:**
- A. Hay ensayos publicados → todo bien.
- B. La sección está vacía → mostrar página "Próximamente" con explicación del registro (ensayos de mayor profundidad sobre un eje a fondo) en lugar de página rota.
- C. Eliminar la sección del menú hasta tener al menos 1 ensayo.

**Recomendación:** **B** si no hay ensayos todavía, **A** si los hay. Nunca **C** — un menú con `/ensayos` declara la intención, sacarlo retrocede.

**Acción:** verificar estado y resolver según corresponda.

---

## 3. Inconsistencias menores de detalle

### 3.1. Footer "Países" sin enlace al índice de archivo filtrado

**Problema.** El footer lista los 10 países como links a `/pais/[slug]`. Está bien, pero no hay un acceso al **archivo** desde ahí. Si Spec 05 se implementa, el footer puede ofrecer también "Ver archivo de [país]" o un meta-link a `/analisis?pais=...`.

**Acción:** post Spec 05, sumar al footer un link "Archivo completo" que vaya a `/analisis`.

### 3.2. Subtítulo del sitio

**Observación.** Hoy: "Cartografía política del sur · Año II". La parte "Año II" mezcla identidad con contador temporal. Si Año II queda solo en `/acerca` (decisión 2.1), el subtítulo del sitio queda **"Cartografía política del sur"** — más limpio, atemporal.

**Acción:** quitar "· Año II" del subtítulo del header. Mantenerlo en meta-bar de cada despacho y en `/acerca`.

### 3.3. Footer "Sur arriba — siempre"

**Observación.** Funciona muy bien como gesto de cierre. Mantener.

### 3.4. Meta-tags y OG

**Observación.** Las meta-tags actuales repiten el mismo título y descripción genéricos en todas las páginas. Cada página debería tener su propio `<title>`, `og:title`, `og:description` específicos.

**Acción:**
- Análisis individual: title = "[Título] — Mapa Inestable", description = lede.
- Despacho: title = "Despacho Nº [N] — Mapa Inestable".
- Página de país: title = "[País] — Mapa Inestable", description = perfil estructural truncado.
- Página de eje: title = "[Eje] — Mapa Inestable".

Esto mejora SEO y, sobre todo, **la experiencia de compartir links** en redes y mensajería.

### 3.5. Imagen de OG (Open Graph)

**Observación.** No verifiqué si hay imagen OG configurada. Si no la hay, cualquier link compartido sale sin preview visual.

**Acción:** definir imagen OG por defecto (probablemente el wordmark sobre terracota, definido en Spec 03 sección 6) y, opcionalmente, imágenes generadas por análisis con título + país + eje sobre la paleta Grabado.

---

## 4. Tabla resumen de acciones

| # | Acción | Spec relacionada | Tamaño |
|---|--------|------------------|--------|
| 1 | Declarar fecha de inicio en `/acerca` (campo `ano_inicio`) | Spec 06 | XS |
| 2 | Header dinámico de ciudades según países cubiertos en la semana | — | S |
| 3 | Definir relación con Substack (división de funciones) | Spec 06 (campo `substack_url`) | S |
| 4 | Agregar nota sobre cantidad variable de análisis a `/metodo` | Spec 06 | XS |
| 5 | Confirmar estado de `/ensayos` y armar fallback "Próximamente" | — | XS |
| 6 | Footer: link a archivo completo (post Spec 05) | Spec 05 | XS |
| 7 | Quitar "· Año II" del subtítulo del header | — | XS |
| 8 | Meta-tags + OG por página (analítico, despacho, país, eje) | — | M |
| 9 | Imagen OG por defecto (wordmark terracota) | Spec 03 | S |

Total estimado: ~1-2 días de trabajo si se hace de una sola pasada.

---

## 5. Orden sugerido

```
Día 1  ► Decisiones de producto resueltas (no requieren código)
         - Tomás define fecha de inicio Año II
         - Tomás define relación con Substack
         - Tomás revisa estado de /ensayos
         - Tomás revisa decisión 2.2 (header dinámico vs. fijo)

Día 2  ► Implementación
         - Header dinámico de ciudades
         - Subtítulo limpio ("Cartografía política del sur")
         - Meta-tags y OG por página
         - Imagen OG por defecto
         - Notas pedagógicas en /metodo y /acerca con las decisiones tomadas
```

---

## 6. Criterios de aceptación

- [ ] El proyecto declara explícitamente desde cuándo cuenta el tiempo (Año II → fecha en `/acerca`).
- [ ] El header de ciudades refleja los países cubiertos esa semana, no una tagline fija.
- [ ] La relación con Substack está documentada en `/acerca` y se ofrece "Recibir por email" donde corresponde.
- [ ] `/metodo` explica por qué la cantidad de análisis varía semana a semana.
- [ ] `/ensayos` no rompe (página real o "próximamente" con sentido).
- [ ] Cada página del sitio tiene title y descripción específicos.
- [ ] Compartir un link en WhatsApp / X muestra preview correcto con título + descripción + imagen OG.
