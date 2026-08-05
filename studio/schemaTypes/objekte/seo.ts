import { defineType, defineField } from "sanity";

/**
 * Suchmaschinen-Angaben. Hängt an jedem Dokument, das eine eigene URL hat.
 *
 * Alle Felder sind freiwillig: Fehlt der Titel, nimmt die Seite ihre
 * Überschrift, fehlt die Beschreibung, ihren Einleitungstext. Ein Pflichtfeld
 * hier hieße, dass niemand eine Seite anlegen kann, ohne vorher SEO zu
 * betreiben — und das führt zu Platzhaltern, nicht zu besseren Texten.
 */
export const seo = defineType({
  name: "seo",
  title: "Suchmaschine",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "titel",
      title: "Seitentitel",
      type: "string",
      description:
        "Steht im Browser-Tab und als blaue Zeile im Suchergebnis. 50–60 Zeichen, sonst schneidet Google ab. Leer lassen übernimmt die Überschrift der Seite.",
      validation: (r) => r.max(65).warning("Über 65 Zeichen wird meist abgeschnitten."),
    }),
    defineField({
      name: "beschreibung",
      title: "Beschreibung",
      type: "text",
      rows: 3,
      description:
        "Der graue Text unter dem Titel im Suchergebnis. 120–155 Zeichen. Kein Keyword-Stapel - er wird gelesen, nicht gezählt.",
      validation: (r) => r.max(170).warning("Über 170 Zeichen wird meist abgeschnitten."),
    }),
    /* Bewusst ein ROHES `image` und nicht der `bild`-Typ: Das Open-Graph-Motiv
       wird nie vorgelesen. Es erscheint als Vorschau in Messengern und
       sozialen Netzwerken, nie im Dokument — ein Alternativtext hätte dort
       niemanden, der ihn hört, und der Dekorativ-Haken wäre eine Frage ohne
       Antwort. Das ist die eine Ausnahme von Aufgabe 12. */
    defineField({
      name: "bild",
      title: "Vorschaubild",
      type: "image",
      description:
        "Wird beim Teilen in sozialen Netzwerken und Messengern gezeigt. Querformat, mindestens 1200 × 630 px.",
      options: { hotspot: true },
    }),
    defineField({
      name: "nichtIndexieren",
      title: "Von Suchmaschinen ausschließen",
      type: "boolean",
      description:
        "Setzt „noindex“. Für Seiten, die zwar erreichbar, aber nicht auffindbar sein sollen - etwa eine Landingpage für eine Anzeige.",
      initialValue: false,
    }),
  ],
});
