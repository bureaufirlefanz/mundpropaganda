import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemaTypes";
import { structure, SINGLETONS, UNROUTED } from "./structure";
import { resolve } from "./structure/locations";
import { PublishNotice } from "./components/PublishNotice";

/**
 * Wo die Website läuft. Lokal der Dev-Server, in der Auslieferung die echte
 * Adresse — gesetzt über SANITY_STUDIO_PREVIEW_URL, damit ein
 * veröffentlichtes Studio nicht auf localhost zeigt.
 */
const WEBSITE =
  process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:4321";

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
     components/PublishNotice.tsx — ohne ihn ist die naheliegende Erklärung
     „es funktioniert nicht", und der Anruf kommt, bevor der Build durch ist. */
  studio: {
    components: { layout: PublishNotice },
  },

  /**
   * Was man mit einem Einzeldokument NICHT tun kann.
   *
   * „Neu" war über die Templates schon abgeschaltet, das Dokumentmenü aber
   * nicht: Löschen, Duplizieren und Veröffentlichung zurückziehen standen bei
   * jedem Einzeldokument offen. Alle drei sind hier still zerstörerisch, weil
   * die Website an der festen ID hängt und keine Rückfälle mehr hat
   * (Aufgabe 4):
   *
   *   Löschen      `settings` weg heißt beim nächsten Build eine Praxisseite
   *                ohne Telefon, ohne Anschrift und ohne Suchmaschinen-
   *                Schalter. Der Build läuft durch, die Seite sieht normal
   *                aus, und die Anschrift fehlt.
   *   Duplizieren  legt ein zweites Dokument unter zufälliger ID an. Die
   *                Website liest weiter das alte; wer im neuen pflegt,
   *                pflegt ins Leere.
   *   Zurückziehen dasselbe wie Löschen, nur reversibel.
   *
   * Sammlungen bleiben unangetastet: Eine Leistung darf gelöscht werden, und
   * Duplizieren ist dort der schnellste Weg zur zwölften.
   */
  document: {
    actions: (prev, context) =>
      [...SINGLETONS, ...UNROUTED].includes(context.schemaType)
        ? prev.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action ?? "",
              ),
          )
        : prev,
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
    templates: (templates) =>
      templates.filter(
        (v) => ![...SINGLETONS, ...UNROUTED].includes(v.schemaType),
      ),
  },
});
