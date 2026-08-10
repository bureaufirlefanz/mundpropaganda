import { defineType, defineField, defineArrayMember } from "sanity";
import type { ComponentType } from "react";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { BarChartIcon } from "@sanity/icons/BarChart";
import { SplitVerticalIcon } from "@sanity/icons/SplitVertical";
import { ClockIcon } from "@sanity/icons/Clock";
import { UsersIcon } from "@sanity/icons/Users";
import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { OlistIcon } from "@sanity/icons/Olist";
import { TagIcon } from "@sanity/icons/Tag";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

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
   in ihm steht — sonst steht dort zehnmal „Objekt“.
 *
 * Dazu ein Bild oder ein Symbol. In einer Liste von zwölf zugeklappten
 * Abschnitten ist das der Unterschied zwischen Scrollen und Finden: Das Auge
 * springt auf das Motiv, lange bevor es die Zeile gelesen hat.
 *
 * `media` nimmt das erste Bild, das der Abschnitt trägt — bei den Stimmen
 * das Porträt der ersten Stimme, bei einem Bildabschnitt sein Motiv. Wo es
 * keines gibt, steht das Symbol des Typs. Ein Abschnitt ohne beides bekäme
 * ein graues Quadrat, und zwölf graue Quadrate helfen niemandem.
 */
const vorschau = (
  art: string,
  feld = "headline",
  extra: { media?: string; icon?: ComponentType } = {}
) => ({
  /* Nur die drei Schlüssel, die Sanity kennt: `title`, `subtitle`, `media`.
     Eigene Namen sind zwar erlaubt, sobald ein `prepare` sie verarbeitet —
     hier stand aber `unter` und `image` in `select`, während der Rumpf des
     `prepare` `titel` und `bild` las. Ergebnis: Der Titel war immer der
     Typname, das Bild immer das Symbol, und das Studio meldete an jedem
     Abschnitt „invalid preview config". */
  select: {
    title: feld,
    subtitle: "topline",
    ...(extra.media ? { media: extra.media } : {}),
  },
  prepare: ({
    title,
    subtitle,
    media,
  }: {
    title?: string;
    subtitle?: string;
    media?: unknown;
  }) => ({
    title: title || art,
    subtitle: subtitle ? `${art} · ${subtitle}` : art,
    media: media ?? extra.icon,
  }),
});

const topline = defineField({ name: "topline", title: "Topline", type: "string" });
const headline = defineField({ name: "headline", title: "Überschrift", type: "string" });

/* --- Einleitung -------------------------------------------------------- */

export const abschnittIntro = defineType({
  name: "sectionIntro",
  title: "Einleitung",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "columns",
      title: "Textspalten",
      type: "array",
      of: [{ type: "text", rows: 5 }],
      description: "Zwei Absätze nebeneinander. Mehr als zwei wird eng.",
      validation: (r) => r.max(2),
    }),
  ],
  icon: BlockContentIcon,
  preview: vorschau("Einleitung", "headline", { icon: BlockContentIcon }),
});

/* --- Zahlen ------------------------------------------------------------ */

export const abschnittFacts = defineType({
  name: "sectionFacts",
  title: "Zahlen",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "figures",
      title: "Zahlen",
      type: "array",
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
              description: "Steht direkt hinter der Zahl, z. B. „ h“ oder „ %“. Leer lassen, wenn keine.",
            }),
            defineField({ name: "text", title: "Erklärung", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "value", subtitle: "text" },
            prepare: ({ title, subtitle }) => ({ title: String(title ?? ""), subtitle }),
          },
        }),
      ],
      description: "Vier passen in eine Reihe. Nur Angaben, die sich nachrechnen lassen.",
      validation: (r) => r.max(4),
    }),
  ],
  icon: BarChartIcon,
  preview: vorschau("Zahlen", "headline", { icon: BarChartIcon }),
});

/* --- Vergleich --------------------------------------------------------- */

export const abschnittCompare = defineType({
  name: "sectionCompare",
  title: "Vergleichstabelle",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "columns",
      title: "Spalten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "column",
          fields: [
            defineField({ name: "name", title: "Überschrift", type: "string", validation: (r) => r.required() }),
            defineField({ name: "meta", title: "Zusatz", type: "string", description: "Kleine Zeile darunter." }),
            defineField({
              name: "emphasised",
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
      name: "lines",
      title: "Zeilen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "zeile",
          fields: [
            defineField({ name: "name", title: "Merkmal", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "values",
              title: "Werte",
              type: "array",
              description:
                "Ein Eintrag je Spalte, in derselben Reihenfolge. „Ja“ und „Nein“ werden zu Haken und Strich.",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "value",
                  fields: [
                    defineField({
                      name: "kind",
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
                      hidden: ({ parent }) => parent?.kind === "ja" || parent?.kind === "nein",
                    }),
                  ],
                  preview: {
                    select: { kind: "kind", text: "text" },
                    prepare: ({ kind, text }) => ({
                      title: kind === "ja" ? "Ja" : kind === "nein" ? "Nein" : text || "(leer)",
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
      name: "note",
      title: "Kleingedrucktes",
      type: "text",
      rows: 3,
      description:
        "Woher die Angaben stammen. Bei einem Vergleich mit „üblichen“ Bedingungen gehört das dazu - ohne Quelle ist es eine Behauptung.",
    }),
  ],
  icon: SplitVerticalIcon,
  preview: vorschau("Vergleichstabelle", "headline", { icon: SplitVerticalIcon }),
});

/* --- Ablauf als Zeitstrahl --------------------------------------------- */

export const abschnittTimeline = defineType({
  name: "sectionTimeline",
  title: "Zeitstrahl",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "stages",
      title: "Etappen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stage",
          fields: [
            defineField({ name: "marker", title: "Zeitangabe", type: "string", description: "Z. B. „Tag 0“ oder „Woche 2“." }),
            defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "marker" } },
        }),
      ],
      description: "Vier passen nebeneinander. Mehr kippt in die Senkrechte.",
    }),
  ],
  icon: ClockIcon,
  preview: vorschau("Zeitstrahl", "headline", { icon: ClockIcon }),
});

