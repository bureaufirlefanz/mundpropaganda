import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import netlify from "@astrojs/netlify";

// astro.config.mjs läuft vor Astros Env-Ladung — import.meta.env.PUBLIC_* ist
// hier noch nicht verfügbar. loadEnv liest dieselben Variablen, die die Seiten
// später über import.meta.env bekommen.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SANITY_STUDIO_URL } =
  loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

/* Wo das Studio läuft. Braucht Stega, um aus einem angeklickten Text den
   richtigen Feldpfad im Studio zu öffnen. Voreinstellung ist der lokale
   Entwicklungsstand; für ein veröffentlichtes Studio setzt Netlify die
   Variable. */
const STUDIO = PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

// Kein Framework-Adapter: die Seite ist statisch, die Interaktion läuft über
// vanilla-Module. Astro liefert damit null Framework-JavaScript aus — auch
// nach Aufgabe 6 noch. Visual Editing bringt zwar üblicherweise React mit;
// `@sanity/visual-editing/enable-visual-editing` ist aber eine schlichte
// Funktion ohne Rahmenwerk, und die reicht.
//
// `output: "static"` BLEIBT. In Astro 5 heißt das: alles wird vorgerendert,
// außer wo `export const prerender = false` steht. Genau zwei Stellen tun
// das — die Vorschau-Route und die beiden Draft-Mode-Endpunkte. Der Rest der
// Seite bleibt Byte für Byte, was er war, und steht auch ohne laufenden
// Server.
//
// Kein `vite.server.fs.allow` mehr: Es stand hier, solange Tokens, Basis-CSS
// und die Module aus dem Prototyp an der Wurzel eingebunden wurden. Seit A2
// liegen sie unter `src/styles/` und `src/js/` in diesem Ordner — der Zugriff
// nach oben ist damit weder nötig noch erwünscht.
export default defineConfig({
  output: "static",

  /* Nötig für die Vorschau-Route: Sie muss je Aufruf frisch rendern, weil sie
     Entwürfe zeigt. Alles Übrige bleibt vorgerendert. */
  adapter: netlify(),

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-07-28",
      // Statischer Build: direkt gegen die API, nicht über den CDN-Cache.
      useCdn: false,
      // Das Studio bleibt eigenständig in studio/ — hier bewusst kein
      // studioBasePath, sonst würde es in die Auslieferung eingebettet.

      /* Stega webt unsichtbare Markierungen in jeden Text, aus denen das
         Studio ablesen kann, welches Feld hinter einer Stelle steckt.
         `false` als Voreinstellung: Eingeschaltet wird es AUSSCHLIESSLICH in
         der Vorschau-Route, über einen eigenen Client. Stünde hier `true`,
         landeten die Markierungen im ausgelieferten HTML — unsichtbar zwar,
         aber sie stehen in Textinhalten und damit im Suchindex. */
      stega: { studioUrl: STUDIO, enabled: false },
    }),
  ],

  vite: {
    /* Alle fünf Fremdpakete beim Serverstart bündeln, nicht erst beim ersten
       Import.

       Nötig geworden durch A2: Vorher lagen die Module außerhalb der
       Vite-Wurzel und wurden nicht gescannt. Jetzt liegen sie in `src/js/`,
       und Vite entdeckt `gsap/CustomEase` erst dann, wenn das eine Modul
       lädt, das es braucht — mitten in der Sitzung. Es bündelt daraufhin neu,
       und jede Anfrage mit dem alten Hash beantwortet es mit
       „504 Outdated Optimize Dep".

       Gemessen: Der Rauchtest scheiterte reproduzierbar beim Seitenwechsel
       mit fünf solchen 504ern, und nach ihnen lief kein Modul mehr an — 44
       Reveals und 11 Headlines standen unverändert da. Nur im
       Entwicklungsmodus, der Build bündelt ohnehin alles. */
    optimizeDeps: {
      include: ["gsap", "gsap/ScrollTrigger", "gsap/SplitText", "gsap/CustomEase", "lenis"],
    },
  },
});
