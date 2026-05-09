# Spec: Logo + Portada

**Estado:** pendiente  
**Nota:** hay dos archivos de logo en la raíz del vault (`logo mapa inestable 1.png`, `logo mapa inestable 2.png`) — revisar antes de implementar si alguno es el definitivo.

---

## 1. Concepto del logo

El logo es una **marca de combinación**: ícono + wordmark. Dos piezas que funcionan juntas o separadas.

**Ícono:** la silueta de Sudamérica invertida — sur arriba, norte abajo. Referencia directa a Torres García. SVG puro, masa sólida, un solo path. Sin rellenos internos.

**Wordmark:** `MAPA INESTABLE` en Bree Serif, uppercase, kerning apretado (`-0.03em`).

**Por qué este ícono:** el sitio cubre 10 países de Sudamérica, la inversión es la declaración epistemológica central del proyecto, y como forma es reconocible y funciona a cualquier tamaño.

---

## 2. Variaciones

| Variante | Uso |
|----------|-----|
| Principal | Ícono izquierda + wordmark derecha, tinta sobre paper |
| Invertido | Ícono + wordmark en cream sobre fondo oscuro o terracota |
| Solo ícono | Favicon, app icon, contextos < 32px |
| Solo wordmark | Cuando el ícono ya apareció cerca |

**Paleta:** solo tokens del sistema. Sin colores nuevos.
- Tinta: `--mi-ink` (#1F2A12)
- Sobre fondos oscuros: `--mi-bg-paper` (#F4E9D2)
- Acento opcional (solo en portada): `--mi-accent-gold` (#E8C58A) para el ícono

---

## 3. Componente `Logo.tsx`

Crear `src/components/Logo.tsx`:

```tsx
interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  color?: string;        // default: var(--mi-ink)
  size?: "sm" | "md" | "lg";
}
```

**Tamaños:**
- `sm` — header de navegación: ícono 28px de alto
- `md` — portada interior, breadcrumbs: 40px
- `lg` — portada principal: 64px

El SVG del ícono se dibuja como path de Sudamérica invertida (viewBox `0 0 100 160`). Sin dependencias externas.

---

## 4. Header

**Cambio:** `<Logo variant="full" size="sm" />` reemplaza el bloque de texto en `SiteHeader.tsx`.

El subtítulo "Cartografía política del sur · Año II" queda debajo del logo, en mono xs igual que hoy. El `<Link href="/">` envuelve todo el bloque.

**Diferencia visual:** el ícono de Sudamérica aparece a la izquierda del texto, 28px, tinta sólida. Le da identidad visual sin cambiar la estructura del header.

---

## 5. Portada — masthead

La portada actual no tiene momento de marca — salta directo al contenido. Agregar franja masthead entre la meta-bar y el hero.

**Estructura de `page.tsx`:**
```
[ meta-bar ]
[ masthead ]      ← nuevo
[ hero featured ]
[ grid semana ]
```

**Masthead:**
- Fondo: `--mi-bg` (terracota)
- Alto: 200px desktop / 160px mobile
- Layout: flex-column, centrado
- Contenido:
  1. `<Logo variant="icon" size="lg" color="var(--mi-bg-paper)" />` — Sudamérica invertida en cream, 64px, acento gold opcional
  2. Wordmark `MAPA INESTABLE` — Bree Serif ~72px, cream, uppercase
  3. Subtítulo — mono xs, tracking widest, gold
  4. Separador — `--mi-border-bold` en ink, ancho full del contenedor

Sin imagen de fondo. Solo tipografía y color — coherente con el estilo Grabado.

---

## 6. Favicon y meta

- `favicon.svg` — silueta sudamérica invertida en tinta, fondo terracota, 32×32
- `apple-touch-icon.png` — mismo, 180×180, exportado desde SVG
- `og:image` — wordmark completo sobre fondo terracota, 1200×630

Destino: `platform/frontend/public/`.

---

## 7. Orden de implementación

1. Evaluar los dos PNGs existentes en la raíz del vault — si alguno es el definitivo, vectorizarlo o usarlo como referencia para el path SVG
2. Dibujar el path SVG de Sudamérica invertida *(30-45 min — el paso más artesanal)*
3. Crear `Logo.tsx` con las tres variantes
4. Integrar en `SiteHeader.tsx`
5. Agregar masthead en `page.tsx`
6. Exportar favicon y apple-touch-icon
