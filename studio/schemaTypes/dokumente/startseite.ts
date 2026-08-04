import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * Die Startseite — jeder Abschnitt einzeln pflegbar.
 *
 * Bewusst KEIN Baukasten: Die Reihenfolge der Startseite ist gestaltet, nicht
 * zusammengesteckt. Stattdessen eine Gruppe je Abschnitt, in derselben
 * Reihenfolge, in der sie auf der Seite stehen — wer im Studio den zweiten
 * Reiter öffnet, sieht den zweiten Abschnitt der Seite.
 *
 * Jedes Feld ist freiwillig. Bleibt eines leer, greift der Text, der heute im
 * Baustein steht. Das ist der Unterschied zwischen „ins CMS umgezogen“ und
 * „im CMS kaputtgespart“: Die Seite ist nie leer, auch nicht während der
 * Einrichtung.
 */

const gruppen = [
  { name: "hero", title: "Hero", default: true },
  { name: "split", title: "Über uns" },
  { name: "services", title: "Leistungen" },
  { name: "standards", title: "Standards" },
  { name: "standorte", title: "Standorte" },
  { name: "experten", title: "Team" },
  { name: "stories", title: "Geschichten" },
  { name: "magazin", title: "Magazin" },
  { name: "faq", title: "Fragen" },
  { name: "seo", title: "SEO" },
];

/** Überschrift + Zusatzzeilen, wie sie fast jeder Abschnitt braucht. */
/* Topline und Überschrift tragen ihren Abschnitt — ohne sie beginnt er ohne
   Ansage. Beide sind deshalb Pflicht (Klasse 1). Bis Aufgabe 4 waren sie
   wahlfrei, und ein geleertes Feld fiel still auf den Text im Baustein
   zurück; der Kunde löschte eine Überschrift und sah sie weiter stehen. */
const kopf = (gruppe: string, mitTopline = true) =>
  [
    mitTopline &&
      defineField({
        name: `${gruppe}Topline`,
        title: "Topline",
        type: "string",
        group: gruppe,
        validation: (r) => r.required(),
      }),
    defineField({
      name: `${gruppe}Titel`,
      title: "Überschrift",
      type: "string",
      group: gruppe,
      validation: (r) => r.required(),
    }),
  ].filter(Boolean) as ReturnType<typeof defineField>[];

export const startseite = defineType({
  name: "startseite",
  title: "Startseite",
  type: "document",
  icon: HomeIcon,
  groups: gruppen,
  fields: [
    /* --- Hero ---------------------------------------------------------- */
    defineField({
      name: "heroZeilen",
      title: "Meta-Zeilen",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description:
        "Die beiden kleinen Blöcke links und rechts unter der Wortmarke. Zeilenumbrüche bleiben erhalten. Genau zwei Einträge.",
      validation: (r) => r.max(2),
      group: "hero",
      validation: (r) => r.required(),
    }),

    /* --- Über uns ------------------------------------------------------- */
    ...kopf("split"),
    defineField({
      name: "splitAbsaetze",
      title: "Absätze",
      type: "array",
      of: [{ type: "text", rows: 5 }],
      group: "split",
      validation: (r) => r.required(),
    }),
    defineField({ name: "splitBild", title: "Bild", type: "bild", group: "split" }),

    /* --- Leistungen ----------------------------------------------------- */
    defineField({
      name: "servicesTitel",
      title: "Überschrift",
      type: "string",
      description: "Die Leistungen selbst kommen aus der Collection „Leistungen“ - hier steht nur der Rahmen.",
      group: "services",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "servicesZusatz",
      title: "Weitere Verweise",
      type: "array",
      description: "Die kleineren Links unter der Tabelle, in Spalten gruppiert.",
      group: "services",
      of: [
        defineArrayMember({
          type: "object",
          name: "verweis",
          fields: [
            defineField({ name: "text", title: "Text", type: "string", validation: (r) => r.required() }),
            defineField({ name: "ziel", title: "Ziel", type: "string", description: "Pfad oder Sprungmarke, z. B. /leistungen oder #kontakt." }),
          ],
          preview: { select: { title: "text", subtitle: "ziel" } },
        }),
      ],
    }),

    /* --- Standards ------------------------------------------------------ */
    ...kopf("standards", false),
    defineField({
      name: "standardsEintraege",
      title: "Punkte",
      type: "array",
      description: "Nummeriert in dieser Reihenfolge. Fünf passen gut.",
      group: "standards",
      of: [
        defineArrayMember({
          type: "object",
          name: "standard",
          fields: [
            defineField({ name: "name", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "name", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "standardsBild", title: "Bild", type: "bild", group: "standards" }),

    /* --- Standorte ------------------------------------------------------ */
    defineField({
      name: "standorteTitel",
      title: "Überschrift",
      type: "string",
      description: "Die Adressen selbst stehen in den Einstellungen - sie gelten auch im Seitenfuß.",
      group: "standorte",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "standorteBilder",
      title: "Bilder im Karussell",
      type: "array",
      group: "standorte",
      of: [
        defineArrayMember({
          type: "object",
          name: "ringBild",
          fields: [
            defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() }),
            defineField({ name: "beschriftung", title: "Beschriftung", type: "string", description: "Die Pille im Bild. Leer lassen für keine." }),
          ],
          preview: { select: { title: "beschriftung", media: "bild" }, prepare: ({ title, media }) => ({ title: title || "ohne Beschriftung", media }) },
        }),
      ],
    }),

    /* --- Team ----------------------------------------------------------- */
    ...kopf("experten", false),
    defineField({ name: "expertenText", title: "Text", type: "text", rows: 4, group: "experten" }),
    defineField({ name: "expertenNamen", title: "Namenszeile", type: "string", group: "experten", validation: (r) => r.required() }),
    defineField({ name: "expertenBild", title: "Bild", type: "bild", group: "experten" }),

    /* --- Geschichten ---------------------------------------------------- */
    defineField({
      name: "storiesEintraege",
      title: "Geschichten",
      type: "array",
      description: "Bild, Name und Zitat gehören zusammen - sie wechseln gemeinsam.",
      group: "stories",
      of: [
        defineArrayMember({
          type: "object",
          name: "story",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "bild", title: "Bild", type: "bild" }),
            defineField({ name: "zitat", title: "Zitat", type: "text", rows: 6 }),
          ],
          preview: { select: { title: "name", subtitle: "zitat", media: "bild" } },
        }),
      ],
    }),

    /* --- Magazin -------------------------------------------------------- */
    ...kopf("magazin"),
    defineField({ name: "magazinText", title: "Zusatzzeile", type: "text", rows: 3, group: "magazin", validation: (r) => r.required() }),

    /* --- Fragen --------------------------------------------------------- */
    defineField({ name: "faqTitel", title: "Überschrift", type: "string", group: "faq", validation: (r) => r.required() }),
    defineField({ name: "faqText", title: "Zusatzzeile", type: "text", rows: 2, group: "faq" }),
    defineField({
      name: "faq",
      title: "Fragen",
      type: "array",
      group: "faq",
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

    defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" }),
  ],

  preview: { prepare: () => ({ title: "Startseite", subtitle: "/" }) },
});
