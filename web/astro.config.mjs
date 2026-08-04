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
// dieselben vanilla-Module wie im Prototyp. Astro liefert damit null
// Framework-JavaScript aus.
//
// fs.allow zeigt auf den Prototyp daneben: CSS und JS werden von dort
// eingebunden statt kopiert, damit beide Stände nicht auseinanderlaufen.
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
  vite: {
    server: { fs: { allow: [".."] } },
  },
});
