import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemaTypes";
import { structure, EINZELDOKUMENTE } from "./structure";
import { dokumentAnsichten } from "./structure/dokumentAnsichten";

// Eigenständiges Studio, nicht in die Astro-App eingebettet: Redaktion und
// Auslieferung bleiben dadurch getrennt deploybar.
export default defineConfig({
  name: "default",
  title: "Mundpropaganda",

  projectId: "a6bjftwf",
  dataset: "production",

  plugins: [
    // Aufbau der Seitenleiste und die Reiter am Dokument liegen in structure/.
    structureTool({ structure, defaultDocumentNode: dokumentAnsichten }),

    // Abfragen ausprobieren, ohne die Seite zu bauen. Bleibt im Studio, geht
    // nicht in die Auslieferung.
    visionTool({ defaultApiVersion: "2026-07-28" }),
  ],

  schema: {
    types: schemaTypes,

    /* Einzeldokumente lassen sich nicht über „Neu" anlegen. Ohne das stünde
       im Menü „Neue Einstellungen", und ein zweites Einstellungsdokument
       würde die Seite still auf das falsche zeigen lassen. */
    /* Einzelseiten lassen sich nicht neu anlegen — es gibt sie schon, sie
       hängen an einer festen ID. Ohne diesen Filter böte „Neu“ an, eine
       zweite Startseite zu erzeugen; die läge dann unter einer zufälligen ID
       und würde von der Website nie gefunden. */
    templates: (vorlagen) => vorlagen.filter((v) => !EINZELDOKUMENTE.includes(v.schemaType)),
  },
});
