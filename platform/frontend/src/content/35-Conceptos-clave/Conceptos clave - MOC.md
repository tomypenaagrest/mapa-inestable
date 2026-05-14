---
tags: [moc, conceptos]
tipo: MOC
---

# Conceptos clave — MOC

Repositorio de conceptos teóricos transversales que cruzan varios autores o son candidatos a eje del sistema Mapa Inestable.

## Regla de inclusión

Un concepto entra acá solo si cumple uno de estos criterios:

- Es **transversal** entre 2 o más autores (ej: hegemonía atraviesa Gramsci-Arrighi-Mann).
- Es **candidato a eje** del sistema (pendiente de decisión editorial).
- Es **eje adoptado** y conviene mantener su versión "concepto teórico" como referencia al origen del concepto en su autor.

Tesis específicas de un autor, sin transversalidad ni candidatura a eje, viven en el archivo del autor en `30-Autores/`.

## Niveles del sistema

```
Tesis del autor          → 30-Autores/[Autor].md (sección)
Concepto transversal     → 35-Conceptos-clave/[Concepto].md
Eje del sistema          → 10-Ejes/[NN - Eje].md
```

Promover un concepto a eje es un acto editorial visible: se crea el archivo en `10-Ejes/` y se mantiene la ficha en `35-Conceptos-clave/` como referencia teórica.

## Conceptos teóricos (RR.II., poder, larga duración)

Conceptos extraídos de la base de libros canónicos (NotebookLM, mayo 2026):

| Concepto | Autor central | Estado |
|----------|---------------|--------|
| [[Hegemonía]] | Arrighi | concepto |
| [[Poder Político]] | Mann | concepto |
| [[Poder Infraestructural]] | Mann | concepto |
| [[Overstretch]] | Kennedy | concepto |
| [[Decadencia política]] | Fukuyama | concepto |
| [[Trampa territorial]] | Agnew | concepto |
| [[Fuerzas profundas]] | Renouvin | concepto |
| [[Tradición Inventada]] | Hobsbawm | concepto |
| [[Equilibrio de Poder]] | Kissinger | concepto |
| [[Causas últimas]] | Diamond | concepto (contrapunto) |

## Ejes candidatos

Conceptos propuestos para sumarse al sistema de ejes. Pendientes de decisión editorial.

| Concepto | Autores | Diagnóstico |
|----------|---------|-------------|
| [[Repatrimonialización]] | Fukuyama, Hobsbawm, Agnew | aceptable como eje |
| [[Desterritorialización]] | Agnew, Arrighi, Mann | sólido — tensión con Financiarización |
| [[Financiarización]] | Arrighi, Agnew, Fukuyama | sólido — tensión con Desterritorialización |
| [[Reprimarización]] | Arrighi, Fukuyama, Hobsbawm | mejor como concepto regional |
| [[Desincronización]] | Fukuyama, Hobsbawm | descartar como eje |

### Tres caminos editoriales pendientes

1. **Conservador** — sumar solo Repatrimonialización al sistema. Tratar lo económico-espacial como conceptos dentro de los 6 actuales.
2. **Expansivo** — aceptar Repatrimonialización + Desterritorialización + Financiarización. Reescribir el marco conceptual para volver explícito el sistema multidimensional.
3. **Híbrido** — aceptar Repatrimonialización; tratar Desterritorialización + Financiarización como un único eje compuesto.

## Pendientes de procesamiento

Libros del set canónico que aún no fueron procesados a fondo y pueden generar nuevos conceptos / ejes candidatos:

- Hobsbawm — *La invención de la tradición* (1983, ed. con Ranger; origen primario del concepto de tradición inventada)
- Mann — *Las fuentes del poder social*, vols. II-IV
- Zorgbibe — *Historia de las relaciones internacionales* (dos tomos)
- Conceptos pendientes específicos: Poder Despótico (Mann), modelo IEMP (Mann), Comunidad Imaginada (Anderson), ciclo sistémico de acumulación (Arrighi), dominio sin hegemonía (Arrighi)

## Ver también

- [[../10-Ejes/Ejes - MOC]]
- [[../30-Autores/Autores - MOC]]
- [[../20-Metodo/prompt-notebooklm-fichas-teoricas|Prompt NotebookLM]]
