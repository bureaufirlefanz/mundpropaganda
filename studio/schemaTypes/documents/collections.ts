import { defineType, defineField, defineArrayMember } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { UserIcon } from "@sanity/icons/User";
import { CaseIcon } from "@sanity/icons/Case";
import { HeartIcon } from "@sanity/icons/Heart";
import { slugAvailable, slugIsFree, RESERVED_SLUGS } from "../../lib/paths";
import { blockContentMember, inlineImageMember } from "../objects/rich-text";
import { seoField } from "../objects/seo-field";

/**
 * Die Sammlungen: Typen, von denen es beliebig viele gibt.
 *
 * Beitrag und Pillar Page tragen beide eine eigene URL. Der Unterschied liegt
 * in der Ebene — ein Beitrag liegt unter /magazin/, eine Pillar Page direkt
 * auf der obersten. Warum, steht in lib/paths.ts.
 */

const gruppen = [
  { name: "content", title: "Inhalt", default: true },
  { name: "seo", title: "SEO" },
];

/* --- Magazinbeitrag ----------------------------------------------------- */

export const post = defineType({
  name: "post",
  title: "Magazinbeitrag",
  type: "document",
  icon: DocumentTextIcon,
  groups: gruppen,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description:
        "Ergibt /magazin/<slug>. Kleinschreibung, Bindestriche, keine Umlaute.",
      options: { source: "title", maxLength: 72 },
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "date",
      title: "Veröffentlicht am",
      type: "date",
      description: "Bestimmt die Reihenfolge im Magazin - neueste zuerst.",
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "Behandlung", value: "behandlung" },
          { title: "Vorsorge", value: "vorsorge" },
          { title: "Material & Technik", value: "technik" },
          { title: "Praxis", value: "praxis" },
        ],
      },
      group: "content",
    }),
    defineField({
      name: "author",
      title: "Verfasst von",
      type: "reference",
      to: [{ type: "person" }],
      description:
        "Wer den Beitrag geschrieben hat. Erscheint mit Rolle unter dem Titel. Ohne Angabe steht dort nichts - kein „Redaktion“ als Notbehelf.",
      group: "content",
    }),

    defineField({
      name: "service",
      title: "Gehört zu Leistung",
      type: "reference",
      to: [{ type: "service" }],
      description:
        "Verknüpft den Beitrag mit einer Leistung. Dadurch kann die Leistungsseite passende Beiträge zeigen, ohne dass jemand sie dort einzeln einträgt.",
      group: "content",
    }),
    defineField({
      name: "previewImage",
      title: "Vorschaubild",
      type: "picture",
      group: "content",
    }),
    defineField({
      name: "lead",
      title: "Anrisstext",
      type: "text",
      rows: 3,
      description: "Steht auf der Karte im Magazin. Zwei Sätze.",
      group: "content",
    }),
    defineField({
      name: "text",
      title: "Beitrag",
      type: "array",
      of: [blockContentMember, inlineImageMember],
      group: "content",
    }),
    seoField,
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date", media: "previewImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date
        ? new Date(date).toLocaleDateString("de-DE")
        : "ohne Datum",
      media,
    }),
  },
});

/* --- Pillar Page -------------------------------------------------------- */