/* --- Stimmen ----------------------------------------------------------- */

export const abschnittVoices = defineType({
  name: "sectionVoices",
  title: "Stimmen",
  type: "object",
  fields: [
    topline,
    headline,
    defineField({
      name: "voices",
      title: "Stimmen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "voice",
          fields: [
            defineField({ name: "quote", title: "Zitat", type: "text", rows: 4, validation: (r) => r.required() }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", title: "Rolle", type: "string" }),
            defineField({ name: "since", title: "Zusatz", type: "string", description: "Z. B. „seit 2019“." }),
            defineField({ name: "image", title: "Bild", type: "picture" }),
            defineField({
              name: "offset",
              title: "Höhenversatz",
              type: "number",
              description: "0 = oben bündig, 1 = ganz abgesenkt. Dazwischen ist erlaubt.",
              initialValue: 0,
              validation: (r) => r.min(0).max(1),
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "image" } },
        }),
      ],
    }),
  ],
  icon: UsersIcon,
  preview: vorschau("Stimmen", "headline", { media: "stimmen.0.picture", icon: UsersIcon }),
});

/* --- Aussage ----------------------------------------------------------- */

export const abschnittStatement = defineType({
  name: "sectionStatement",
  title: "Aussage",
  type: "object",
  fields: [
    topline,
    defineField({ name: "text", title: "Satz", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  icon: BlockquoteIcon,
  preview: vorschau("Aussage", "text", { icon: BlockquoteIcon }),
});

/* --- Schritte ---------------------------------------------------------- */

export const abschnittSchritte = defineType({
  name: "sectionSteps",
  title: "Schritte",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Überschrift", type: "string" }),
    defineField({
      name: "steps",
      title: "Schritte",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "schritt",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
  icon: OlistIcon,
  preview: vorschau("Schritte", "titel", { icon: OlistIcon }),
});

/* --- Preise ------------------------------------------------------------ */

export const abschnittPreise = defineType({
  name: "sectionPricing",
  title: "Preise",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Überschrift", type: "string", initialValue: "Kosten" }),
    defineField({
      name: "pricing",
      title: "Preise",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "price",
          fields: [
            defineField({ name: "name", title: "Bezeichnung", type: "string", validation: (r) => r.required() }),
            defineField({ name: "price", title: "Preisangabe", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "price" } },
        }),
      ],
    }),
  ],
  icon: TagIcon,
  preview: vorschau("Preise", "titel", { icon: TagIcon }),
});

/* --- Häufige Fragen ---------------------------------------------------- */

export const abschnittFaq = defineType({
  name: "sectionFaq",
  title: "Häufige Fragen",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Überschrift", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Zusatzzeile", type: "text", rows: 2 }),
    defineField({
      name: "questions",
      title: "Fragen",
      type: "array",
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
    }),
  ],
  icon: HelpCircleIcon,
  preview: vorschau("Häufige Fragen", "titel", { icon: HelpCircleIcon }),
});

/* --- Kontaktformular --------------------------------------------------- */

export const abschnittKontakt = defineType({
  name: "sectionContact",
  title: "Kontaktformular",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Überschrift", type: "string" }),
    defineField({ name: "text", title: "Zusatzzeile", type: "text", rows: 2 }),
    defineField({
      name: "service",
      title: "Vorausgewählte Leistung",
      type: "string",
      description: "Steht im Auswahlfeld voreingestellt. Leer lassen für keine Vorauswahl.",
    }),
  ],
  icon: EnvelopeIcon,
  preview: vorschau("Kontaktformular", "titel", { icon: EnvelopeIcon }),
});

/**
 * Die Liste selbst. Steht als eigener Typ da, damit mehrere Dokumenttypen
 * denselben Baukasten benutzen, ohne die Aufzählung zu wiederholen.
 */
export const abschnitte = defineType({
  name: "sections",
  title: "Abschnitte",
  type: "array",
  of: [
    { type: "sectionIntro" },
    { type: "sectionFacts" },
    { type: "sectionCompare" },
    { type: "sectionTimeline" },
    { type: "sectionVoices" },
    { type: "sectionStatement" },
    { type: "sectionSteps" },
    { type: "sectionPricing" },
    { type: "sectionFaq" },
    { type: "sectionContact" },
  ],
  options: { insertMenu: { filter: true, views: [{ name: "list" }] } },
});
