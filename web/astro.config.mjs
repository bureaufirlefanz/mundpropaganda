import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sanity from "@sanity/astro";
import netlify from "@astrojs/netlify";

// astro.config.mjs läuft vor Astros Env-Ladung — import.meta.env.PUBLIC_* ist
// hier noch nicht verfügbar. loadEnv liest dieselben Variablen, die die Seiten
// später über import.meta.env bekommen.
const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_STUDIO_URL,
} = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

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
/**
 * Hängt die Suchmaschinen-Sperre als Kopfzeile an `dist/_headers`, solange der
 * Schalter im Studio aus ist.
 *
 * Warum überhaupt eine Kopfzeile, wo doch jede Seite `noindex` im <head>
 * trägt: Der Meta-Tag wirkt nur in HTML. PDFs, Bilder und alles andere ohne
 * <head> wären ohne den X-Robots-Tag weiterhin indexierbar.
 *
 * Warum eine Integration und keine Datei unter `public/`: Der Wert steht im
 * CMS, und `public/` wird unverändert kopiert. Astro-Routen wiederum können
 * `_headers` nicht erzeugen — Dateien mit führendem Unterstrich sind vom
 * Routing ausgenommen. Bleibt der Griff nach dem fertigen Build.
 *
 * Der Abruf läuft ohne Token, weil der Datensatz öffentlich lesbar ist. Wenn
 * er scheitert, wird gesperrt und nicht freigegeben: Bei einer Störung ist
 * ein nicht indexierter Prototyp der harmlosere Ausgang.
 */
function suchmaschinenSperre({ projectId, dataset, apiVersion }) {
  return {
    name: "mundpropaganda:suchmaschinen-sperre",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const abfrage = encodeURIComponent(
          '*[_id == "settings"][0].searchEngines',
        );
        const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${abfrage}`;

        let freigegeben = false;
        try {
          const antwort = await fetch(url);
          if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
          freigegeben = (await antwort.json()).result === true;
        } catch (fehler) {
          logger.warn(
            `Einstellungen nicht erreichbar (${fehler.message}) — die Seite wird gesperrt ausgeliefert.`,
          );
        }

        if (freigegeben) {
          logger.info(
            "Suchmaschinen sind freigegeben, keine Sperre in _headers.",
          );
          return;
        }

        const pfad = fileURLToPath(new URL("_headers", dir));
        const bestand = await readFile(pfad, "utf8").catch(() => "");
        const sperre = "/*\n  X-Robots-Tag: noindex, nofollow\n\n";
        await writeFile(pfad, sperre + bestand, "utf8");
        logger.info(
          "Suchmaschinen gesperrt: X-Robots-Tag in _headers gesetzt.",
        );
      },
    },
  };
}

export default defineConfig({
  output: "static",

  /* The emergency page was `/notdienst` from 2026-10-13 to 2026-10-14; since
     then it is a service like the others. */
  redirects: { "/notdienst": "/leistungen/notdienst" },

  /* Nötig für die Vorschau-Route: Sie muss je Aufruf frisch rendern, weil sie
     Entwürfe zeigt. Alles Übrige bleibt vorgerendert.

     `devFeatures: false` schaltet ab, was der Adapter beim `astro dev`
     zusätzlich hochfährt — Netlifys Image CDN und das Laden von
     Umgebungsvariablen aus dem verknüpften Projekt. Beides brauchen wir
     nicht: Bilder kommen aus Sanitys CDN oder der lokalen Pipeline, und die
     Variablen stehen in `.env`.

     Es löst NICHT das Problem, das netlify.toml betrifft: Das Vite-Plugin
     des Adapters läuft in jedem Fall und löst die Datei von `web/` aus auf.
     Ein `base = "web"` darin ergäbe `web/web`. Deshalb trägt
     `web/netlify.toml` kein base — das steht in den Projekteinstellungen bei
     Netlify. Die Begründung dazu vollständig in jener Datei. */
  adapter: netlify({ devFeatures: false }),

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-07-28",
      // Statischer Build: direkt gegen die API, nicht über den CDN-Cache.
      useCdn: false,

      /* Ausgeschrieben, obwohl es die Voreinstellung ist.
         Seit `apiVersion` 2025-02-19 liefert die API ohne Angabe den
         veröffentlichten Stand — davor waren es Entwürfe UND Veröffentlichtes.
         Ein Sprung der apiVersion nach oben ändert daran nichts mehr, ein
         Sprung nach unten schon: Dann bekäme der statische Build unfertige
         Entwürfe und veröffentlichte sie. Das ist zu leise für einen
         Unfall. */
      perspective: "published",
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

    suchmaschinenSperre({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-07-28",
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
      include: [
        "gsap",
        "gsap/ScrollTrigger",
        "gsap/SplitText",
        "gsap/CustomEase",
        "lenis",
      ],
    },
  },
});
