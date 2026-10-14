import { defineType, defineField, defineArrayMember } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { TagIcon } from "@sanity/icons/Tag";
import { seoField } from "./objects/seo-field";

/**
 * Eine Leistung (Veneers, Implantate, ...).
 *
 * Alle Bildfelder sind vom Typ `picture`, nicht rohe `image`-Felder. Drei waren
 * es bis Aufgabe 12: Vorschaubild, Hero-Bild und das Bild am Benefits-Eintrag.
 * Sie hatten keinen Alternativtext, keinen Dekorativ-Haken, und eines nicht
 * einmal einen Bildmittelpunkt. Ein Typ, der an drei von acht Stellen nicht
 * benutzt wird, ist schlimmer als keiner — er weckt den Eindruck, das Thema
 * sei erledigt. Bei einer Arztpraxis ist Barrierefreiheit kein Beiwerk.
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
export const service = defineType({
  name: "service",
  title: "Leistung",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "content", title: "Inhalt", default: true },
    { name: "list", title: "Listeneintrag" },
    { name: "seo", title: "SEO" },
  ],
  // Reihenfolge aus der Drag-Liste im Studio.
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "service" }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      description: "Steht als Überschrift im Hero, z. B. „Veneers“.",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      group: "seo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topline",
      title: "Topline",
      type: "string",
      description:
        "Kurze Zeile über der Überschrift, z. B. „Veneers in Berlin“.",
      group: "content",
    }),

    /* --- Listeneintrag ---------------------------------------------------
       Alles, was diese Leistung braucht, um in den Aufzählungen der
       Startseite und im Rahmen aufzutauchen. */

    defineField({
      name: "shortName",
      title: "Name in Listen",
      type: "string",
      description:
        "Wie die Leistung in Services-Tabelle, Menü und Footer heißt. Leer lassen, wenn der Titel passt.",
      group: "list",
    }),

    defineField({
      name: "placement",
      title: "Wo taucht sie auf?",
      type: "string",
      description:
        "Die Tabelle trägt die Hauptleistungen mit Bildvorschau, darunter steht eine schlichtere Linkliste.",
      group: "list",
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
      name: "group",
      title: "Spalte im Menü",
      type: "string",
      description:
        "Bestimmt, unter welcher Überschrift sie im Navigationsmenü steht.",
      group: "list",
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
      description:
        "Steht rechts in der Tabellenzeile, z. B. das Standortkürzel „P25“.",
      group: "list",
      initialValue: "P25",
    }),

    defineField({
      name: "preview",
      title: "Vorschaubild",
      type: "picture",
      description:
        "Hängt am Zeiger, wenn man in der Services-Tabelle über die Zeile fährt. Hochformat wirkt am besten.",
      group: "list",
    }),

    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: false },
      fields: [
        /* Der Anspruch unter dem Leistungsnamen.

           Die Überschrift im Hero ist der Name der Behandlung, einzeln und
           groß — daran hängt die Choreografie, und ein ganzer Satz an dieser
           Stelle liefe ins Bild. Die Textzeile darunter trägt deshalb, wofür
           die Praxis bei dieser Behandlung steht („Wir feilen am Lächeln,
           nicht an der Substanz“). Wahlfrei: Wer keine hat, zeigt keine. */
        defineField({
          name: "claim",
          title: "Anspruch",
          type: "string",
          description:
            "Eine Zeile unter dem Leistungsnamen, z. B. „Wir feilen am Lächeln, nicht an der Substanz“.",
        }),
        defineField({
          name: "text",
          title: "Einleitung",
          type: "text",
          rows: 4,
        }),
        /* Die Beschriftung des Knopfes. Ohne Angabe bleibt es bei „Termin
           buchen" — so steht es auf allen übrigen Leistungsseiten, und ein
           Pflichtfeld hätte elf Dokumente auf einmal auffällig gemacht. */
        defineField({
          name: "actionLabel",
          title: "Beschriftung des Buttons",
          type: "string",
          description:
            "Leer lassen für „Termin buchen“. Der Button springt zum Kontaktabschnitt dieser Seite.",
        }),
        /* The emergency page is the one service whose button must dial, not
           scroll: someone in pain on a phone. A link here replaces the jump
           to the contact section; the website also puts the text before the
           image on narrow screens when it is a `tel:` link. */
        defineField({
          name: "actionLink",
          title: "Ziel des Buttons",
          type: "string",
          description:
            "Leer lassen für den Kontaktabschnitt. Sonst z. B. „tel:+493051999580“ für eine Telefonnummer.",
        }),
        defineField({ name: "image", title: "Bild", type: "picture" }),
      ],
    }),

    defineField({
      name: "intro",
      title: "Intro",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      /* Wahlfrei, aber nicht halb: Der Abschnitt darf fehlen — wer ihn
         anlegt, füllt ihn auch. Eine Überschrift ohne Text wäre die halbe
         Wahrheit statt keiner. Dasselbe gilt für Benefits darunter. */
      fields: [
        defineField({
          name: "topline",
          title: "Topline",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "headline",
          title: "Überschrift",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "columns",
          title: "Textspalten",
          description: "Genau zwei - die Section ist zweispaltig angelegt.",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 5 })],
          validation: (rule) => rule.required().max(2),
        }),
      ],
    }),

    defineField({
      name: "benefits",
      title: "Merkmale und Vorteile",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "topline",
          title: "Topline",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "headline",
          title: "Überschrift",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "items",
          title: "Einträge",
          description:
            "Werden nacheinander aufgeklappt, dazu wechselt das Bild.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "item",
              fields: [
                defineField({
                  name: "name",
                  title: "Name",
                  type: "string",
                  validation: (r) => r.required(),
                }),
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
                defineField({ name: "image", title: "Bild", type: "picture" }),
              ],
              preview: { select: { title: "name", media: "image" } },
            }),
          ],
          validation: (rule) => rule.required().min(2).max(5),
        }),
      ],
    }),

    /* --- Das Erklärstück ------------------------------------------------

       Ein zweiter Intro-Block, weiter unten auf der Seite und mit einem
       randlosen Bild darüber. Er beantwortet die eine Frage, die bei dieser
       Behandlung jeder stellt, bevor er sich meldet — bei Veneers ist das
       „Müssen meine Zähne abgeschliffen werden?“.

       Er stand bis hierher als Platzhaltertext in `templates/Service.astro`,
       ausdrücklich als „noch nicht redigiert“ gekennzeichnet. Jetzt trägt er
       die freigegebene Fassung der Textagentur und gehört damit dorthin, wo
       Inhalt gepflegt wird.

       **Das Motiv bleibt im Baustein.** Es ist eine Entscheidung über den
       Auftritt, keine Pflege — dieselbe Trennung wie bei Benefits, Split und
       Vorher/Nachher, wo die gestalteten Motive neben dem Markup stehen und
       nicht in der Datenschicht. */
    defineField({
      name: "explainer",
      title: "Erklärstück",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      description:
        "Der Textblock mit randlosem Bild, weiter unten auf der Seite. Beantwortet die häufigste Frage zu dieser Behandlung. Ohne Überschrift erscheint er nicht.",
      fields: [
        defineField({
          name: "topline",
          title: "Topline",
          type: "string",
        }),
        defineField({
          name: "headline",
          title: "Überschrift",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "columns",
          title: "Textspalten",
          description:
            "Eine oder zwei. Eine einzelne steht neben der Überschrift, zwei füllen die Zeile.",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 5 })],
          validation: (r) => r.required().min(1).max(2),
        }),
        defineField({
          name: "actionLabel",
          title: "Beschriftung des Buttons",
          type: "string",
          description:
            "Der Button springt zum Kontaktabschnitt. Leer lassen, wenn der Block ohne stehen soll.",
        }),
      ],
    }),

    /* Die Überschrift über den Preiskarten. Ohne Angabe bleibt es bei
       „Kosten“ — der Voreinstellung in `sections/Prices.astro`, die alle
       übrigen Leistungsseiten tragen. */
    defineField({
      name: "pricingTitle",
      title: "Überschrift über den Kosten",
      type: "string",
      group: "content",
      description: "Leer lassen für „Kosten“.",
    }),

    defineField({
      name: "pricing",
      title: "Kosten",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "price",
          fields: [
            defineField({
              name: "name",
              title: "Bezeichnung",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "price",
              title: "Preisangabe",
              type: "string",
              description: "Frei formuliert, z. B. „€ 450,– / Zahn“.",
              /* Pflicht: eine Preiskarte ohne Preis ist keine. */
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "price" } },
        }),
      ],
    }),

    /* The paragraph under the price cards. `sections/Prices.astro` has carried
       the slot (`note`) since the pillar page; the service pages had no field
       for it. The agency copy of October 2026 puts the billing context there
       ("Privatleistung", what the statutory insurance covers) — without it the
       amounts read as final, and they never are. */
    defineField({
      name: "pricingNote",
      title: "Hinweis unter den Kosten",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Ein Absatz unter den Preiskarten, z. B. was die Krankenkasse übernimmt. Leer lassen, wenn nichts zu sagen ist.",
    }),

    defineField({
      name: "faq",
      title: "Häufige Fragen",
      type: "array",
      group: "content",
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
    }),

    /* --- Vier Abschnitte, die die Seite baut und das Schema bisher nicht
       kannte -------------------------------------------------------------

       Sie standen als Beispieldaten in `web/src/lib/fixtures.ts`, und die
       Datenschicht setzte sie bei JEDER Leistung ein — auch bei denen, die
       nichts damit zu tun haben. Auf der Bleaching-Seite stand deshalb „In
       vier Schritten zu neuen Veneers".

       Alle vier sind wahlfrei (Klasse 2): Nicht jede Behandlung hat einen
       Vorher/Nachher-Vergleich oder einen vierstufigen Ablauf. Was fehlt,
       erscheint nicht — es tritt nichts an seine Stelle.

       Die Bilder darin sind wahlfrei mit Rückfall auf das gestaltete Motiv,
       wie bei Split, Experts und Stories auch. */

    defineField({
      name: "beforeAfter",
      title: "Vorher / Nachher",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      description:
        "Zwei Aufnahmen mit Schieberegler. Ohne eigene Bilder stehen hier die gestalteten Motive - laden Sie für diese Behandlung eigene hoch, sonst zeigt der Vergleich fremde Zähne.",
      fields: [
        defineField({
          name: "topline",
          title: "Topline",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "before",
          title: "Aufnahme vorher",
          type: "picture",
        }),
        defineField({
          name: "after",
          title: "Aufnahme nachher",
          type: "picture",
        }),
      ],
    }),

    defineField({
      name: "statement",
      title: "Kernaussage",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      description:
        "Ein einzelner Absatz, größer gesetzt. Trägt eine Aussage, ohne Überschrift zu sein.",
      fields: [
        defineField({
          name: "topline",
          title: "Topline",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 5,
          validation: (r) => r.required(),
        }),
      ],
    }),

    defineField({
      name: "steps",
      title: "Ablauf",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      description: "Der Ablauf der Behandlung als nummerierte Karten.",
      fields: [
        defineField({
          name: "title",
          title: "Überschrift",
          type: "string",
          description: "Zum Beispiel „In vier Schritten zu neuen Veneers“.",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "items",
          title: "Schritte",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "schritt",
              fields: [
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
                /* Wie lange der Termin dauert.

                   Steht abgesetzt unter dem Text, nicht darin: Vier Karten,
                   die alle mit „Dauer: ..." enden, lesen sich als vier
                   Nachklappern statt als eine Angabe, die man vergleichen
                   kann. Wahlfrei — nicht jeder Schritt ist ein Termin. */
                defineField({
                  name: "duration",
                  title: "Dauer",
                  type: "string",
                  description:
                    "Ohne das Wort „Dauer“, z. B. „ca. 30 bis 60 Minuten“.",
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "text",
                  duration: "duration",
                },
                prepare: ({ title, subtitle, duration }) => ({
                  title: title ?? "Ohne Titel",
                  subtitle: [duration, subtitle].filter(Boolean).join(" · "),
                }),
              },
            }),
          ],
          validation: (r) => r.required().min(2),
        }),
      ],
    }),

    defineField({
      name: "features",
      title: "Bild-Text-Zeilen",
      type: "array",
      group: "content",
      description:
        "Abwechselnd Bild links und rechts. Jede zweite Zeile spiegelt von selbst.",
      of: [
        defineArrayMember({
          type: "object",
          name: "featureZeile",
          fields: [
            defineField({
              name: "topline",
              title: "Topline",
              type: "string",
              validation: (r) => r.required(),
            }),
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
              validation: (r) => r.required(),
            }),
            defineField({ name: "image", title: "Bild", type: "picture" }),
          ],
          preview: {
            select: { title: "title", subtitle: "topline", media: "image" },
          },
        }),
      ],
    }),

    /* Dasselbe SEO-Objekt wie bei allen anderen Seiten mit eigener Adresse.
       Vorher stand hier ein nacktes `seoDescription` — eine einzelne
       Zeichenkette. Eine Leistungsseite konnte damit keinen eigenen
       Seitentitel, kein Teilen-Bild und keinen Ausschluss aus dem Suchindex
       haben, obwohl `/leistungen/veneers` die am häufigsten aufgerufene Seite
       nach der Startseite ist.

       Der alte Wert wandert mit `scripts/service-seo.mjs` nach
       `seo.description`. */
    seoField,
  ],

  /* Das Vorschaubild der Liste zeigt, was die Redaktion in der Tabelle sieht.
     Fehlt es, tritt das Hero-Bild ein — sonst bliebe die Zeile im Studio grau,
     obwohl das Dokument ein Bild hat. */
  preview: {
    select: {
      title: "title",
      shortName: "shortName",
      placement: "placement",
      preview: "preview",
      hero: "hero.image",
    },
    prepare: ({ title, shortName, placement, preview, hero }) => {
      const wo = {
        tabelle: "Tabelle",
        liste: "nur Link",
        versteckt: "nur Menü",
      };
      return {
        title: title ?? "Ohne Titel",
        subtitle: [
          shortName && shortName !== title ? shortName : null,
          wo[placement as keyof typeof wo],
        ]
          .filter(Boolean)
          .join(" · "),
        media: preview ?? hero,
      };
    },
  },
});
