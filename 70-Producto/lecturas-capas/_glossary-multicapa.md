---
spec: 47
titulo: Glosario de términos — lectura cruzada multi-capa
fecha: 2026-05-26
estado: activo
---

# Glosario de términos — lectura cruzada

Extensión del glosario de Spec 46 para los términos introducidos por Spec 47 (tooltip enriquecido e interacción multi-capa).

---

## Capa activa

La capa actualmente seleccionada en el `LayerController` del rail izquierdo. Pinta el mapa con su paleta de colores y es la referencia principal de lectura en el tooltip y el drawer.

---

## Capa no-activa

Una de las restantes capas del sistema que no está pintando el mapa en este momento. Aparece como chip en el snapshot cruzado del tooltip, el bloque "Otras capas" del drawer y el panel pineado de la leyenda.

---

## Snapshot cruzado

Objeto con los últimos valores de todas las capas para un país y una fecha del slider. Se calcula una sola vez por par (país, fecha) y se reutiliza en tooltip, drawer y panel pineado. Permite leer el perfil climático completo de un país sin cambiar de capa.

---

## Chip cruzado

Una fila del bloque "Otras capas" en el tooltip, el drawer o el panel pineado. Cada chip muestra el mini-glyph de la capa, el label corto, el período de referencia, el valor formateado y un indicador de delta o calidad.

---

## País pineado

País elegido por el lector mediante el botón "📌 Pinear lectura de este país" en el tooltip. Su snapshot cruzado persiste en un panel debajo de la leyenda flotante y se actualiza automáticamente cuando el slider cambia. Solo un país puede estar pineado a la vez. Se despinea con el botón "× Despinear" o al cerrar el navegador.

---

## Lectura cruzada

El acto de leer todas las capas para un país en simultáneo, sin cambiar la capa activa del mapa. El tooltip enriquecido, el bloque "Otras capas" del drawer y el panel pineado habilitan este modelo de lectura.

---

## Mini-glyph orientado V3 (viento)

Versión reducida (18–20px) del glyph de viento. Cuando viento es una capa no-activa, el chip cruzado muestra este glyph en lugar de una flecha de delta: apunta a la derecha para pro-mercado, espejado a la izquierda para pro-estado, variante "neutro" cuando el rank es 0. La asimetría del glyph carga la dirección sin necesidad de texto adicional.
