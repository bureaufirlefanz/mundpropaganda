import { defineType, defineField, defineArrayMember } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

/**
 * Die Karriereseite.
 *
 * Ein eigener Typ und keine generische Einzelseite mit Baukasten: Die Seite
 * hat eine feste, gestaltete Abfolge — Hero, Haltung, Zahlen, Vergleich,
 * Stellen, Stimmen, Ablauf, Initiativbewerbung, Fragen. Aus Bausteinen
 * zusammensteckbar wäre sie nur um den Preis, dass sie sich in jede andere
 * Seite verwandeln lässt; die Begründung dafür steht in `sections.ts`.
 *
 * Bis hierher lagen alle diese Inhalte in `web/src/lib/karriere.ts` — 291
 * Zeilen, die der Kunde nicht erreichen konnte. Vier Stellenausschreibungen
 * darunter, die sich weder ändern noch abschalten ließen.
 *
 * **Die Stellen stehen nicht hier.** Sie sind eine eigene Sammlung
 * (`stelle`) und waren es schon, bevor die Seite sie las: mit `kennung`,
 * `aufgaben`, `profil` und einem Haken „Ausgeschrieben“, mit dem sich eine
 * Stelle abschalten lässt, statt sie zu löschen. Eine zweite Liste hier wäre
 * derselbe Fehler wie eine zweite Leistungsliste im Menü.
 */

/* Eine Gruppe je Abschnitt, in der Reihenfolge der Seite — dasselbe Muster
   wie bei der Startseite: Wer den dritten Reiter öffnet, sieht den dritten
   Abschnitt.
   Eine einzige Gruppe „Abschnitte" trug hier zwanzig Felder. Das ist genau
   die flache Liste, die Aufgabe 13 abschafft: Man scrollt an dem vorbei, was
   man sucht, und findet es beim zweiten Mal wieder nicht.
   SEO steht zuletzt. Sonst füllt der Kunde erst Meta-Beschreibungen aus und
   verliert die Lust, bevor er beim Text ist. */
const gruppen = [
  { name: "header", title: "Kopf", default: true },
  { name: "intro", title: "Haltung" },
  { name: "figures", title: "Zahlen" },
  { name: "comparison", title: "Vergleich" },
  { name: "jobs", title: "Stellen" },
  { name: "voices", title: "Stimmen" },
  { name: "process", title: "Ablauf" },
  { name: "application", title: "Bewerbung" },
  { name: "faq", title: "Fragen" },
  { name: "seo", title: "SEO" },
];

/** Topline und Überschrift, wie sie jeder Abschnitt der Seite trägt. */
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

