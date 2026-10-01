import { defineType, defineField, defineArrayMember } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

/**
 * Die Praxisseite.
 *
 * Ein eigener Typ und kein Baukasten, aus demselben Grund wie bei der
 * Karriereseite: Die Abfolge ist die Aussage. Wer hier landet, will drei
 * Dinge wissen, und zwar in dieser Reihenfolge — wer ihr seid, wofür ihr
 * steht, und wer mich behandeln wird. Ein Baukasten, in dem sich das
 * umstellen lässt, erlaubt Reihenfolgen, die keine dieser Fragen
 * beantworten.
 *
 * ── Was die Seite NICHT selbst trägt ─────────────────────────────────────
 *
 * Das Team-Raster kommt aus der Personen-Sammlung, die Standorte aus den
 * Einstellungen. Beides steht schon woanders, und eine zweite Pflege liefe
 * auseinander: Eine neue Kollegin würde man im Team eintragen und auf der
 * Praxisseite vergessen. Hier stehen nur Topline, Überschrift und Einstieg
 * der jeweiligen Abschnitte.
 */

/** Topline und Überschrift, wie sie jeder Abschnitt trägt. */
const heading = (group: string, prefix: string) => [
  defineField({
    name: `${prefix}Topline`,
    title: "Topline",
    type: "string",
    group,
    validation: (r) => r.required(),
  }),
  defineField({
    name: `${prefix}Headline`,
    title: "Überschrift",
    type: "string",
    group,
    validation: (r) => r.required(),
  }),
];

export const practice = defineType({
  name: "practice",
  title: "Praxis",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "header", title: "Kopf", default: true },
    { name: "story", title: "Die Praxis" },
    { name: "values", title: "Haltung" },
    { name: "locations", title: "Standorte" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* --- Kopf ------------------------------------------------------------ */
    defineField({
      name: "topline",
      title: "Topline",
      type: "string",
      group: "header",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Überschrift",
      type: "string",
      group: "header",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lead",
      title: "Einleitung",
      type: "text",
      rows: 4,
      description: "Zwei bis drei Sätze unter der Überschrift.",
      group: "header",
    }),
    defineField({
      name: "image",
      title: "Kopfbild",
      type: "picture",
      description: "Querformat, über die volle Breite unter der Überschrift.",
      group: "header",
    }),
    /* „Zweites Bild" stand hier bis zum 2026-09-02.

       Es gehörte zu `PracticeHero`, dem früheren Kopf dieser Seite: ein
       Hochformat, versetzt über der rechten Ecke des Kopfbilds. Die Seite
       benutzt seit dem Umbau denselben Kopf wie die Karriereseite, und der
       zeigt ein Bild. Das Feld blieb „vorerst" stehen, damit ein gepflegtes
       Motiv nicht verloren geht — gepflegt war nie eines.

       Ein Feld, dessen Wirkung niemand sehen kann, kostet das Vertrauen in
       jedes andere (Aufgabe 4 in CMS-UMBAU.md). Deshalb weg statt
       „vorerst". */

    /* --- Die Praxis ------------------------------------------------------
       Zwei Textspalten und daneben ein Bild. Der Abschnitt beantwortet
       „wer seid ihr", bevor die Haltung erklärt wird — Behauptungen ohne
       Absender liest niemand. */
    ...heading("story", "story"),
    defineField({
      name: "storyColumns",
      title: "Textspalten",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "Ein bis zwei Absätze.",
      group: "story",
      validation: (r) => r.required().max(2),
    }),
    defineField({
      name: "storyImage",
      title: "Bild",
      type: "picture",
      description: "Die Räume, nicht das Team - das kommt weiter unten.",
      group: "story",
    }),
    defineField({
      name: "figures",
      title: "Zahlen",
      type: "array",
      description:
        "Wenige und überprüfbare Angaben, die neben dem Text stehen. Leer lassen, wenn es keine gibt.",
      group: "story",
      of: [
        defineArrayMember({
          type: "object",
          name: "figure",
          fields: [
            defineField({
              name: "value",
              title: "Zahl",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "text",
              title: "Erläuterung",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "text" } },
        }),
      ],
      validation: (r) => r.max(4),
    }),

    /* --- Haltung ---------------------------------------------------------
       Drei bis fünf Punkte. Weniger als drei wirkt beliebig, mehr als fünf
       liest niemand — und eine Haltung, die aus acht Punkten besteht, ist
       keine. */
    ...heading("values", "values"),
    defineField({
      name: "valuesText",
      title: "Einleitung",
      type: "text",
      rows: 3,
      group: "values",
    }),
    defineField({
      name: "valuesItems",
      title: "Punkte",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          type: "object",
          name: "value",
          fields: [
            defineField({
              name: "title",
              title: "Überschrift",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 4,
              description:
                "Was das konkret heißt. Ohne dieses Wie bleibt die Überschrift eine Floskel.",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
      validation: (r) => r.required().min(3).max(5),
    }),

    /* --- Team ------------------------------------------------------------ */
    /* Hidden, not removed (2026-10-01): the practice page shows a large
       "Team" and group photos (sections/TeamPhotos.astro) instead of the
       name-card grid these fields fed. Removing them would make the Studio
       warn about the values still stored. The people themselves stay
       editable as "Person" documents — their pages still exist. */
    defineField({
      name: "teamTopline",
      title: "Topline",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "teamHeadline",
      title: "Überschrift",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "teamText",
      title: "Einleitung",
      type: "text",
      hidden: true,
    }),
    defineField({
      name: "teamPhoto",
      title: "Teamfoto",
      type: "picture",
      hidden: true,
    }),

    /* --- Standorte ------------------------------------------------------- */
    ...heading("locations", "locations"),
    defineField({
      name: "locationsText",
      title: "Einleitung",
      type: "text",
      rows: 3,
      description:
        "Die Anschriften, Zeiten und die Karte kommen aus den Einstellungen - hier steht nur, was darüber steht.",
      group: "locations",
    }),

    defineField({
      name: "seo",
      title: "Suchmaschine",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Praxis", subtitle: "/praxis" }),
  },
});
