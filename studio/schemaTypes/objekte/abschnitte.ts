import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Der Baukasten für frei zusammengestellte Seiten.
 *
 * Jeder Typ hier entspricht genau einer Komponente im Frontend — die
 * Feldnamen sind dieselben wie deren Eigenschaften. Das ist Absicht: Wer im
 * Studio einen Abschnitt anlegt, soll nicht raten müssen, wie er aussieht,
 * und im Code soll keine Übersetzungsschicht zwischen CMS-Feld und
 * Komponenten-Eigenschaft stehen.
 *
 * Es gibt bewusst KEINEN generischen „Textblock mit Optionen“. Ein Baukasten,
 * in dem sich jeder Abschnitt in jeden anderen verwandeln lässt, produziert
 * Seiten, die aussehen wie nichts. Lieber zehn klar benannte Bausteine.
 */

/* Für die Vorschau in der Liste: Jeder Abschnitt zeigt, was er ist und was
   in ihm steht — sonst steht dort zehnmal „Objekt“. */
const vorschau = (art: string, feld = "headline") => ({
  select: { titel: feld, unter: "topline" },
  prepare: ({ titel, unter }: { titel?: string; unter?: string }) => ({
    title: titel || art,
    subtitle: unter ? `${art} · ${unter}` : art,
  }),
});

const topline = defineField({ name: "topline", title: "Topline", type: "string" });
const headline = defineField({ name: "headline", title: "Überschrift", type: "string" });

/* --- Einleitung -------------------------------------------------------- */

export const abschnittIntro = defineType({
  name: "abschnittIntro",
  title: "Einleitung",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "spalten",
      title: "Textspalten",
      type: "array",
      of: [{ type: "text", rows: 5 }],
      description: "Zwei Absätze nebeneinander. Mehr als zwei wird eng.",
      validation: (r) => r.max(2),
    }),
  ],
  preview: vorschau("Einleitung"),
});

/* --- Zahlen ------------------------------------------------------------ */

export const abschnittFacts = defineType({
  name: "abschnittFacts",
  title: "Zahlen",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "zahlen",
      title: "Zahlen",
      type: "array",
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
              description: "Steht direkt hinter der Zahl, z. B. „ h“ oder „ %“. Leer lassen, wenn keine.",
            }),
            defineField({ name: "text", title: "Erklärung", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "wert", subtitle: "text" },
            prepare: ({ title, subtitle }) => ({ title: String(title ?? ""), subtitle }),
          },
        }),
      ],
      description: "Vier passen in eine Reihe. Nur Angaben, die sich nachrechnen lassen.",
      validation: (r) => r.max(4),
    }),
  ],
  preview: vorschau("Zahlen"),
});

/* --- Vergleich --------------------------------------------------------- */

export const abschnittCompare = defineType({
  name: "abschnittCompare",
  title: "Vergleichstabelle",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "spalten",
      title: "Spalten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "spalte",
          fields: [
            defineField({ name: "name", title: "Überschrift", type: "string", validation: (r) => r.required() }),
            defineField({ name: "meta", title: "Zusatz", type: "string", description: "Kleine Zeile darunter." }),
            defineField({
              name: "betont",
              title: "Hervorheben",
              type: "boolean",
              description: "Legt die Spalte farbig hinterlegt über alle Zeilen. Höchstens eine.",
              initialValue: false,
            }),
          ],
          preview: { select: { title: "name", subtitle: "meta" } },
        }),
      ],
      validation: (r) => r.min(2).max(4),
    }),
    defineField({
      name: "zeilen",
      title: "Zeilen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "zeile",
          fields: [
            defineField({ name: "name", title: "Merkmal", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "werte",
              title: "Werte",
              type: "array",
              description:
                "Ein Eintrag je Spalte, in derselben Reihenfolge. „Ja“ und „Nein“ werden zu Haken und Strich.",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "wert",
                  fields: [
                    defineField({
                      name: "art",
                      title: "Art",
                      type: "string",
                      options: {
                        list: [
                          { title: "Text", value: "text" },
                          { title: "Ja (Haken)", value: "ja" },
                          { title: "Nein (Strich)", value: "nein" },
                          { title: "Hinweis-Pille", value: "pille" },
                        ],
                        layout: "radio",
                      },
                      initialValue: "text",
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
                      title: art === "ja" ? "Ja" : art === "nein" ? "Nein" : text || "(leer)",
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
    }),
    defineField({
      name: "hinweis",
      title: "Kleingedrucktes",
      type: "text",
      rows: 3,
      description:
        "Woher die Angaben stammen. Bei einem Vergleich mit „üblichen“ Bedingungen gehört das dazu - ohne Quelle ist es eine Behauptung.",
    }),
  ],
  preview: vorschau("Vergleichstabelle"),
});

/* --- Ablauf als Zeitstrahl --------------------------------------------- */

export const abschnittTimeline = defineType({
  name: "abschnittTimeline",
  title: "Zeitstrahl",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "etappen",
      title: "Etappen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "etappe",
          fields: [
            defineField({ name: "marke", title: "Zeitangabe", type: "string", description: "Z. B. „Tag 0“ oder „Woche 2“." }),
            defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "titel", subtitle: "marke" } },
        }),
      ],
      description: "Vier passen nebeneinander. Mehr kippt in die Senkrechte.",
    }),
  ],
  preview: vorschau("Zeitstrahl"),
});

