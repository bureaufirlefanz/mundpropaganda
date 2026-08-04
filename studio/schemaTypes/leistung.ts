import { defineType, defineField, defineArrayMember } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { TagIcon } from "@sanity/icons/Tag";

/**
 * Eine Leistung (Veneers, Implantate, ...).
 *
 * Zwei Rollen in einem Dokument:
 *
 *  1. **Die eigene Seite.** Der Zuschnitt folgt den Abschnitten, die sie
 *     tatsächlich hat, statt einer abstrakten Feldsammlung — die Redaktion
 *     pflegt das, was sie auf der Seite wiedererkennt.
 *  2. **Der Eintrag in Listen.** Services-Tabelle, Navigations-Menü und Footer
 *     zählen dieselben Leistungen auf. Sie standen dreimal von Hand im Markup;
 *     jetzt kommen sie aus diesem Dokument. Dafür die Gruppe „Listeneintrag".
 */
export const leistung = defineType({
  name: "leistung",
  title: "Leistung",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "inhalt", title: "Inhalt", default: true },
    { name: "liste", title: "Listeneintrag" },
    { name: "seo", title: "SEO" },
  ],
  // Reihenfolge aus der Drag-Liste im Studio.
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "leistung" }),
    defineField({
      name: "titel",
      title: "Titel",
      type: "string",
      description: "Steht als Überschrift im Hero, z. B. „Veneers“.",
      group: "inhalt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titel", maxLength: 96 },
      group: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topline",
      title: "Topline",
      type: "string",
      description: "Kurze Zeile über der Überschrift, z. B. „Veneers in Berlin“.",
      group: "inhalt",
    }),

    /* --- Listeneintrag ---------------------------------------------------
       Alles, was diese Leistung braucht, um in den Aufzählungen der
       Startseite und im Rahmen aufzutauchen. */

    defineField({
      name: "kurzname",
      title: "Name in Listen",
      type: "string",
      description:
        "Wie die Leistung in Services-Tabelle, Menü und Footer heißt. Leer lassen, wenn der Titel passt.",
      group: "liste",
    }),

    defineField({
      name: "platzierung",
      title: "Wo taucht sie auf?",
      type: "string",
      description:
        "Die Tabelle trägt die Hauptleistungen mit Bildvorschau, darunter steht eine schlichtere Linkliste.",
      group: "liste",
      initialValue: "tabelle",
      options: {
        list: [
          { title: "Services-Tabelle (mit Vorschaubild)", value: "tabelle" },
          { title: "Nur als Link darunter", value: "liste" },
          { title: "Gar nicht", value: "versteckt" },
        ],
        layout: "radio",
      },
    }),

    defineField({
      name: "gruppe",
      title: "Spalte im Menü",
      type: "string",
      description: "Bestimmt, unter welcher Überschrift sie im Navigationsmenü steht.",
      group: "liste",
      options: {
        list: [
          { title: "Ästhetik", value: "aesthetik" },
          { title: "Zahnersatz", value: "zahnersatz" },
          { title: "Behandlung", value: "behandlung" },
        ],
        layout: "radio",
      },
    }),

    defineField({
      name: "tag",
      title: "Kürzel",
      type: "string",
      description: "Steht rechts in der Tabellenzeile, z. B. das Standortkürzel „P25“.",
      group: "liste",
      initialValue: "P25",
    }),

    defineField({
      name: "vorschau",
      title: "Vorschaubild",
      type: "image",
      description:
        "Hängt am Zeiger, wenn man in der Services-Tabelle über die Zeile fährt. Hochformat wirkt am besten.",
      options: { hotspot: true },
      group: "liste",
    }),

    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "inhalt",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "text", title: "Einleitung", type: "text", rows: 4 }),
        defineField({
          name: "bild",
          title: "Bild",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alternativtext", type: "string" })],
        }),
      ],
    }),

    defineField({
      name: "intro",
      title: "Intro",
      type: "object",
      group: "inhalt",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "topline", title: "Topline", type: "string" }),
        defineField({ name: "headline", title: "Überschrift", type: "string" }),
        defineField({
          name: "spalten",
          title: "Textspalten",
          description: "Genau zwei - die Section ist zweispaltig angelegt.",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 5 })],
          validation: (rule) => rule.max(2),
        }),
      ],
    }),

    defineField({
      name: "benefits",
      title: "Merkmale und Vorteile",
      type: "object",
      group: "inhalt",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "topline", title: "Topline", type: "string" }),
        defineField({ name: "headline", title: "Überschrift", type: "string" }),
        defineField({
          name: "eintraege",
          title: "Einträge",
          description: "Werden nacheinander aufgeklappt, dazu wechselt das Bild.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "eintrag",
              fields: [
                defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "text",
                  title: "Text",
                  type: "text",
                  rows: 4,
                  /* Pflicht: Ein Eintrag ohne Text klappt auf und zeigt nichts.
                     Bis Aufgabe 1 war das Feld wahlfrei, während der Vertrag im
                     Frontend `string` verlangte — TypeGen hat den Widerspruch
                     aufgedeckt. */
                  validation: (r) => r.required(),
                }),
                defineField({ name: "bild", title: "Bild", type: "image", options: { hotspot: true } }),
              ],
              preview: { select: { title: "name", media: "bild" } },
            }),
          ],
          validation: (rule) => rule.min(2).max(5),
        }),
      ],
    }),

    defineField({
      name: "preise",
      title: "Kosten",
      type: "array",
      group: "inhalt",
      of: [
        defineArrayMember({
          type: "object",
          name: "preis",
          fields: [
            defineField({ name: "name", title: "Bezeichnung", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "preis",
              title: "Preisangabe",
              type: "string",
              description: "Frei formuliert, z. B. „€ 450,– / Zahn“.",
              /* Pflicht: eine Preiskarte ohne Preis ist keine. */
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "preis" } },
        }),
      ],
    }),

    defineField({
      name: "faq",
      title: "Häufige Fragen",
      type: "array",
      group: "inhalt",
      of: [
        defineArrayMember({
          type: "object",
          name: "frageAntwort",
          fields: [
            defineField({ name: "frage", title: "Frage", type: "string", validation: (r) => r.required() }),
            defineField({ name: "antwort", title: "Antwort", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "frage" } },
        }),
      ],
    }),

    defineField({
      name: "seoBeschreibung",
      title: "Meta-Beschreibung",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (rule) => rule.max(160).warning("Über 160 Zeichen kürzt Google ab."),
    }),
  ],

  /* Das Vorschaubild der Liste zeigt, was die Redaktion in der Tabelle sieht.
     Fehlt es, tritt das Hero-Bild ein — sonst bliebe die Zeile im Studio grau,
     obwohl das Dokument ein Bild hat. */
  preview: {
    select: {
      title: "titel",
      kurzname: "kurzname",
      platzierung: "platzierung",
      vorschau: "vorschau",
      hero: "hero.bild",
    },
    prepare: ({ title, kurzname, platzierung, vorschau, hero }) => {
      const wo = { tabelle: "Tabelle", liste: "nur Link", versteckt: "nur Menü" };
      return {
        title: title ?? "Ohne Titel",
        subtitle: [kurzname && kurzname !== title ? kurzname : null, wo[platzierung as keyof typeof wo]]
          .filter(Boolean)
          .join(" · "),
        media: vorschau ?? hero,
      };
    },
  },
});
