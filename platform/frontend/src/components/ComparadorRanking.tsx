import "@/styles/mobile-restantes.css";

interface RankingCountry {
  code: string;
  name: string;
  value: number;
  covered: boolean;
}

interface Lectura {
  sintesis: string;
  por_que_importa: string;
}

interface ComparadorRankingProps {
  axisKey: string;
  axisLabel: string;
  indicatorLabel: string;
  questionText: string;
  lectura?: Lectura;
  countries: RankingCountry[];
  regionalValue: number;
  regionalStr: string;
  unit: string;
  waveLabel: string;
}

export default function ComparadorRanking({
  axisKey,
  axisLabel,
  indicatorLabel,
  questionText,
  lectura,
  countries,
  regionalValue,
  regionalStr,
  unit,
  waveLabel,
}: ComparadorRankingProps) {
  const isScale = unit === "escala 0-10";
  const maxVal  = isScale ? 10 : 100;

  const valueStr = (v: number) =>
    isScale ? v.toFixed(1) : `${Math.round(v)}%`;

  const countrySlug = (code: string) => code.toLowerCase();

  // Find insertion index for the average separator
  const avgInsertIdx = countries.findIndex(c => c.value < regionalValue);

  return (
    <div>
      {/* Body: eje pill + h1 + lectura */}
      <div className="mr-comp-body">
        <span
          className="mr-comp-eje-pill"
          style={{ background: `var(--mi-axis-${axisKey})` }}
        >
          {axisLabel}
        </span>

        <h1 className="mr-comp-h1">{indicatorLabel}</h1>

        {lectura && (
          <p className="mr-comp-lectura">{lectura.sintesis}</p>
        )}
      </div>

      {/* Ranking */}
      <div className="mr-ranking">
        {countries.map((c, idx) => {
          const barPct = (c.value / maxVal) * 100;
          const slug   = countrySlug(c.code);
          const showAvgLine = avgInsertIdx !== -1 && idx === avgInsertIdx;

          return (
            <div key={c.code}>
              {showAvgLine && (
                <div className="mr-ranking-average">
                  Promedio regional · {regionalStr}
                </div>
              )}

              {c.covered ? (
                <a
                  href={`/pais/${slug}?tab=pulso&indicador=${axisKey}`}
                  className="mr-ranking-row"
                >
                  <span className="mr-rank-num">{idx + 1}</span>
                  <span className="mr-rank-name">{c.name}</span>
                  <div className="mr-rank-bar-wrap">
                    <div
                      className="mr-rank-bar-fill"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="mr-rank-value">{valueStr(c.value)}</span>
                </a>
              ) : (
                <div className="mr-ranking-row">
                  <span className="mr-rank-num">{idx + 1}</span>
                  <span className="mr-rank-name" style={{ color: "var(--mi-ink-soft)" }}>
                    {c.name}
                  </span>
                  <div className="mr-rank-bar-wrap">
                    <div
                      className="mr-rank-bar-fill"
                      style={{ width: `${barPct}%`, opacity: 0.4 }}
                    />
                  </div>
                  <span className="mr-rank-value" style={{ color: "var(--mi-ink-mute)" }}>
                    {valueStr(c.value)}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* If no country was below average, append the line at the end */}
        {avgInsertIdx === -1 && countries.length > 0 && (
          <div className="mr-ranking-average">
            Promedio regional · {regionalStr}
          </div>
        )}
      </div>

      {/* Pregunta de encuesta */}
      <div style={{
        padding: "12px 20px",
        borderTop: "1px dashed rgba(0,0,0,0.15)",
        fontFamily: "var(--mi-font-body)",
        fontStyle: "italic",
        fontSize: 13,
        lineHeight: 1.5,
        color: "var(--mi-ink-soft)",
      }}>
        {questionText}
      </div>

      {/* Fuente */}
      <div className="mr-comp-source">
        <strong style={{ color: "var(--mi-ink)" }}>Fuente</strong>
        {" · "}{waveLabel}
      </div>
    </div>
  );
}