export const karriere = defineType({
  name: "careers",
  title: "Karriere",
  type: "document",
  icon: CaseIcon,
  groups: gruppen,
  fields: [
    /* --- Kopf ----------------------------------------------------------- */
    defineField({ name: "topline", title: "Topline", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Überschrift", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({
      name: "lead",
      title: "Einleitung",
      type: "text",
      rows: 4,
      description: "Der Absatz unter der Überschrift im Kopf der Seite.",
      group: "header",
    }),
    defineField({ name: "image", title: "Kopfbild", type: "picture", group: "header" }),
    defineField({
      name: "action",
      title: "Knopf im Kopf",
      type: "link",
      description:
        "Führt üblicherweise zu den offenen Stellen weiter unten - dafür diese Seite als Ziel wählen und als Sprungmarke „stellen“ eintragen.",
      group: "header",
    }),

    /* --- Haltung -------------------------------------------------------- */
    ...heading("intro", "intro"),
    defineField({
      name: "introColumns",
      title: "Textspalten",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "Genau zwei - der Abschnitt ist zweispaltig angelegt.",
      group: "intro",
      validation: (r) => r.required().max(2),
    }),

    /* --- Zahlen --------------------------------------------------------- */
    ...heading("figures", "figures"),
    defineField({
      name: "figuresItems",
      title: "Zahlen",
      type: "array",
      description:
        "Wenige und überprüfbare Angaben. Eine Karriereseite, die mit „100 % Zufriedenheit“ wirbt, glaubt niemand.",
      group: "figures",
      of: [
        defineArrayMember({
          type: "object",
          name: "figure",
          fields: [
            defineField({ name: "value", title: "Zahl", type: "number", validation: (r) => r.required() }),
            defineField({
              name: "unit",
              title: "Einheit",
              type: "string",
              description: "Steht direkt hinter der Zahl, z. B. „ min“ oder „ %“. Leer lassen für nichts.",
            }),
            defineField({ name: "text", title: "Erläuterung", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { value: "value", unit: "unit", text: "text" },
            prepare: ({ value, unit, text }) => ({ title: `${value ?? "?"}${unit ?? ""}`, subtitle: text }),
          },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),

    /* --- Vergleich ------------------------------------------------------ */
    ...heading("comparison", "comparison"),
    defineField({
      name: "comparisonColumns",
      title: "Spalten",
      type: "array",
      description: "Genau zwei: links das Übliche, rechts der eigene Stand.",
      group: "comparison",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonColumn",
          fields: [
            defineField({ name: "name", title: "Überschrift", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "emphasised",
              title: "Hervorgehoben",
              type: "boolean",
              description: "Für die eigene Spalte.",
              initialValue: false,
            }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
      validation: (r) => r.required().length(2),
    }),
    defineField({
      name: "comparisonRows",
      title: "Zeilen",
      type: "array",
      group: "comparison",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparisonRow",
          fields: [
            defineField({ name: "name", title: "Merkmal", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "values",
              title: "Werte",
              type: "array",
              description: "Einer je Spalte, in derselben Reihenfolge.",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "comparisonValue",
                  fields: [
                    defineField({
                      name: "kind",
                      title: "Darstellung",
                      type: "string",
                      initialValue: "text",
                      options: {
                        list: [
                          { title: "Text", value: "text" },
                          { title: "Haken (enthalten)", value: "ja" },
                          { title: "Strich (nicht enthalten)", value: "nein" },
                          { title: "Pille", value: "pille" },
                        ],
                        layout: "radio",
                      },
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "text",
                      title: "Text",
                      type: "string",
                      hidden: ({ parent }) => parent?.kind === "ja" || parent?.kind === "nein",
                    }),
                  ],
                  preview: {
                    select: { kind: "kind", text: "text" },
                    prepare: ({ kind, text }) => ({
                      title: kind === "ja" ? "✓ enthalten" : kind === "nein" ? "— nicht enthalten" : text || "(leer)",
                    }),
                  },
                }),
              ],
              validation: (r) => r.required().length(2),
            }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "comparisonNote",
      title: "Hinweis unter der Tabelle",
      type: "text",
      rows: 4,
      description:
        "Das Kleingedruckte. Ohne ihn läse sich die linke Spalte wie eine Behauptung über den Wettbewerb - und die wäre weder belegbar noch fair.",
      group: "comparison",
    }),

    /* --- Stellen -------------------------------------------------------- */
    ...heading("jobs", "jobs"),

    /* --- Stimmen -------------------------------------------------------- */
    ...heading("voices", "voices"),
    defineField({
      name: "voicesItems",
      title: "Stimmen",
      type: "array",
      group: "voices",
      of: [
        defineArrayMember({
          type: "object",
          name: "voice",
          fields: [
            defineField({ name: "quote", title: "Zitat", type: "text", rows: 5, validation: (r) => r.required() }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", title: "Rolle", type: "string", validation: (r) => r.required() }),
            defineField({ name: "since", title: "Dabei seit", type: "string", description: "Zum Beispiel „seit 2021“." }),
            defineField({ name: "image", title: "Bild", type: "picture" }),
            defineField({
              name: "offset",
              title: "Versatz",
              type: "number",
              description:
                "Wie tief die Karte hängt: 0 oben bündig, 1 ganz abgesenkt. Der Versatz steckt bewusst in den Daten und nicht in einer Regel nach Position - bei einer vierten Stimme bräuchte die sonst eine Ausnahme.",
              initialValue: 0,
              validation: (r) => r.min(0).max(1),
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "image" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),

    /* --- Ablauf ---------------------------------------------------------
       Ohne Topline, und deshalb nicht über `heading()`: Der Abschnitt trägt
       nur eine Überschrift. Ein Feld, das im Formular steht und auf der Seite
       nichts bewirkt, kostet das Vertrauen in jedes andere — deshalb ist es
       hier entfernt und nicht bloß ausgeblendet. */
    defineField({
      name: "processHeadline",
      title: "Überschrift",
      type: "string",
      group: "process",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "processStages",
      title: "Etappen",
      type: "array",
      group: "process",
      of: [
        defineArrayMember({
          type: "object",
          name: "stage",
          fields: [
            /* Kein `marker` mehr. Das Feld trug Zeitangaben („Tag 0",
               „Woche 2–3", „im Anschluss") über jeder Etappe. Sie sind von
               der Seite entfernt worden, also gehört auch das Feld weg:
               Ein Pflichtfeld, dessen Inhalt nirgends erscheint, kostet das
               Vertrauen in jedes andere. Vorhandene Werte bleiben im
               Datensatz liegen und stören nicht. */
            defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),

    /* --- Initiativbewerbung --------------------------------------------- */
    defineField({ name: "speculativeTopline", title: "Topline", type: "string", group: "application", validation: (r) => r.required() }),
    defineField({ name: "speculativeTitle", title: "Überschrift", type: "string", group: "application", validation: (r) => r.required() }),
    defineField({ name: "speculativeText", title: "Zusatzzeile", type: "text", rows: 3, group: "application" }),
    defineField({ name: "speculativeParagraph", title: "Absatz im Panel", type: "text", rows: 4, group: "application" }),
    defineField({
      name: "applicationEmail",
      title: "Adresse für Bewerbungen",
      type: "string",
      description:
        "Steht an mehreren Stellen der Seite und trägt den Betreff der Bewerbungsmail. Eigene Adresse, nicht die der Praxis aus den Einstellungen.",
      group: "application",
      validation: (r) => r.required().email(),
    }),

    /* --- Fragen --------------------------------------------------------- */
    defineField({ name: "faqTitle", title: "Überschrift der Fragen", type: "string", group: "faq", validation: (r) => r.required() }),
    defineField({
      name: "faq",
      title: "Häufige Fragen",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "questionAnswer",
          fields: [
            defineField({ name: "question", title: "Frage", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", title: "Antwort", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),

    defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" }),
  ],

  preview: { prepare: () => ({ title: "Karriere", subtitle: "/karriere" }) },
});
