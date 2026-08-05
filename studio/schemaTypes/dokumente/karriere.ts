import { defineType, defineField, defineArrayMember } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

/**
 * Die Karriereseite.
 *
 * Ein eigener Typ und keine generische Einzelseite mit Baukasten: Die Seite
 * hat eine feste, gestaltete Abfolge — Hero, Haltung, Zahlen, Vergleich,
 * Stellen, Stimmen, Ablauf, Initiativbewerbung, Fragen. Aus Bausteinen
 * zusammensteckbar wäre sie nur um den Preis, dass sie sich in jede andere
 * Seite verwandeln lässt; die Begründung dafür steht in `abschnitte.ts`.
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
  { name: "kopf", title: "Kopf", default: true },
  { name: "intro", title: "Haltung" },
  { name: "zahlen", title: "Zahlen" },
  { name: "vergleich", title: "Vergleich" },
  { name: "stellen", title: "Stellen" },
  { name: "stimmen", title: "Stimmen" },
  { name: "ablauf", title: "Ablauf" },
  { name: "bewerbung", title: "Bewerbung" },
  { name: "faq", title: "Fragen" },
  { name: "seo", title: "SEO" },
];

/** Topline und Überschrift, wie sie jeder Abschnitt der Seite trägt. */
const kopf = (gruppe: string, praefix: string) => [
  defineField({
    name: `${praefix}Topline`,
    title: "Topline",
    type: "string",
    group: gruppe,
    validation: (r) => r.required(),
  }),
  defineField({
    name: `${praefix}Headline`,
    title: "Überschrift",
    type: "string",
    group: gruppe,
    validation: (r) => r.required(),
  }),
];

