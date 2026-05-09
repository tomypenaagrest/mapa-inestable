import type { Metadata } from "next";
import MapaExplorer from "./MapaExplorer";
import type { WeeklyCountryData } from "@/components/MapaCentrico";

export const metadata: Metadata = {
  title: "Mapa",
  description: "Mapa interactivo de Sudamérica con análisis estructural por país.",
};

const WEEKLY_COUNTRIES: WeeklyCountryData[] = [
  { slug: "co", axisKey: "desorientacion", lastTitle: "La sospecha antes del voto",             lastSlug: "la-sospecha-antes-del-voto",        lastAxis: "Desorientación epistemológica" },
  { slug: "ar", axisKey: "mediaciones",    lastTitle: "El revés de la motosierra",               lastSlug: "el-reves-de-la-motosierra",         lastAxis: "Erosión de mediaciones" },
  { slug: "cl", axisKey: "desrepresentacion", lastTitle: "La constitución que no fue, otra vez", lastSlug: "la-constitucion-que-no-fue",        lastAxis: "Desrepresentación" },
  { slug: "br", axisKey: "estetizacion",   lastTitle: "Fluminense y los nuevos altares",         lastSlug: "fluminense-y-los-nuevos-altares",   lastAxis: "Estetización" },
  { slug: "bo", axisKey: "mediaciones",    lastTitle: "El MAS sin Evo, sin Arce, sin destino",   lastSlug: "el-mas-sin-evo-sin-arce",           lastAxis: "Erosión de mediaciones" },
  { slug: "uy", axisKey: "desorientacion", lastTitle: "La cubierta donde no se esperaba",        lastSlug: "la-cubierta-donde-no-se-esperaba",  lastAxis: "Desorientación epistemológica" },
  { slug: "ve", axisKey: "desorientacion", lastTitle: "El apagón y la verdad oficial",           lastSlug: "el-apagon-y-la-verdad-oficial",     lastAxis: "Desorientación epistemológica" },
  { slug: "pe", axisKey: "desrepresentacion", lastTitle: "El Congreso que nadie defiende",       lastSlug: "el-congreso-que-nadie-defiende",    lastAxis: "Desrepresentación" },
  { slug: "ec", axisKey: "mediaciones",    lastTitle: "Noboa y la calle",                        lastSlug: "noboa-y-la-calle",                  lastAxis: "Erosión de mediaciones" },
  { slug: "py", axisKey: "estetizacion",   lastTitle: "La soja como bandera",                    lastSlug: "la-soja-como-bandera",              lastAxis: "Estetización" },
];

export default function MapaPage() {
  return <MapaExplorer weeklyCountries={WEEKLY_COUNTRIES} />;
}
