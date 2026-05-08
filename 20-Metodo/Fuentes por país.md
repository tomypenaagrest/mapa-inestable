---
tags: [método, fuentes]
tipo: método
---

# Fuentes por país

Listado de medios de referencia para la cobertura semanal de los 10 países de Mapa Inestable. Cada fuente se clasifica con la taxonomía del proyecto y se acompaña de una línea de orientación editorial.

Este archivo es **referencia editorial**, no un seed automático. Las fuentes con RSS disponible se reflejan, en un subconjunto, en `platform/backend/app/services/seed.py`.

## Taxonomía

| Tipo | Definición |
|------|-----------|
| **Hegemónico** | Medio masivo de circulación nacional, históricamente alineado con élites económicas o políticas dominantes. Define el sentido común mediático del país. |
| **Alternativo** | Medio con línea editorial heterodoxa, contestataria o ligada a sectores críticos del consenso dominante. Suele tener menor escala pero mayor densidad ideológica explícita. |
| **Análisis** | Medio especializado en periodismo investigativo, ensayo, datos o larga forma. Prioriza profundidad antes que velocidad. |

La clasificación es **funcional, no moral**. Un medio hegemónico no es "peor" que uno alternativo: cumple otra función en el ecosistema. Mapa Inestable necesita las tres capas para construir un disparador robusto.

## Cómo usar este archivo

- Para construir un disparador semanal: cruzar al menos un hegemónico (qué reporta el sentido común) con un alternativo o análisis (qué se está leyendo desde otro lado).
- Cuando un evento solo aparece en alternativos/análisis: vale la pena nombrarlo como tal — la ausencia en lo hegemónico es parte del análisis.
- Los medios marcados con (✱) tienen RSS activo en el seed actual.
- Los medios marcados con (†) están cerrados o muy degradados, pero se mantienen como referencia histórica.

---

## Argentina