export const pillar = defineType({
  name: "pillar",
  title: "Pillar Page",
  type: "document",
  icon: BlockContentIcon,
  groups: gruppen,
  fields: [
    defineField({
      name: "title",
      title: "Überschrift",
      type: "string",
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description:
        "Liegt auf der obersten Ebene: /<slug>. Das ist Absicht - eine Pillar Page ist auf ein Suchwort gebaut, jedes Verzeichnis davor verwässert es.",
      /* `isUnique` gegen BEIDE Typen der obersten Ebene, nicht nur gegen den
         eigenen: Ein Rechtstext mit demselben Slug beanspruchte dieselbe
         Adresse, und Sanitys eingebaute Prüfung sähe ihn nicht. */
      options: { source: "title", maxLength: 72, isUnique: slugIsFree },
      validation: (r) =>
        r
          .required()
          .custom((wert) =>
            slugAvailable(wert?.current)
              ? true
              : `„${wert?.current}“ ist ein fester Pfad der Website. Reserviert: ${RESERVED_SLUGS.join(", ")}.`,
          ),
      group: "content",
    }),
    defineField({
      name: "topline",
      title: "Topline",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "lead",
      title: "Einleitung",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "image",
      title: "Kopfbild",
      type: "picture",
      group: "content",
    }),
    defineField({
      name: "sections",
      title: "Abschnitte",
      type: "sections",
      description:
        "Der Aufbau der Seite. Abschnitte lassen sich ziehen und umstellen.",
      group: "content",
    }),
    seoField,
  ],
  preview: {
    select: { title: "title", slug: "slug.current", media: "image" },
    prepare: ({ title, slug, media }) => ({
      title,
      subtitle: slug ? `/${slug}` : "ohne URL",
      media,
    }),
  },
});

/* --- Rechtstexte -------------------------------------------------------- */

export const legalPage = defineType({
  name: "legalPage",
  title: "Rechtstext",
  type: "document",
  icon: DocumentTextIcon,
  groups: gruppen,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description:
        "Liegt auf der obersten Ebene: /impressum, /datenschutz, /agb.",
      options: { source: "title", maxLength: 40, isUnique: slugIsFree },
      validation: (r) =>
        r
          .required()
          .custom((wert) =>
            slugAvailable(wert?.current)
              ? true
              : `„${wert?.current}“ ist ein fester Pfad der Website.`,
          ),
      group: "content",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [blockContentMember],
      group: "content",
    }),
    /* Rechtstexte gehören nicht in den Suchindex — sie ziehen Suchanfragen
       auf sich, die niemandem nützen, und verdünnen die Relevanz der Seite.
       Voreingestellt auf „ausschließen“, änderbar bleibt es trotzdem. */
    seoField,
  ],
  initialValue: { seo: { noIndex: true } },
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug ? `/${slug}` : "ohne URL",
    }),
  },
});

/* --- Team --------------------------------------------------------------- */

/**
 * A person: since 2026-10-01 only the author of magazine posts.
 *
 * There used to be a page per person under `/praxis/<slug>` and a grid of
 * people on the practice page. Both are gone; the practice page shows group
 * photos. What a post's author line reads stays visible: name, role,
 * portrait. Everything that only filled the person page is hidden, not
 * deleted — the values stay in the documents in case the pages come back.
 */
