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
  select: { titel: feld, unter: "topline", ...(extra.media ? { bild: extra.media } : {}) },
  prepare: ({ titel, unter, bild }: { titel?: string; unter?: string; bild?: unknown }) => ({
    title: titel || art,
    subtitle: unter ? `${art} · ${unter}` : art,
    media: bild ?? extra.icon,
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
  icon: BlockContentIcon,
  preview: vorschau("Einleitung", "headline", { icon: BlockContentIcon }),
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
  icon: BarChartIcon,
  preview: vorschau("Zahlen", "headline", { icon: BarChartIcon }),
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
  icon: SplitVerticalIcon,
  preview: vorschau("Vergleichstabelle", "headline", { icon: SplitVerticalIcon }),
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
  icon: ClockIcon,
  preview: vorschau("Zeitstrahl", "headline", { icon: ClockIcon }),
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
  icon: UsersIcon,
  preview: vorschau("Stimmen", "headline", { media: "stimmen.0.bild", icon: UsersIcon }),
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
  icon: BlockquoteIcon,
  preview: vorschau("Aussage", "text", { icon: BlockquoteIcon }),
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
  icon: OlistIcon,
  preview: vorschau("Schritte", "titel", { icon: OlistIcon }),
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
  icon: TagIcon,
  preview: vorschau("Preise", "titel", { icon: TagIcon }),
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
  icon: HelpCircleIcon,
  preview: vorschau("Häufige Fragen", "titel", { icon: HelpCircleIcon }),
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
  icon: EnvelopeIcon,
  preview: vorschau("Kontaktformular", "titel", { icon: EnvelopeIcon }),
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