### Hegemónicos
- **Clarín** — [clarin.com](https://www.clarin.com) — Centro-derecha. Mayor diario, núcleo del Grupo Clarín. Es la voz dominante del sentido común mediático argentino.
- **La Nación** — [lanacion.com.ar](https://www.lanacion.com.ar) — Conservador histórico. Lectura tradicional de élites, agro y empresariado.
- **Infobae** (✱) — [infobae.com](https://www.infobae.com) — Centro-derecha digital. Alcance masivo, formato titular agresivo, presencia regional.
- **Ámbito Financiero** — [ambito.com](https://www.ambito.com) — Económico-financiero. Voz del mercado y la City.
- **Perfil** — [perfil.com](https://www.perfil.com) — Centro-derecha. Editorial Perfil; columnismo y agenda política.

### Alternativos
- **Página/12** — [pagina12.com.ar](https://www.pagina12.com.ar) — Centro-izquierda / kirchnerismo. Voz histórica del progresismo argentino post-dictadura.
- **El Destape** (✱) — [eldestapeweb.com](https://www.eldestapeweb.com) — Kirchnerismo digital. Línea explícita, formato online.
- **Tiempo Argentino** — [tiempoar.com.ar](https://www.tiempoar.com.ar) — Cooperativa, izquierda peronista.

### Análisis
- **El Cohete a la Luna** (✱) — [elcohetealaluna.com](https://www.elcohetealaluna.com) — Horacio Verbitsky. Análisis político-judicial desde la izquierda.
- **Cenital** — [cenital.com](https://cenital.com) — Periodismo explicativo, sin alineación partidaria fuerte. Newsletters por área (economía, política, internacional).
- **Revista Anfibia** — [revistaanfibia.com](https://www.revistaanfibia.com) — Crónica y ensayo. Cruce entre periodismo y academia (UNSAM).
- **La Política Online (LPO)** — [lapoliticaonline.com](https://www.lapoliticaonline.com) — Periodismo político de pasillo, lectura de poder.
- **Letra P** — [letrap.com.ar](https://www.letrap.com.ar) — Política nacional y provincial.

---

## Brasil

### Hegemónicos
- **Folha de S.Paulo** (✱) — [folha.uol.com.br](https://www.folha.uol.com.br) — Liberal. Diario nacional de referencia, lectura obligada de élites.
- **O Globo** — [oglobo.globo.com](https://oglobo.globo.com) — Centro-derecha. Núcleo del Grupo Globo, máximo conglomerado mediático del país.
- **O Estado de S. Paulo (Estadão)** — [estadao.com.br](https://www.estadao.com.br) — Conservador. Históricamente paulista, ligado a élites tradicionales.
- **Veja** — [veja.abril.com.br](https://veja.abril.com.br) — Centro-derecha. Revista semanal, agenda anti-PT histórica.
- **Agência Brasil** (✱) — [agenciabrasil.ebc.com.br](https://agenciabrasil.ebc.com.br) — Estatal. EBC, agencia oficial; útil para versiones gubernamentales.

### Alternativos
- **Carta Capital** — [cartacapital.com.br](https://www.cartacapital.com.br) — Centro-izquierda. Crítica al Globo y al Estadão.
- **Brasil de Fato** — [brasildefato.com.br](https://www.brasildefato.com.br) — Izquierda, vínculo con MST y movimientos sociales.
- **The Intercept Brasil** (✱) — [theintercept.com/brasil](https://theintercept.com/brasil) — Investigación con línea progresista (Vaza Jato).

### Análisis
- **Piauí** — [piaui.folha.uol.com.br](https://piaui.folha.uol.com.br) — Larga forma, perfiles, ensayo. Equivalente brasileño a *The New Yorker*.
- **Nexo Jornal** — [nexojornal.com.br](https://www.nexojornal.com.br) — Periodismo de contexto y datos. Sin línea partidaria explícita.
- **Agência Pública** — [apublica.org](https://apublica.org) — Periodismo investigativo independiente.
- **JOTA** — [jota.info](https://www.jota.info) — Análisis jurídico-político, especializado en STF y Brasília.

---

## Chile

### Hegemónicos
- **El Mercurio** — [emol.com](https://www.emol.com) — Conservador histórico. "El Decano", referencia de élites empresariales.
- **La Tercera** (✱) — [latercera.com](https://www.latercera.com) — Centro-derecha. Segundo gran diario, lectura de centro político-empresarial.
- **La Cuarta** — [lacuarta.com](https://www.lacuarta.com) — Popular, sensacionalista. Útil para registrar tono de calle.
- **Bío Bío Chile** — [biobiochile.cl](https://www.biobiochile.cl) — Multimedia regional con alcance nacional, registro factual.

### Alternativos
- **El Mostrador** (✱) — [elmostrador.cl](https://www.elmostrador.cl) — Centro-izquierda digital. Línea liberal-progresista.
- **Interferencia** — [interferencia.cl](https://interferencia.cl) — Izquierda crítica, periodismo de investigación.
- **The Clinic** — [theclinic.cl](https://www.theclinic.cl) — Crítica, sátira y reportaje. Cultura política post-Pinochet.

### Análisis
- **CIPER Chile** (✱) — [ciperchile.cl](https://www.ciperchile.cl) — Periodismo investigativo de referencia regional.
- **La Tercera PM / Pulso** — Subproducto análisis económico-político.

---

## Colombia

### Hegemónicos
- **El Tiempo** — [eltiempo.com](https://www.eltiempo.com) — Centro. Mayor diario, propiedad del Grupo Sarmiento Angulo.
- **El Espectador** (✱) — [elespectador.com](https://www.elespectador.com) — Liberal. Segundo diario nacional, vínculos con liberalismo histórico.
- **Semana** (✱) — [semana.com](https://www.semana.com) — Centro-derecha. Tras la salida de los Coronell viró a derecha dura uribista.
- **La FM / RCN** — [rcnradio.com](https://www.rcnradio.com) — Radio masiva, agenda Grupo RCN.

### Alternativos
- **Las2Orillas** — [las2orillas.co](https://www.las2orillas.co) — Plural, ciudadano, registro de voces no centrales.
- **Cuarto de Hora** — [cuartodehora.com](https://cuartodehora.com) — Reportaje político, tono crítico.

### Análisis
- **La Silla Vacía** (✱) — [lasillavacia.com](https://lasillavacia.com) — Periodismo político de poder. Mapeo de redes de influencia.
- **Cerosetenta (070)** — [cerosetenta.uniandes.edu.co](https://cerosetenta.uniandes.edu.co) — Universidad de los Andes; investigación, ensayo, cultura.
- **Razón Pública** — [razonpublica.com](https://razonpublica.com) — Columnismo académico, análisis estructural.
- **Cuestión Pública** — [cuestionpublica.com](https://cuestionpublica.com) — Investigación de datos.

---

## Bolivia

### Hegemónicos
- **El Deber** (✱) — [eldeber.com.bo](https://eldeber.com.bo) — Santa Cruz. Voz del oriente y del empresariado cruceño.
- **La Razón** — [la-razon.com](https://www.la-razon.com) — La Paz. Histórico diario de la sede de gobierno.
- **Los Tiempos** (✱) — [lostiempos.com](https://www.lostiempos.com) — Cochabamba. Diario regional con peso nacional.
- **Página Siete** (†) — Cerrado en 2023 tras presión gubernamental. Referencia histórica del periodismo crítico al MAS.

### Alternativos
- **ANF (Agencia de Noticias Fides)** — [noticiasfides.com](https://www.noticiasfides.com) — Jesuita. Línea editorial independiente, fuerte presencia en regiones.
- **Erbol** — [erbol.com.bo](https://erbol.com.bo) — Red de radios populares, perspectiva indigenista y campesina.

### Análisis
- **Brújula Digital** — [brujuladigital.net](https://brujuladigital.net) — Análisis político digital, columnismo plural.
- **Nómadas** — [nomadas.bo](https://nomadas.bo) — Crónica y ensayo, mirada cultural y política.
- **La Pública** — [lapublica.org.bo](https://lapublica.org.bo) — Investigación periodística.

---

## Perú

### Hegemónicos
- **El Comercio** — [elcomercio.pe](https://elcomercio.pe) — Centro-derecha. Mayor grupo mediático del país (Grupo El Comercio).
- **La República** (✱) — [larepublica.pe](https://larepublica.pe) — Centro-izquierda. Contrapeso del bloque hegemónico de derecha.
- **Perú21** — [peru21.pe](https://peru21.pe) — Centro-derecha popular. Mismo grupo que El Comercio.
- **RPP Noticias** — [rpp.pe](https://rpp.pe) — Radio masiva, agenda dominante de coyuntura.

### Alternativos
- **Wayka** — [wayka.pe](https://wayka.pe) — Izquierda digital, registro de protesta y movimientos.
- **La Mula** — [lamula.pe](https://lamula.pe) — Plataforma plural, ciudadana.

### Análisis
- **IDL-Reporteros** — [idl-reporteros.pe](https://www.idl-reporteros.pe) — Investigación de referencia (Lava Jato, Cuellos Blancos).
- **OjoPúblico** (✱) — [ojo-publico.com](https://ojo-publico.com) — Periodismo de datos e investigación.
- **Sudaca** — [sudaca.pe](https://sudaca.pe) — Análisis político, columnismo.
- **Convoca** — [convoca.pe](https://convoca.pe) — Datos e investigación regional.

---

## Uruguay

### Hegemónicos
- **El País** (✱) — [elpais.com.uy](https://www.elpais.com.uy) — Conservador histórico. Diario de referencia de la derecha uruguaya.
- **El Observador** — [elobservador.com.uy](https://www.elobservador.com.uy) — Centro-derecha. Agenda económica y empresarial.

### Alternativos
- **La Diaria** (✱) — [ladiaria.com.uy](https://ladiaria.com.uy) — Izquierda independiente. Cooperativa de periodistas, modelo de suscripción.

### Análisis
- **Búsqueda** — [busqueda.com.uy](https://www.busqueda.com.uy) — Semanario centro-derecha, agenda política y económica.
- **Brecha** — [brecha.com.uy](https://brecha.com.uy) — Semanario izquierda, ensayo y reportaje.
- **Razones y Personas** — [razonesypersonas.com](http://www.razonesypersonas.com) — Blog académico de ciencias sociales.

---

## Paraguay

### Hegemónicos
- **ABC Color** (✱) — [abc.com.py](https://www.abc.com.py) — Conservador. Mayor diario, vinculado al grupo Zuccolillo.
- **Última Hora** — [ultimahora.com](https://www.ultimahora.com) — Centro. Diario popular de Asunción.
- **La Nación** — [lanacion.com.py](https://www.lanacion.com.py) — Centro-derecha. Grupo empresarial diversificado.

### Alternativos
- **El Independiente** — [elindependiente.com.py](https://elindependiente.com.py) — Crítico, foco anticorrupción.
- **E'a** — [ea.com.py](https://ea.com.py) — Izquierda, periodismo cultural y político.

### Análisis
- **El Surti** — [elsurti.com](https://elsurti.com) — Periodismo investigativo y de datos, formato visual.
- **Kurtural** — [kurtural.com](https://kurtural.com) — Crónica y análisis cultural-político.

---

## Ecuador

### Hegemónicos
- **El Universo** (✱) — [eluniverso.com](https://www.eluniverso.com) — Guayaquil, conservador. Mayor diario, voz costeña.
- **El Comercio** — [elcomercio.com](https://www.elcomercio.com) — Quito, centro-derecha. Voz serrana tradicional.
- **Expreso** — [expreso.ec](https://www.expreso.ec) — Guayaquil, conservador.

### Alternativos
- **La Posta** — [laposta.com.ec](https://www.laposta.com.ec) — Digital, sensacionalista, alta penetración.
- **Wambra** — [wambra.ec](https://wambra.ec) — Comunicación comunitaria, indigenista.

### Análisis
- **Primicias** — [primicias.ec](https://www.primicias.ec) — Digital, periodismo profesional sin alineación partidaria fuerte.
- **GK** (✱) — [gk.city](https://gk.city) — Periodismo digital, género, derechos, política.
- **Plan V** — [planv.com.ec](https://www.planv.com.ec) — Investigación y análisis de larga forma.
- **La Periódica** — [periodismoperiodica.com](https://periodismoperiodica.com) — Feminista, análisis político-cultural.

---

## Venezuela

> Caso particular: la censura, el cierre de medios y el exilio editorial atraviesan el ecosistema. La distinción hegemónico/alternativo se vuelve sinónimo de oficialista/opositor. Conservar pluralidad de fuentes es especialmente crítico.

### Hegemónicos (afines al oficialismo)
- **El Universal** — [eluniversal.com](https://www.eluniversal.com) — Tras 2014 viró a línea oficialista.
- **Últimas Noticias** — [ultimasnoticias.com.ve](https://www.ultimasnoticias.com.ve) — Popular, oficialista.
- **Telesur** — [telesurtv.net](https://www.telesurtv.net) — Estatal regional, narrativa bolivariana.

### Alternativos (críticos / oposición)
- **El Nacional** — [elnacional.com](https://www.elnacional.com) — Histórico de la oposición; hoy operación digital desde el exilio.
- **Tal Cual** (✱) — [talcualdigital.com](https://talcualdigital.com) — Crítico, fundado por Teodoro Petkoff.
- **Efecto Cocuyo** (✱) — [efectococuyo.com](https://efectococuyo.com) — Independiente, fact-checking y derechos humanos.
- **Caraota Digital** — [caraotadigital.net](https://www.caraotadigital.net) — Digital crítico.

### Análisis
- **Armando.info** — [armando.info](https://armando.info) — Investigación transnacional desde el exilio (corrupción, sanciones).
- **Prodavinci** — [prodavinci.com](https://prodavinci.com) — Ensayo, larga forma, mirada cultural.
- **Runrun.es** — [runrun.es](https://runrun.es) — Periodismo de datos, derechos humanos.

---

## Notas sobre cobertura

- **Países con buen balance hegemónico/alternativo/análisis:** Argentina, Brasil, Chile, Colombia, Perú.
- **Países con balance débil que requieren cuidado al leer:** Bolivia (concentración hegemónica regional), Paraguay (panorama crítico chico), Venezuela (polarización extrema).
- **Países con prensa fuerte de análisis:** Brasil (Piauí, Nexo, Pública), Argentina (Cenital, Anfibia), Colombia (La Silla Vacía, Cerosetenta).

## Pendiente / a revisar

- Validar URLs y RSS antes de incorporar al seed del backend.
- Sumar medios indígenas / comunitarios donde corresponda (Bolivia, Ecuador, México si se expande la cobertura).
- Considerar fuentes regionales transnacionales: *Connectas*, *Distintas Latitudes*, *Americas Quarterly*, *AlJazeera Latinoamérica*.

## Ver también

- [[Método de trabajo]]
- [[Principios editoriales]]
- [[Estructura de una publicación]]
