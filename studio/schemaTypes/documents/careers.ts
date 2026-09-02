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
  { name: "video", title: "Video" },
  { name: "figures", title: "Zahlen" },
  { name: "week", title: "4-Tage-Woche" },
  { name: "benefits", title: "Das bekommst du" },
  { name: "comparison", title: "Vergleich" },
  { name: "reasons", title: "Gründe" },
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

export const careers = defineType({
  name: "careers",
  title: "Karriere",
  type: "document",
  icon: CaseIcon,
  groups: gruppen,
  fields: [
    /* --- Kopf ----------------------------------------------------------- */
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
      description: "Der Absatz unter der Überschrift im Kopf der Seite.",
      group: "header",
    }),
    defineField({
      name: "image",
      title: "Kopfbild",
      type: "picture",
      group: "header",
    }),
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

    /* --- Video -----------------------------------------------------------
       Wahlfrei und als Ganzes: Ohne Adresse entfällt der Abschnitt. Ein
       Standbild ohne Video wäre ein Knopf, der nichts tut. */
    defineField({
      name: "videoUrl",
      title: "Adresse des Videos",
      type: "url",
      description:
        "Ein Link zu YouTube, wie er in der Adresszeile steht. Das Video lädt erst, wenn jemand darauf klickt - vorher geht keine Anfrage an YouTube und es wird kein Cookie gesetzt.",
      group: "video",
      validation: (r) =>
        r
          .uri({ scheme: ["http", "https"] })
          .custom((wert) =>
            !wert || /(?:youtube\.com|youtu\.be)/.test(String(wert))
              ? true
              : "Bisher werden nur YouTube-Adressen unterstützt.",
          ),
    }),
    defineField({
      name: "videoTitle",
      title: "Überschrift",
      type: "string",
      description: "Steht über dem Video.",
      group: "video",
    }),
    defineField({
      name: "videoPoster",
      title: "Standbild",
      type: "picture",
      description:
        "Was vor dem Klick zu sehen ist. Leer lassen: dann nimmt die Seite das Vorschaubild von YouTube - das lädt allerdings von einem YouTube-Server, ein eigenes Bild ist datensparsamer.",
      group: "video",
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
            defineField({
              name: "value",
              title: "Zahl",
              type: "number",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "unit",
              title: "Einheit",
              type: "string",
              description:
                "Steht direkt hinter der Zahl, z. B. „ min“ oder „ %“. Leer lassen für nichts.",
            }),
            defineField({
              name: "text",
              title: "Erläuterung",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { value: "value", unit: "unit", text: "text" },
            prepare: ({ value, unit, text }) => ({
              title: `${value ?? "?"}${unit ?? ""}`,
              subtitle: text,
            }),
          },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),

    /* --- 4-Tage-Woche ----------------------------------------------------
       Ein eigener Abschnitt und keine Zeile in der Vorteilsliste: Das ist
       die Angabe, wegen der jemand die Seite überhaupt zu Ende liest. Unter
       fünfzehn Aufzählungspunkten ginge sie unter. */
    ...heading("week", "week"),
    defineField({
      name: "weekText",
      title: "Text",
      type: "text",
      rows: 5,
      group: "week",
      validation: (r) => r.required(),
    }),

    /* --- Das bekommst du -------------------------------------------------
       Eine schlichte Liste. Kein Feld für ein Symbol je Zeile: Fünfzehn
       Piktogramme, die zwischen Müslibar und Fortbildung unterscheiden
       müssten, werden entweder beliebig oder albern. */
    ...heading("benefits", "benefits"),
    defineField({
      name: "benefitsItems",
      title: "Punkte",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Je Zeile ein Punkt. Kurz halten - eine Liste liest niemand als Fließtext.",
      group: "benefits",
      validation: (r) => r.required().min(3),
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
            defineField({
              name: "name",
              title: "Überschrift",
              type: "string",
              validation: (r) => r.required(),
            }),
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
            defineField({
              name: "name",
              title: "Merkmal",
              type: "string",
              validation: (r) => r.required(),
            }),
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
                      hidden: ({ parent }) =>
                        parent?.kind === "ja" || parent?.kind === "nein",
                    }),
                  ],
                  preview: {
                    select: { kind: "kind", text: "text" },
                    prepare: ({ kind, text }) => ({
                      title:
                        kind === "ja"
                          ? "✓ enthalten"
                          : kind === "nein"
                            ? "— nicht enthalten"
                            : text || "(leer)",
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

    /* --- Gründe ----------------------------------------------------------
       Drei Blöcke, die je eine Frage beantworten, die vor einer Bewerbung
       wirklich gestellt wird: Wie komme ich hin, mit wem arbeite ich, wo
       sitze ich. Kein Bild je Block - drei Motive nebeneinander lenken vom
       Text ab, und es sind Antworten, keine Ansichten. */
    ...heading("reasons", "reasons"),
    defineField({
      name: "reasonsItems",
      title: "Blöcke",
      type: "array",
      group: "reasons",
      description: "Zwei bis vier. Bei mehr wird die Reihe eng.",
      of: [
        defineArrayMember({
          type: "object",
          name: "reason",
          fields: [
            defineField({
              name: "title",
              title: "Überschrift",
              type: "string",
              description:
                "Sagt, worum es im Block geht. Keine Suchbegriffe - „Familien Zahnarzt Berlin“ über einem Text zum Team liest sich wie ein Versehen, und genau so war es auf der alten Seite.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
      validation: (r) => r.required().min(2).max(4),
    }),

    /* --- Stellen -------------------------------------------------------- */
    ...heading("jobs", "jobs"),
    defineField({
      name: "jobsText",
      title: "Einleitung über der Liste",
      type: "text",
      rows: 5,
      description:
        "Der Anspruch, aus dem sich die Anforderungen ergeben. Steht über den Ausschreibungen, damit die Aufzählungen darunter nicht wie eine Wunschliste ohne Begründung wirken.",
      group: "jobs",
    }),

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
            defineField({
              name: "quote",
              title: "Zitat",
              type: "text",
              rows: 5,
              validation: (r) => r.required(),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "role",
              title: "Rolle",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "since",
              title: "Dabei seit",
              type: "string",
              description: "Zum Beispiel „seit 2021“.",
            }),
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
          preview: {
            select: { title: "name", subtitle: "role", media: "image" },
          },
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
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
      validation: (r) => r.required().min(2),
    }),

    /* --- Initiativbewerbung --------------------------------------------- */
    defineField({
      name: "speculativeTopline",
      title: "Topline",
      type: "string",
      group: "application",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "speculativeTitle",
      title: "Überschrift",
      type: "string",
      group: "application",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "speculativeText",
      title: "Zusatzzeile",
      type: "text",
      rows: 3,
      group: "application",
    }),
    defineField({
      name: "speculativeParagraph",
      title: "Absatz im Panel",
      type: "text",
      rows: 4,
      group: "application",
    }),
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
    defineField({
      name: "faqTitle",
      title: "Überschrift der Fragen",
      type: "string",
      group: "faq",
      validation: (r) => r.required(),
    }),
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
            defineField({
              name: "question",
              title: "Frage",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Antwort",
              type: "text",
              rows: 4,
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),

    defineField({
      name: "seo",
      title: "Suchmaschine",
      type: "seo",
      group: "seo",
    }),
  ],

  preview: { prepare: () => ({ title: "Karriere", subtitle: "/karriere" }) },
});