export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "person" }),

    /* --- What the author line shows ---------------------------------- */
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Mit Titel, so wie er auf dem Praxisschild steht.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Die Adresse der eigenen Seite, z. B. /praxis/kerrin-gratecap.",
      options: { source: "name", maxLength: 60 },
      hidden: true,
    }),
    defineField({
      name: "role",
      title: "Rolle",
      type: "string",
      description:
        "Kurz. Steht unter dem Namen, z. B. „Zahnärztin, Ästhetik und Prophylaxe“.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "text",
      title: "Kurzprofil",
      type: "text",
      rows: 4,
      description:
        "Zwei Sätze für die Kachel im Team-Raster. Sie tragen die Kachel, seit dort kein Bild mehr steht - je knapper, desto besser stehen die Kacheln nebeneinander.",
      hidden: true,
    }),
    defineField({
      name: "focusAreas",
      title: "Schwerpunkte",
      type: "array",
      description:
        "Verweist auf Leistungen. Die Seite verlinkt sie - wer den Namen sucht, findet so die Behandlung.",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      hidden: true,
    }),

    /* --- Hidden: only the former person page used these -------------- */
    defineField({
      name: "image",
      title: "Porträt",
      type: "picture",
      description:
        "Hochformat. Erscheint auf der eigenen Seite der Person, nicht im Team-Raster - dort stehen alle mit Namen und ohne Bild, damit das Raster vollständig sein kann. Ohne Porträt zeigt die Seite die Initiale auf Markenfläche.",
    }),
    defineField({
      name: "quote",
      title: "Zitat",
      type: "text",
      rows: 3,
      description:
        "Ein Satz in eigenen Worten. Steht groß neben dem Porträt. Leer lassen, wenn es keinen gibt - ein erfundenes Zitat merkt man.",
      hidden: true,
    }),
    defineField({
      name: "bio",
      title: "Ausführlich",
      type: "array",
      of: [blockContentMember],
      description: "Der Werdegang in Absätzen.",
      hidden: true,
    }),
    defineField({
      name: "milestones",
      title: "Stationen",
      type: "array",
      description: "Ausbildung und Werdegang, neueste zuerst.",
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          fields: [
            defineField({
              name: "year",
              title: "Jahr oder Zeitraum",
              type: "string",
              description: "z. B. „2014“ oder „2016–2019“.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "text",
              title: "Was",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "text", subtitle: "year" },
          },
        }),
      ],
      hidden: true,
    }),
    defineField({
      name: "languages",
      title: "Sprachen",
      type: "array",
      of: [{ type: "string" }],
      description: "In denen behandelt wird.",
      hidden: true,
    }),
    defineField({
      name: "email",
      title: "E-Mail",
      type: "string",
      description:
        "Nur wenn die Person direkt erreichbar sein soll. Sonst leer lassen - dann steht die allgemeine Adresse da.",
      validation: (r) => r.email(),
      hidden: true,
    }),

    defineField({
      name: "seo",
      title: "Suchmaschine",
      type: "seo",
      hidden: true,
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

/* --- Stellenanzeigen ---------------------------------------------------- */

export const job = defineType({
  name: "job",
  title: "Stelle",
  type: "document",
  icon: CaseIcon,
  /* Ziehbar wie die Leistungen. Ohne Sortierfeld kam die Reihenfolge der
     Datenbank heraus — auf der Karriereseite standen die vier Stellen damit
     in einer Folge, die niemand bestimmt hatte und die sich beim nächsten
     Import wieder ändern konnte. */
  orderings: [orderRankOrdering],
  /* Sechzehn Felder in einer flachen Liste. Die Ausschreibung ist das, was
     man schreibt und ändert; die Eckdaten sind das, was man einmal setzt.
     Getrennt, damit man beim Redigieren nicht an der Kennung vorbeiscrollt. */
  groups: [
    { name: "posting", title: "Ausschreibung", default: true },
    { name: "facts", title: "Eckdaten" },
    { name: "application", title: "Bewerbung" },
  ],
  fields: [
    orderRankField({ type: "job" }),
    defineField({
      name: "title",
      title: "Stellenbezeichnung",
      type: "string",
      validation: (r) => r.required(),
      group: "posting",
    }),
    defineField({
      name: "handle",
      title: "Kennung",
      type: "slug",
      description:
        "Wird zur Sprungmarke auf der Karriereseite und zum Betreff der Bewerbungsmail.",
      options: { source: "title", maxLength: 40 },
      validation: (r) => r.required(),
      group: "facts",
    }),
    defineField({
      name: "kind",
      title: "Art",
      type: "string",
      description:
        "Steht als Marke neben dem Titel, z. B. „Vollzeit oder Teilzeit“.",
      group: "facts",
    }),
    defineField({
      name: "location",
      title: "Standort",
      type: "string",
      group: "facts",
    }),
    defineField({
      name: "hours",
      title: "Beginn oder Umfang",
      type: "string",
      group: "facts",
    }),
    defineField({
      name: "lead",
      title: "Einleitung",
      type: "text",
      rows: 4,
      group: "posting",
    }),
    defineField({
      name: "duties",
      title: "Deine Aufgaben",
      type: "array",
      of: [{ type: "string" }],
      group: "posting",
    }),
    defineField({
      name: "profile",
      title: "Das bringst du mit",
      type: "array",
      of: [{ type: "string" }],
      group: "posting",
    }),
    defineField({
      name: "highlight",
      title: "Besonderheit",
      type: "string",
      description: "Ein Satz, der hervorgehoben unter den Aufzählungen steht.",
      group: "posting",
    }),
    defineField({
      name: "active",
      title: "Ausgeschrieben",
      type: "boolean",
      description:
        "Abwählen, statt zu löschen - dann verschwindet die Stelle von der Seite, bleibt aber erhalten.",
      initialValue: true,
      group: "facts",
    }),

    /* --- Bewerbung -------------------------------------------------------
       Was das Bewerbungsformular für genau diese Stelle tun soll. Beides
       gehört an die Stelle und nicht an die Karriereseite: Eine
       Prophylaxeassistenz bewirbt sich woanders und wird anderes gefragt
       als eine Oralchirurgin. */
    defineField({
      name: "applicationEmail",
      title: "Bewerbungen gehen an",
      type: "string",
      description:
        "Die Adresse, an die eine Bewerbung auf DIESE Stelle geht. Leer lassen: dann nimmt das Formular die allgemeine Adresse von der Karriereseite.",
      group: "application",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "applicationQuestions",
      title: "Zusätzliche Fragen",
      type: "array",
      description:
        "Fragen, die nur bei dieser Stelle gestellt werden. Name, E-Mail, Telefon und Nachricht fragt das Formular ohnehin - hier steht, was darüber hinaus zu dieser Rolle gehört. Leer lassen: dann hat das Formular für diese Stelle einen Schritt weniger.",
      group: "application",
      of: [
        defineArrayMember({
          type: "object",
          name: "applicationQuestion",
          fields: [
            defineField({
              name: "label",
              title: "Frage",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "kind",
              title: "Art der Antwort",
              type: "string",
              initialValue: "short",
              options: {
                list: [
                  { title: "Kurze Antwort (eine Zeile)", value: "short" },
                  { title: "Lange Antwort (mehrere Zeilen)", value: "long" },
                  { title: "Auswahl aus einer Liste", value: "choice" },
                ],
                layout: "radio",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "choices",
              title: "Auswahlmöglichkeiten",
              type: "array",
              of: [{ type: "string" }],
              description: "Nur bei „Auswahl aus einer Liste“.",
              hidden: ({ parent }) => parent?.kind !== "choice",
            }),
            defineField({
              name: "required",
              title: "Pflichtfrage",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label", kind: "kind", required: "required" },
            prepare: ({
              title,
              kind,
              required,
            }: {
              title?: string;
              kind?: string;
              required?: boolean;
            }) => {
              const arten: Record<string, string> = {
                short: "kurze Antwort",
                long: "lange Antwort",
                choice: "Auswahl",
              };
              return {
                title,
                subtitle: [
                  (kind && arten[kind]) ?? kind,
                  required ? "Pflicht" : null,
                ]
                  .filter(Boolean)
                  .join(" · "),
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", kind: "kind", active: "active" },
    prepare: ({ title, kind, active }) => ({
      title,
      subtitle: [active === false ? "nicht ausgeschrieben" : null, kind]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});

/* --- Geschichten (Transformation Stories) ---------------------------------- */

/**
 * A story: the face, the name, the quote, and since 2026-10-14 optionally a
 * video. Until then the stories were an array on the homepage document and
 * every service page showed the same five. As documents they can be
 * assigned: a story with no services is generic and appears everywhere, a
 * story with services appears on those pages (and on the homepage). The
 * homepage shows all of them.
 */
export const story = defineType({
  name: "story",
  title: "Geschichte",
  type: "document",
  icon: HeartIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "story" }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "picture",
      description:
        "Das Gesicht auf der Karte. Bei einem Video das Standbild, bevor es läuft.",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/mp4" },
      description:
        "Hochkant, als MP4. Läuft auf Klick in der Karte; der Text darunter fasst zusammen, was gesagt wird.",
    }),
    defineField({
      name: "quote",
      title: "Zitat",
      type: "text",
      rows: 6,
      description:
        "Steht unter dem Fächer. Bei einem Video die kurze Zusammenfassung in eigenen Worten.",
    }),
    defineField({
      name: "services",
      title: "Leistungen",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      description:
        "Auf welchen Leistungsseiten die Geschichte steht. Leer: auf allen. Die Startseite zeigt immer alle.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote", media: "image" },
  },
});
