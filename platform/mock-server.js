// Mock API server — simula el backend FastAPI para desarrollo sin Python
const http = require("http");

const COUNTRIES = ["AR", "BR", "CL", "CO", "BO", "PE", "UY", "PY", "EC", "VE"];
const AXES = [
  "deculturacion",
  "erosion_mediaciones",
  "desrepresentacion",
  "estetizacion",
  "desorientacion_epistemologica",
  "atencion",
];

// Datos de muestra para el mapa
const sampleSummaries = COUNTRIES.map((country, i) => ({
  country,
  week: 17,
  year: 2026,
  event_count: Math.floor(Math.random() * 12) + 1,
  analysis_count: Math.floor(Math.random() * 4),
  active_axes: i % 3 === 0
    ? []
    : [
        { axis: AXES[i % AXES.length], count: Math.floor(Math.random() * 5) + 2 },
        { axis: AXES[(i + 2) % AXES.length], count: Math.floor(Math.random() * 3) + 1 },
      ],
}));

// Datos de muestra de eventos
let events = [
  {
    id: 1,
    country: "AR",
    title: "Crisis de representación en el Congreso nacional",
    url: "https://example.com/ar-congreso",
    medium: "El Destape",
    author: "Redacción",
    published_at: "2026-04-21T10:00:00Z",
    week: 17,
    year: 2026,
    summary: "El Congreso aprobó una ley de ajuste que genera fracturas en la coalición oficialista y profundiza el debate sobre la legitimidad de las instituciones.",
    relevant: true,
    axes: [
      { axis: "desrepresentacion", is_primary: true },
      { axis: "erosion_mediaciones", is_primary: false },
    ],
  },
  {
    id: 2,
    country: "BR",
    title: "Movimientos antisistema ganan terreno en elecciones municipales",
    url: "https://example.com/br-municipales",
    medium: "Agência Brasil",
    author: null,
    published_at: "2026-04-22T08:30:00Z",
    week: 17,
    year: 2026,
    summary: "Candidatos sin afiliación partidaria tradicional obtuvieron resultados sorprendentes en ciudades de más de 500 mil habitantes.",
    relevant: true,
    axes: [
      { axis: "desrepresentacion", is_primary: true },
      { axis: "deculturacion", is_primary: false },
    ],
  },
  {
    id: 3,
    country: "CL",
    title: "Redes sociales como principal fuente de información política",
    url: "https://example.com/cl-redes",
    medium: "El Mostrador",
    author: "María José Pérez",
    published_at: "2026-04-20T14:00:00Z",
    week: 17,
    year: 2026,
    summary: "Estudio indica que el 67% de los chilenos menores de 35 años se informa exclusivamente a través de TikTok e Instagram.",
    relevant: false,
    axes: [{ axis: "erosion_mediaciones", is_primary: true }],
  },
];

let idCounter = events.length + 1;

// Análisis de muestra
let analyses = [
  {
    id: 1,
    event_id: 1,
    country: "AR",
    week: 17,
    year: 2026,
    disparador: "El Congreso argentino aprobó la Ley de Bases con 35 votos a favor y 32 en contra, generando una fractura visible en la coalición oficialista y protestas frente al Palacio Legislativo.",
    desplazamiento: "La fractura no es sobre la ley: es sobre la capacidad del sistema político para procesar conflictos distributivos sin perder legitimidad. Lo que se ve en el Congreso es el síntoma de un proceso más profundo: las instituciones siguen funcionando formalmente pero ya no producen identificación.",
    conceptualizacion: "Eje central: Desrepresentación. Las instituciones existen pero pierden densidad simbólica. El voto no resuelve el conflicto porque el conflicto ya no pasa por las instituciones. Eje secundario: Erosión de mediaciones — los partidos no median, solo votan.",
    apertura: "¿En qué momento las instituciones dejan de ser el lugar donde se procesa el conflicto y se convierten en el escenario donde se representa su irresolución?",
    published: false,
    created_at: "2026-04-23T12:00:00Z",
    updated_at: "2026-04-23T12:00:00Z",
    event: events[0],
  },
];

let analysisCounter = analyses.length + 1;

