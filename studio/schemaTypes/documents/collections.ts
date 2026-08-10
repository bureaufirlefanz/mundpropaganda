import { defineType, defineField } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { UserIcon } from "@sanity/icons/User";
import { CaseIcon } from "@sanity/icons/Case";
import { slugAvailable, RESERVED_SLUGS } from "../../lib/paths";
import { fliesstext, fliesstextBild } from "../objects/rich-text";

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

const seoFeld = defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" });

/* --- Magazinbeitrag ----------------------------------------------------- */

export const beitrag = defineType({
  name: "post",
  title: "Magazinbeitrag",
  type: "document",
  icon: DocumentTextIcon,
  groups: gruppen,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required(), group: "content" }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description: "Ergibt /magazin/<slug>. Kleinschreibung, Bindestriche, keine Umlaute.",
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
    defineField({ name: "previewImage", title: "Vorschaubild", type: "picture", group: "content" }),
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
      of: [fliesstext, fliesstextBild],
      group: "content",
    }),
    seoFeld,
  ],
  orderings: [
    { title: "Neueste zuerst", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", date: "date", media: "previewImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString("de-DE") : "ohne Datum",
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
      options: { source: "title", maxLength: 72 },
      validation: (r) =>
        r.required().custom((wert) =>
          slugAvailable(wert?.current)
            ? true
            : `„${wert?.current}“ ist ein fester Pfad der Website. Reserviert: ${RESERVED_SLUGS.join(", ")}.`
        ),
      group: "content",
    }),
    defineField({ name: "topline", title: "Topline", type: "string", group: "content" }),
    defineField({ name: "lead", title: "Einleitung", type: "text", rows: 4, group: "content" }),
    defineField({ name: "image", title: "Kopfbild", type: "picture", group: "content" }),
    defineField({
      name: "sections",
      title: "Abschnitte",
      type: "sections",
      description: "Der Aufbau der Seite. Abschnitte lassen sich ziehen und umstellen.",
      group: "content",
    }),
    seoFeld,
  ],
  preview: {
    select: { title: "title", slug: "slug.current", media: "image" },
    prepare: ({ title, slug, media }) => ({ title, subtitle: slug ? `/${slug}` : "ohne URL", media }),
  },
});

/* --- Rechtstexte -------------------------------------------------------- */

export const rechtstext = defineType({
  name: "legalPage",
  title: "Rechtstext",
  type: "document",
  icon: DocumentTextIcon,
  groups: gruppen,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required(), group: "content" }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description: "Liegt auf der obersten Ebene: /impressum, /datenschutz, /agb.",
      options: { source: "title", maxLength: 40 },
      validation: (r) =>
        r.required().custom((wert) =>
          slugAvailable(wert?.current) ? true : `„${wert?.current}“ ist ein fester Pfad der Website.`
        ),
      group: "content",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [fliesstext],
      group: "content",
    }),
    /* Rechtstexte gehören nicht in den Suchindex — sie ziehen Suchanfragen
       auf sich, die niemandem nützen, und verdünnen die Relevanz der Seite.
       Voreingestellt auf „ausschließen“, änderbar bleibt es trotzdem. */
    seoFeld,
  ],
  initialValue: { seo: { noIndex: true } },
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : "ohne URL" }),
  },
});

/* --- Team --------------------------------------------------------------- */

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Rolle", type: "string" }),
    defineField({ name: "image", title: "Porträt", type: "picture" }),
    defineField({ name: "text", title: "Kurzprofil", type: "text", rows: 4 }),
    defineField({
      name: "focusAreas",
      title: "Schwerpunkte",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

/* --- Stellenanzeigen ---------------------------------------------------- */

export const stelle = defineType({
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
  ],
  fields: [
    orderRankField({ type: "job" }),
    defineField({ name: "title", title: "Stellenbezeichnung", type: "string", validation: (r) => r.required(), group: "posting" }),
    defineField({
      name: "handle",
      title: "Kennung",
      type: "slug",
      description: "Wird zur Sprungmarke auf der Karriereseite und zum Betreff der Bewerbungsmail.",
      options: { source: "title", maxLength: 40 },
      validation: (r) => r.required(),
      group: "facts"
    }),
    defineField({
      name: "kind",
      title: "Art",
      type: "string",
      description: "Steht als Marke neben dem Titel, z. B. „Vollzeit oder Teilzeit“.",
      group: "facts"
    }),
    defineField({ name: "location", title: "Standort", type: "string", group: "facts" }),
    defineField({ name: "hours", title: "Beginn oder Umfang", type: "string", group: "facts" }),
    defineField({ name: "lead", title: "Einleitung", type: "text", rows: 4, group: "posting" }),
    defineField({ name: "duties", title: "Deine Aufgaben", type: "array", of: [{ type: "string" }], group: "posting" }),
    defineField({ name: "profile", title: "Das bringst du mit", type: "array", of: [{ type: "string" }], group: "posting" }),
    defineField({
      name: "highlight",
      title: "Besonderheit",
      type: "string",
      description: "Ein Satz, der hervorgehoben unter den Aufzählungen steht.",
      group: "posting"
    }),
    defineField({
      name: "active",
      title: "Ausgeschrieben",
      type: "boolean",
      description: "Abwählen, statt zu löschen - dann verschwindet die Stelle von der Seite, bleibt aber erhalten.",
      initialValue: true,
      group: "facts"
    }),
  ],
  preview: {
    select: { title: "title", kind: "kind", active: "active" },
    prepare: ({ title, kind, active }) => ({
      title,
      subtitle: [active === false ? "nicht ausgeschrieben" : null, kind].filter(Boolean).join(" · "),
    }),
  },
});