/* --- Stimmen ----------------------------------------------------------- */

export const abschnittVoices = defineType({
  name: "abschnittVoices",
  title: "Stimmen",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "stimmen",
      title: "Stimmen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stimme",
          fields: [
            defineField({ name: "zitat", title: "Zitat", type: "text", rows: 4, validation: (r) => r.required() }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "rolle", title: "Rolle", type: "string" }),
            defineField({ name: "dabeiSeit", title: "Zusatz", type: "string", description: "Z. B. „seit 2019“." }),
            defineField({ name: "bild", title: "Bild", type: "bild" }),
            defineField({
              name: "versatz",
              title: "Höhenversatz",
              type: "number",
              description: "0 = oben bündig, 1 = ganz abgesenkt. Dazwischen ist erlaubt.",
              initialValue: 0,
              validation: (r) => r.min(0).max(1),
            }),
          ],
          preview: { select: { title: "name", subtitle: "rolle", media: "bild" } },
        }),
      ],
    }),
  ],
  preview: vorschau("Stimmen"),
});

/* --- Aussage ----------------------------------------------------------- */

export const abschnittStatement = defineType({
  name: "abschnittStatement",
  title: "Aussage",
  type: "object",
  fields: [
    topline,
    defineField({ name: "text", title: "Satz", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: vorschau("Aussage", "text"),
});

/* --- Schritte ---------------------------------------------------------- */

export const abschnittSchritte = defineType({
  name: "abschnittSchritte",
  title: "Schritte",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Überschrift", type: "string" }),
    defineField({
      name: "schritte",
      title: "Schritte",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "schritt",
          fields: [
            defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "titel" } },
        }),
      ],
    }),
  ],
  preview: vorschau("Schritte", "titel"),
});

/* --- Preise ------------------------------------------------------------ */

export const abschnittPreise = defineType({
  name: "abschnittPreise",
  title: "Preise",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Überschrift", type: "string", initialValue: "Kosten" }),
    defineField({
      name: "preise",
      title: "Preise",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "preis",
          fields: [
            defineField({ name: "name", title: "Bezeichnung", type: "string", validation: (r) => r.required() }),
            defineField({ name: "preis", title: "Preisangabe", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "preis" } },
        }),
      ],
    }),
  ],
  preview: vorschau("Preise", "titel"),
});

/* --- Häufige Fragen ---------------------------------------------------- */

export const abschnittFaq = defineType({
  name: "abschnittFaq",
  title: "Häufige Fragen",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Überschrift", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Zusatzzeile", type: "text", rows: 2 }),
    defineField({
      name: "fragen",
      title: "Fragen",
      type: "array",
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
  ],
  preview: vorschau("Häufige Fragen", "titel"),
});

/* --- Kontaktformular --------------------------------------------------- */

export const abschnittKontakt = defineType({
  name: "abschnittKontakt",
  title: "Kontaktformular",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Überschrift", type: "string" }),
    defineField({ name: "text", title: "Zusatzzeile", type: "text", rows: 2 }),
    defineField({
      name: "leistung",
      title: "Vorausgewählte Leistung",
      type: "string",
      description: "Steht im Auswahlfeld voreingestellt. Leer lassen für keine Vorauswahl.",
    }),
  ],
  preview: vorschau("Kontaktformular", "titel"),
});

/**
 * Die Liste selbst. Steht als eigener Typ da, damit mehrere Dokumenttypen
 * denselben Baukasten benutzen, ohne die Aufzählung zu wiederholen.
 */
export const abschnitte = defineType({
  name: "abschnitte",
  title: "Abschnitte",
  type: "array",
  of: [
    { type: "abschnittIntro" },
    { type: "abschnittFacts" },
    { type: "abschnittCompare" },
    { type: "abschnittTimeline" },
    { type: "abschnittVoices" },
    { type: "abschnittStatement" },
    { type: "abschnittSchritte" },
    { type: "abschnittPreise" },
    { type: "abschnittFaq" },
    { type: "abschnittKontakt" },
  ],
  options: { insertMenu: { filter: true, views: [{ name: "list" }] } },
});