export const karriere = defineType({
  name: "karriere",
  title: "Karriere",
  type: "document",
  icon: CaseIcon,
  groups: gruppen,
  fields: [
    /* --- Kopf ----------------------------------------------------------- */
    defineField({ name: "topline", title: "Topline", type: "string", group: "kopf", validation: (r) => r.required() }),
    defineField({ name: "titel", title: "Überschrift", type: "string", group: "kopf", validation: (r) => r.required() }),
    defineField({
      name: "einleitung",
      title: "Einleitung",
      type: "text",
      rows: 4,
      description: "Der Absatz unter der Überschrift im Kopf der Seite.",
      group: "kopf",
    }),
    defineField({ name: "bild", title: "Kopfbild", type: "bild", group: "kopf" }),
    defineField({
      name: "aktion",
      title: "Knopf im Kopf",
      type: "link",
      description:
        "Führt üblicherweise zu den offenen Stellen weiter unten - dafür diese Seite als Ziel wählen und als Sprungmarke „stellen“ eintragen.",
      group: "kopf",
    }),

    /* --- Haltung -------------------------------------------------------- */
    ...kopf("intro", "intro"),
    defineField({
      name: "introSpalten",
      title: "Textspalten",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "Genau zwei - der Abschnitt ist zweispaltig angelegt.",
      group: "intro",
      validation: (r) => r.required().max(2),
    }),

    /* --- Zahlen --------------------------------------------------------- */
    ...kopf("zahlen", "zahlen"),
    defineField({
      name: "zahlenEintraege",
      title: "Zahlen",
      type: "array",
      description:
        "Wenige und überprüfbare Angaben. Eine Karriereseite, die mit „100 % Zufriedenheit“ wirbt, glaubt niemand.",
      group: "zahlen",
      of: [
        defineArrayMember({
          type: "object",
          name: "zahl",
          fields: [
            defineField({ name: "wert", title: "Zahl", type: "number", validation: (r) => r.required() }),
            defineField({
              name: "einheit",
              title: "Einheit",
              type: "string",
              description: "Steht direkt hinter der Zahl, z. B. „ min“ oder „ %“. Leer lassen für nichts.",
            }),
            defineField({ name: "text", title: "Erläuterung", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { wert: "wert", einheit: "einheit", text: "text" },
            prepare: ({ wert, einheit, text }) => ({ title: `${wert ?? "?"}${einheit ?? ""}`, subtitle: text }),
          },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),

    /* --- Vergleich ------------------------------------------------------ */
    ...kopf("vergleich", "vergleich"),
    defineField({
      name: "vergleichSpalten",
      title: "Spalten",
      type: "array",
      description: "Genau zwei: links das Übliche, rechts der eigene Stand.",
      group: "vergleich",
      of: [
        defineArrayMember({
          type: "object",
          name: "vergleichSpalte",
          fields: [
            defineField({ name: "name", title: "Überschrift", type: "string", validation: (r) => r.required() }),
            defineField({ name: "meta", title: "Zusatz", type: "string", description: "Die kleine Zeile darunter." }),
            defineField({
              name: "betont",
              title: "Hervorgehoben",
              type: "boolean",
              description: "Für die eigene Spalte.",
              initialValue: false,
            }),
          ],
          preview: { select: { title: "name", subtitle: "meta" } },
        }),
      ],
      validation: (r) => r.required().length(2),
    }),
    defineField({
      name: "vergleichZeilen",
      title: "Zeilen",
      type: "array",
      group: "vergleich",
      of: [
        defineArrayMember({
          type: "object",
          name: "vergleichZeile",
          fields: [
            defineField({ name: "name", title: "Merkmal", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "werte",
              title: "Werte",
              type: "array",
              description: "Einer je Spalte, in derselben Reihenfolge.",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "vergleichWert",
                  fields: [
                    defineField({
                      name: "art",
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
                      hidden: ({ parent }) => parent?.art === "ja" || parent?.art === "nein",
                    }),
                  ],
                  preview: {
                    select: { art: "art", text: "text" },
                    prepare: ({ art, text }) => ({
                      title: art === "ja" ? "✓ enthalten" : art === "nein" ? "— nicht enthalten" : text || "(leer)",
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
      name: "vergleichHinweis",
      title: "Hinweis unter der Tabelle",
      type: "text",
      rows: 4,
      description:
        "Das Kleingedruckte. Ohne ihn läse sich die linke Spalte wie eine Behauptung über den Wettbewerb - und die wäre weder belegbar noch fair.",
      group: "vergleich",
    }),

    /* --- Stellen -------------------------------------------------------- */
    ...kopf("stellen", "stellen"),

    /* --- Stimmen -------------------------------------------------------- */
    ...kopf("stimmen", "stimmen"),
    defineField({
      name: "stimmenEintraege",
      title: "Stimmen",
      type: "array",
      group: "stimmen",
      of: [
        defineArrayMember({
          type: "object",
          name: "stimme",
          fields: [
            defineField({ name: "zitat", title: "Zitat", type: "text", rows: 5, validation: (r) => r.required() }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "rolle", title: "Rolle", type: "string", validation: (r) => r.required() }),
            defineField({ name: "dabeiSeit", title: "Dabei seit", type: "string", description: "Zum Beispiel „seit 2021“." }),
            defineField({ name: "bild", title: "Bild", type: "bild" }),
            defineField({
              name: "versatz",
              title: "Versatz",
              type: "number",
              description:
                "Wie tief die Karte hängt: 0 oben bündig, 1 ganz abgesenkt. Der Versatz steckt bewusst in den Daten und nicht in einer Regel nach Position - bei einer vierten Stimme bräuchte die sonst eine Ausnahme.",
              initialValue: 0,
              validation: (r) => r.min(0).max(1),
            }),
          ],
          preview: { select: { title: "name", subtitle: "rolle", media: "bild" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),

    /* --- Ablauf --------------------------------------------------------- */
    ...kopf("ablauf", "ablauf"),
    defineField({
      name: "ablaufEtappen",
      title: "Etappen",
      type: "array",
      group: "ablauf",
      of: [
        defineArrayMember({
          type: "object",
          name: "etappe",
          fields: [
            defineField({ name: "marke", title: "Marke", type: "string", description: "Zum Beispiel „Tag 0“ oder „Woche 2–3“.", validation: (r) => r.required() }),
            defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "titel", subtitle: "marke" } },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),

    /* --- Initiativbewerbung --------------------------------------------- */
    defineField({ name: "initiativTopline", title: "Topline", type: "string", group: "bewerbung", validation: (r) => r.required() }),
    defineField({ name: "initiativTitel", title: "Überschrift", type: "string", group: "bewerbung", validation: (r) => r.required() }),
    defineField({ name: "initiativText", title: "Zusatzzeile", type: "text", rows: 3, group: "bewerbung" }),
    defineField({ name: "initiativAbsatz", title: "Absatz im Panel", type: "text", rows: 4, group: "bewerbung" }),
    defineField({
      name: "bewerbungMail",
      title: "Adresse für Bewerbungen",
      type: "string",
      description:
        "Steht an mehreren Stellen der Seite und trägt den Betreff der Bewerbungsmail. Eigene Adresse, nicht die der Praxis aus den Einstellungen.",
      group: "bewerbung",
      validation: (r) => r.required().email(),
    }),

    /* --- Fragen --------------------------------------------------------- */
    defineField({ name: "faqTitel", title: "Überschrift der Fragen", type: "string", group: "faq", validation: (r) => r.required() }),
    defineField({
      name: "faq",
      title: "Häufige Fragen",
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
      validation: (r) => r.required().min(1),
    }),

    defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" }),
  ],

  preview: { prepare: () => ({ title: "Karriere", subtitle: "/karriere" }) },
});
