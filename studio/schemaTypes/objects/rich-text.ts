import { defineArrayMember, defineField } from "sanity";

/**
 * Fließtext — überall dort, wo der Kunde längere Texte schreibt.
 *
 * **Begrenzt, und das ist keine Bevormundung.** Sanity liefert von Haus aus
 * H1 bis H4, Zitat, Code, Unterstreichung, Durchgestrichen und nummerierte
 * Listen mit. Wer das zur Verfügung hat, benutzt es — und danach sieht die
 * Seite aus wie 2009, weil sechs Überschriftengrade auf eine Typo-Skala mit
 * dreien treffen.
 *
 * Was bleibt, ist das, wofür es im Layout eine Entsprechung gibt:
 *
 *   Absatz, Zwischentitel (h2), Unterpunkt (h3)
 *   fett, kursiv
 *   Aufzählung
 *   Link
 *
 * **Kein h1.** Den setzt die Seite aus dem Titel des Dokuments. Zwei h1 in
 * einem Dokument sind für Vorlesegeräte und Suchmaschinen ein Fehler, und der
 * Redaktion ist nicht anzusehen, dass sie gerade einen macht.
 *
 * Keine Farben, keine Schriftgrößen: Beides gehört zu den Tokens und nicht in
 * ein Textfeld. Die Zusage dahinter ist, dass jede Eingabe gut aussehen wird —
 * die lässt sich nur halten, wenn die Auswahl klein ist.
 */
export const fliesstext = defineArrayMember({
  type: "block",

  styles: [
    { title: "Absatz", value: "normal" },
    { title: "Zwischentitel", value: "h2" },
    { title: "Unterpunkt", value: "h3" },
  ],

  lists: [{ title: "Aufzählung", value: "bullet" }],

  marks: {
    decorators: [
      { title: "Fett", value: "strong" },
      { title: "Kursiv", value: "em" },
    ],
    annotations: [
      defineField({
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "Adresse",
            type: "url",
            description: "Vollständig, mit https:// - oder ein Pfad dieser Website, z. B. /leistungen/veneers.",
            validation: (r) =>
              r
                .required()
                .uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
          }),
        ],
      }),
    ],
  },
});
