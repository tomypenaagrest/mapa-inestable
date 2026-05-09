# Spec: Mobile Responsive

**Estado:** pendiente  
**Breakpoint único:** `@media (max-width: 640px)`

---

## 1. Tokens responsivos

En el breakpoint mobile, redefinir estas variables en `globals.css`:

```css
@media (max-width: 640px) {
  :root {
    --mi-space-6: 20px;
    --mi-space-7: 48px;
    --mi-space-8: 64px;
    --mi-text-display: 64px;
    --mi-text-4xl:    36px;
    --mi-text-3xl:    28px;
    --mi-shadow-card:      4px 4px 0 var(--mi-ink);
    --mi-shadow-card-lift: 6px 6px 0 var(--mi-ink);
    --mi-shadow-hero:      6px 6px 0 var(--mi-ink);
  }
}
```

---

## 2. Header / Nav

El header pasa de flex-row a flex-column. La nav scrollea horizontalmente si no entra.

```css
@media (max-width: 640px) {
  header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: var(--mi-space-3) !important;
    padding: var(--mi-space-4) var(--mi-space-6) !important;
  }

  header nav ul {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap !important;
    padding-bottom: 4px;
  }
}
```

No se necesita hamburger — es un sitio editorial, no una app.

---

## 3. Contenedores

Los `.mi-container` usan `padding-inline: var(--mi-space-6)` que en mobile queda en 20px gracias al token redefinido. Sin cambios adicionales.

---

## 4. Página de país (`/pais/[slug]`)

**Grid principal** `1fr 340px` → columna única. Sidebar va debajo del contenido.  
Requiere mover el `gridTemplateColumns` de inline style a clase CSS.

```css
@media (max-width: 640px) {
  .pais-content-grid {
    grid-template-columns: 1fr !important;
  }
  .pais-sidebar {
    order: 2;
  }
}
```

**Hero** `1fr auto` → columna única. El contador de análisis pasa a texto alineado a la izquierda.

```css
@media (max-width: 640px) {
  .pais-hero-grid {
    grid-template-columns: 1fr !important;
  }
  .pais-hero-meta {
    text-align: left !important;
  }
}
```

---

## 5. Tablas en prosa (`.mi-prose table`)

Las tablas de las fichas de país tienen 3-4 columnas y se salen del viewport.

```css
@media (max-width: 640px) {
  .mi-prose table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
}
```

---

## 6. Página de ensayo (`/ensayos/[slug]`)

Layout de columna única — funciona bien sin cambios. Solo ajustar el título:

```css
@media (max-width: 640px) {
  .ensayo-title {
    max-width: 100% !important;
    font-size: var(--mi-text-4xl) !important;
  }
}
```

---

## 7. Detalles colapsables (`.mi-details`)

Funcionan bien en mobile — el tap area del `<summary>` es suficientemente grande. Sin cambios.

---

## Implementación

Todo el CSS nuevo va en un bloque al final de `globals.css`. Las clases nuevas (`pais-content-grid`, `pais-hero-grid`, etc.) se agregan a los elementos en los `.tsx` via `className`. Los inline styles que bloquean el responsive se mueven a CSS.

**Orden de trabajo:**
1. Tokens + header — 30 min, visible en todo el sitio
2. Grids de `/pais/[slug]` — 45 min, la página más compleja
3. Tablas en prosa — 10 min
4. Ajustes de tipografía finos — 15 min

**No necesitás tocar:** ensayos individuales, detalles colapsables, meta-bars, pills de ejes.
