import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemaTypes";
import { structure, EINZELDOKUMENTE, OHNE_ROUTE } from "./structure";
import { resolve } from "./structure/orte";
import { PublishHinweis } from "./components/PublishHinweis";

/**
 * Wo die Website läuft. Lokal der Dev-Server, in der Auslieferung die echte
 * Adresse — gesetzt über SANITY_STUDIO_PREVIEW_URL, damit ein
 * veröffentlichtes Studio nicht auf localhost zeigt.
 */
const WEBSITE = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:4321";

// Eigenständiges Studio, nicht in die Astro-App eingebettet: Redaktion und
// Auslieferung bleiben dadurch getrennt deploybar.
export default defineConfig({
  name: "default",
  title: "Mundpropaganda",

  projectId: "a6bjftwf",
  dataset: "production",

  plugins: [
    // Aufbau der Seitenleiste liegt in structure/.
    structureTool({ structure }),

    /* Klick-zum-Bearbeiten. Beides bleibt nebeneinander: structureTool ist der
       Weg über die Liste, presentationTool der über die Seite.

       Der Vorschau-Reiter am Dokument ist mit Aufgabe 7 entfallen
       (`WebVorschau.tsx`, `dokumentAnsichten.ts`). Er zeigte den gebauten
       Stand in einem iframe — also nicht den Entwurf, den man gerade
       bearbeitet. Zwei Vorschauen nebeneinander sind schlechter als eine:
       Man sieht immer nur eine und weiß nicht, welche gerade lügt. */
    presentationTool({
      resolve,
      previewUrl: {
        initial: WEBSITE,
        /* Der Endpunkt prüft das Geheimnis gegen den Datensatz und setzt erst
           dann das Cookie, das /preview freischaltet. */
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),

    // Abfragen ausprobieren, ohne die Seite zu bauen. Bleibt im Studio, geht
    // nicht in die Auslieferung.
    visionTool({ defaultApiVersion: "2026-07-28" }),
  ],

  /* Der Hinweis, dass Publish nicht sofort wirkt. Siehe die Begründung in
     components/PublishHinweis.tsx — ohne ihn ist die naheliegende Erklärung
     „es funktioniert nicht", und der Anruf kommt, bevor der Build durch ist. */
  studio: {
    components: { layout: PublishHinweis },
  },

  schema: {
    types: schemaTypes,

    /* Einzeldokumente lassen sich nicht über „Neu" anlegen. Ohne das stünde
       im Menü „Neue Einstellungen", und ein zweites Einstellungsdokument
       würde die Seite still auf das falsche zeigen lassen. */
    /* Einzelseiten lassen sich nicht neu anlegen — es gibt sie schon, sie
       hängen an einer festen ID. Ohne diesen Filter böte „Neu“ an, eine
       zweite Startseite zu erzeugen; die läge dann unter einer zufälligen ID
       und würde von der Website nie gefunden. */
    templates: (vorlagen) =>
      vorlagen.filter(
        (v) => ![...EINZELDOKUMENTE, ...OHNE_ROUTE].includes(v.schemaType)
      ),
  },
});
