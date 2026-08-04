import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";

// astro.config.mjs läuft vor Astros Env-Ladung — import.meta.env.PUBLIC_* ist
// hier noch nicht verfügbar. loadEnv liest dieselben Variablen, die die Seiten
// später über import.meta.env bekommen.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
);

// Kein Framework-Adapter: die Seite ist statisch, die Interaktion läuft über
// vanilla-Module. Astro liefert damit null Framework-JavaScript aus.
//
// Kein `vite.server.fs.allow` mehr: Es stand hier, solange Tokens, Basis-CSS
// und die Module aus dem Prototyp an der Wurzel eingebunden wurden. Seit A2
// liegen sie unter `src/styles/` und `src/js/` in diesem Ordner — der Zugriff
// nach oben ist damit weder nötig noch erwünscht.
export default defineConfig({
  output: "static",
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-07-28",
      // Statischer Build: direkt gegen die API, nicht über den CDN-Cache.
      useCdn: false,
      // Das Studio bleibt eigenständig in studio/ — hier bewusst kein
      // studioBasePath, sonst würde es in die Auslieferung eingebettet.
    }),
  ],
});