// Despachos de muestra
let dispatches = [];
let dispatchCounter = 1;

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:8000");
  const path = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  console.log(`${method} ${path}`);

  // Root
  if (path === "/" && method === "GET") {
    return send(res, 200, { status: "ok", project: "Mapa Inestable (mock)" });
  }

  // MAP
  const mapMatch = path.match(/^\/api\/map\/week\/(\d+)\/(\d+)$/);
  if (mapMatch && method === "GET") {
    const year = parseInt(mapMatch[1]);
    const week = parseInt(mapMatch[2]);
    return send(res, 200, sampleSummaries.map((s) => ({ ...s, year, week })));
  }

  // EVENTS
  if (path === "/api/events" && method === "GET") {
    let result = [...events];
    const country = url.searchParams.get("country");
    const week = url.searchParams.get("week");
    const year = url.searchParams.get("year");
    const relevant = url.searchParams.get("relevant");
    if (country) result = result.filter((e) => e.country === country);
    if (week) result = result.filter((e) => e.week === parseInt(week));
    if (year) result = result.filter((e) => e.year === parseInt(year));
    if (relevant !== null) result = result.filter((e) => e.relevant === (relevant === "true"));
    return send(res, 200, result);
  }

  if (path === "/api/events" && method === "POST") {
    const body = await parseBody(req);
    const event = { id: idCounter++, relevant: false, axes: [], created_at: new Date().toISOString(), ...body };
    events.push(event);
    return send(res, 201, event);
  }

  const eventMatch = path.match(/^\/api\/events\/(\d+)$/);
  if (eventMatch && method === "GET") {
    const ev = events.find((e) => e.id === parseInt(eventMatch[1]));
    if (!ev) return send(res, 404, { detail: "Evento no encontrado" });
    return send(res, 200, ev);
  }

  const relevantMatch = path.match(/^\/api\/events\/(\d+)\/relevant$/);
  if (relevantMatch && method === "PATCH") {
    const ev = events.find((e) => e.id === parseInt(relevantMatch[1]));
    if (!ev) return send(res, 404, { detail: "Evento no encontrado" });
    ev.relevant = url.searchParams.get("relevant") === "true";
    return send(res, 200, ev);
  }

  const axesMatch = path.match(/^\/api\/events\/(\d+)\/axes$/);
  if (axesMatch && method === "POST") {
    const ev = events.find((e) => e.id === parseInt(axesMatch[1]));
    if (!ev) return send(res, 404, { detail: "Evento no encontrado" });
    ev.axes = await parseBody(req);
    return send(res, 200, ev);
  }

  // ANALYSES
  if (path === "/api/analyses" && method === "GET") {
    let result = [...analyses];
    const country = url.searchParams.get("country");
    const week = url.searchParams.get("week");
    const year = url.searchParams.get("year");
    const published = url.searchParams.get("published");
    if (country) result = result.filter((a) => a.country === country);
    if (week) result = result.filter((a) => a.week === parseInt(week));
    if (year) result = result.filter((a) => a.year === parseInt(year));
    if (published !== null) result = result.filter((a) => a.published === (published === "true"));
    return send(res, 200, result);
  }

  if (path === "/api/analyses" && method === "POST") {
    const body = await parseBody(req);
    const analysis = {
      id: analysisCounter++,
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      event: events.find((e) => e.id === body.event_id) || null,
      ...body,
    };
    analyses.push(analysis);
    return send(res, 201, analysis);
  }

  const analysisMatch = path.match(/^\/api\/analyses\/(\d+)$/);
  if (analysisMatch) {
    const a = analyses.find((x) => x.id === parseInt(analysisMatch[1]));
    if (!a) return send(res, 404, { detail: "Análisis no encontrado" });
    if (method === "GET") return send(res, 200, a);
    if (method === "PATCH") {
      const body = await parseBody(req);
      Object.assign(a, body, { updated_at: new Date().toISOString() });
      return send(res, 200, a);
    }
    if (method === "DELETE") {
      analyses = analyses.filter((x) => x.id !== a.id);
      res.writeHead(204);
      res.end();
      return;
    }
  }

  // DISPATCHES
  if (path === "/api/dispatches" && method === "GET") {
    return send(res, 200, dispatches);
  }

  if (path === "/api/dispatches" && method === "POST") {
    const body = await parseBody(req);
    const dispatch = {
      id: dispatchCounter++,
      published: false,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };
    dispatches.push(dispatch);
    return send(res, 201, dispatch);
  }

  const dispatchMatch = path.match(/^\/api\/dispatches\/(\d+)$/);
  if (dispatchMatch) {
    const d = dispatches.find((x) => x.id === parseInt(dispatchMatch[1]));
    if (!d) return send(res, 404, { detail: "Despacho no encontrado" });
    if (method === "GET") return send(res, 200, d);
    if (method === "PATCH") {
      const body = await parseBody(req);
      if (body.published && !d.published_at) body.published_at = new Date().toISOString();
      Object.assign(d, body, { updated_at: new Date().toISOString() });
      return send(res, 200, d);
    }
  }

  // RSS
  if (path === "/api/rss/ingest" && method === "POST") {
    return send(res, 202, { status: "ingesta iniciada (mock)" });
  }

  // SOURCES
  if (path === "/api/sources" && method === "GET") {
    return send(res, 200, []);
  }

  send(res, 404, { detail: "Not found" });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`\n🗺  Mock API corriendo en http://localhost:${PORT}`);
  console.log(`   Datos de muestra incluidos para AR, BR, CL\n`);
});
