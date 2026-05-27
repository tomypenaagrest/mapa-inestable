import Link from "next/link";
import type { AxisIntensity } from "@/lib/country-data";
import "@/styles/country-page.css";

interface Props {
  slug:            string;
  name:            string;
  centralQuestion: string | null;
  ejes:            AxisIntensity[];
  analysisCount:   number;
  lastDate:        string | null;
}

export default function CountryHeader({
  slug,
  name,
  centralQuestion,
  ejes,
  analysisCount,
  lastDate,
}: Props) {
  const activeAxesCount = ejes.filter(e => e.intensity >= 3).length;
  const chronicEjes     = ejes.filter(e => e.intensity >= 2);

  return (
    <>
      <div className="country-header">
        <h1 className="country-name">{name}</h1>

        {centralQuestion && (
          <p className="country-question">{centralQuestion}</p>
        )}

        <div className="country-meta">
          <span>{analysisCount} análisis</span>
          {lastDate && <span>última: {lastDate}</span>}
          <span>{activeAxesCount} ejes activos</span>
        </div>
      </div>

      {chronicEjes.length > 0 && (
        <div className="country-frame-strip">
          <span className="frame-strip-label">Ejes crónicos ›</span>
          <div className="frame-strip-pills">
            {chronicEjes.map(eje => (
              <Link
                key={eje.key}
                href={`/ejes/${eje.key}?pais=${slug}`}
                className="frame-strip-pill"
                style={{
                  color:       `var(--mi-axis-${eje.key})`,
                  borderColor: `var(--mi-axis-${eje.key})`,
                }}
              >
                {eje.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
