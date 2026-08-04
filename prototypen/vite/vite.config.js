import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import handlebars from "vite-plugin-handlebars";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Partials liegen in src/partials und werden per {{> name }} eingebunden.
 * Dadurch entsteht die Bausteinbibliothek, aus der sich neue Seitentypen
 * zusammenstecken lassen — genau der Zweck dieses Prototyps.
 */
export default defineConfig({
  /* Ausdrücklich gesetzt, weil die Konfiguration nicht mehr im
     Arbeitsverzeichnis liegt: Aufgerufen wird sie vom Projektstamm aus über
     `--config`, und Vite nähme sonst den Stamm als Wurzel. */
  root,

  /* Die statischen Dateien liegen seit A2 beim Produkt. Ohne diese Zeile
     suchte Vite sie unter `./public` und lieferte kein einziges Bild aus.
     Genau die Richtung ist gewollt: Das Produkt besitzt sein Fundament, der
     Prototyp leiht es sich. */
  publicDir: resolve(root, "../../web/public"),

  plugins: [
    handlebars({
      partialDirectory: resolve(root, "src/partials"),
      reloadOnPartialChange: true,
      context: {
        year: new Date().getFullYear(),
      },
      helpers: {
        // {{#times 4}}…{{/times}} — für Platzhalter-Wiederholungen.
        times(n, options) {
          let out = "";
          for (let i = 0; i < n; i++) out += options.fn({ index: i, n: i + 1 });
          return out;
        },

        // {{srcset "portrait-hero" "webp" "640,1024,1600"}}
        // Baut den srcset-String, damit das Markup nicht zumüllt.
        srcset(name, ext, widths) {
          return String(widths)
            .split(",")
            .map((w) => w.trim())
            .map((w) => `/img/${name}-${w}.${ext} ${w}w`)
            .join(", ");
        },

        // Fallback-Quelle: die kleinste erzeugte Breite.
        fallback(name, widths) {
          const first = String(widths).split(",")[0].trim();
          return `/img/${name}-${first}.webp`;
        },
      },
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        veneers: resolve(root, "leistungen/veneers.html"),
        styleguide: resolve(root, "styleguide.html"),
      },
    },
    // Assets unter 4 KB inlinen; alles darüber bleibt eine eigene Datei,
    // damit der Browser parallel und cachebar lädt.
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    target: "es2020",
  },

  server: {
    port: 5173,
    open: false,

    /* Erlaubt den Zugriff auf `web/src/…` oberhalb der Wurzel — dort liegen
       Tokens, Basis-CSS und die Module, die `src/js/main.js` einbindet. In
       der Astro-Konfiguration stand bis A2 dieselbe Zeile mit umgekehrter
       Blickrichtung; dort ist sie entfallen, hier ist sie richtig. */
    fs: { allow: [resolve(root, "../..")] },
  },
});
