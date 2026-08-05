import { defineType, defineField } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { UserIcon } from "@sanity/icons/User";
import { CaseIcon } from "@sanity/icons/Case";
import { slugFrei, RESERVIERTE_SLUGS } from "../../lib/pfade";
import { fliesstext } from "../objekte/fliesstext";

/**
 * Die Sammlungen: Typen, von denen es beliebig viele gibt.
 *
 * Beitrag und Pillar Page tragen beide eine eigene URL. Der Unterschied liegt
 * in der Ebene — ein Beitrag liegt unter /magazin/, eine Pillar Page direkt
 * auf der obersten. Warum, steht in lib/pfade.ts.
 */

const gruppen = [
  { name: "inhalt", title: "Inhalt", default: true },
  { name: "seo", title: "SEO" },
];

const seoFeld = defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" });

/* --- Magazinbeitrag ----------------------------------------------------- */

export const beitrag = defineType({
  name: "beitrag",
  title: "Magazinbeitrag",
  type: "document",
  icon: DocumentTextIcon,
  groups: gruppen,
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required(), group: "inhalt" }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description: "Ergibt /magazin/<slug>. Kleinschreibung, Bindestriche, keine Umlaute.",
      options: { source: "titel", maxLength: 72 },
      validation: (r) => r.required(),
      group: "inhalt",
    }),
    defineField({
      name: "datum",
      title: "Veröffentlicht am",
      type: "date",
      description: "Bestimmt die Reihenfolge im Magazin - neueste zuerst.",
      validation: (r) => r.required(),
      group: "inhalt",
    }),
    defineField({
      name: "kategorie",
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
      group: "inhalt",
    }),
    defineField({
      name: "leistung",
      title: "Gehört zu Leistung",
      type: "reference",
      to: [{ type: "leistung" }],
      description:
        "Verknüpft den Beitrag mit einer Leistung. Dadurch kann die Leistungsseite passende Beiträge zeigen, ohne dass jemand sie dort einzeln einträgt.",
      group: "inhalt",
    }),
    defineField({ name: "vorschaubild", title: "Vorschaubild", type: "bild", group: "inhalt" }),
    defineField({
      name: "einleitung",
      title: "Anrisstext",
      type: "text",
      rows: 3,
      description: "Steht auf der Karte im Magazin. Zwei Sätze.",
      group: "inhalt",
    }),
    defineField({
      name: "text",
      title: "Beitrag",
      type: "array",
      of: [fliesstext, { type: "bild" }],
      group: "inhalt",
    }),
    seoFeld,
  ],
  orderings: [
    { title: "Neueste zuerst", name: "datumNeu", by: [{ field: "datum", direction: "desc" }] },
  ],
  preview: {
    select: { title: "titel", datum: "datum", media: "vorschaubild" },
    prepare: ({ title, datum, media }) => ({
      title,
      subtitle: datum ? new Date(datum).toLocaleDateString("de-DE") : "ohne Datum",
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
      name: "titel",
      title: "Überschrift",
      type: "string",
      validation: (r) => r.required(),
      group: "inhalt",
    }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description:
        "Liegt auf der obersten Ebene: /<slug>. Das ist Absicht - eine Pillar Page ist auf ein Suchwort gebaut, jedes Verzeichnis davor verwässert es.",
      options: { source: "titel", maxLength: 72 },
      validation: (r) =>
        r.required().custom((wert) =>
          slugFrei(wert?.current)
            ? true
            : `„${wert?.current}“ ist ein fester Pfad der Website. Reserviert: ${RESERVIERTE_SLUGS.join(", ")}.`
        ),
      group: "inhalt",
    }),
    defineField({ name: "topline", title: "Topline", type: "string", group: "inhalt" }),
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 4, group: "inhalt" }),
    defineField({ name: "bild", title: "Kopfbild", type: "bild", group: "inhalt" }),
    defineField({
      name: "abschnitte",
      title: "Abschnitte",
      type: "abschnitte",
      description: "Der Aufbau der Seite. Abschnitte lassen sich ziehen und umstellen.",
      group: "inhalt",
    }),
    seoFeld,
  ],
  preview: {
    select: { title: "titel", slug: "slug.current", media: "bild" },
    prepare: ({ title, slug, media }) => ({ title, subtitle: slug ? `/${slug}` : "ohne URL", media }),
  },
});

/* --- Rechtstexte -------------------------------------------------------- */

export const rechtstext = defineType({
  name: "rechtstext",
  title: "Rechtstext",
  type: "document",
  icon: DocumentTextIcon,
  groups: gruppen,
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required(), group: "inhalt" }),
    defineField({
      name: "slug",
      title: "URL-Teil",
      type: "slug",
      description: "Liegt auf der obersten Ebene: /impressum, /datenschutz, /agb.",
      options: { source: "titel", maxLength: 40 },
      validation: (r) =>
        r.required().custom((wert) =>
          slugFrei(wert?.current) ? true : `„${wert?.current}“ ist ein fester Pfad der Website.`
        ),
      group: "inhalt",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [fliesstext],
      group: "inhalt",
    }),
    /* Rechtstexte gehören nicht in den Suchindex — sie ziehen Suchanfragen
       auf sich, die niemandem nützen, und verdünnen die Relevanz der Seite.
       Voreingestellt auf „ausschließen“, änderbar bleibt es trotzdem. */
    seoFeld,
  ],
  initialValue: { seo: { nichtIndexieren: true } },
  preview: {
    select: { title: "titel", slug: "slug.current" },
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
    defineField({ name: "rolle", title: "Rolle", type: "string" }),
    defineField({ name: "bild", title: "Porträt", type: "bild" }),
    defineField({ name: "text", title: "Kurzprofil", type: "text", rows: 4 }),
    defineField({
      name: "schwerpunkte",
      title: "Schwerpunkte",
      type: "array",
      of: [{ type: "reference", to: [{ type: "leistung" }] }],
    }),
  ],
  preview: { select: { title: "name", subtitle: "rolle", media: "bild" } },
});

/* --- Stellenanzeigen ---------------------------------------------------- */

export const stelle = defineType({
  name: "stelle",
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
    { name: "ausschreibung", title: "Ausschreibung", default: true },
    { name: "eckdaten", title: "Eckdaten" },
  ],
  fields: [
    orderRankField({ type: "stelle" }),
    defineField({ name: "titel", title: "Stellenbezeichnung", type: "string", validation: (r) => r.required(), group: "ausschreibung" }),
    defineField({
      name: "kennung",
      title: "Kennung",
      type: "slug",
      description: "Wird zur Sprungmarke auf der Karriereseite und zum Betreff der Bewerbungsmail.",
      options: { source: "titel", maxLength: 40 },
      validation: (r) => r.required(),
      group: "eckdaten"
    }),
    defineField({
      name: "art",
      title: "Art",
      type: "string",
      description: "Steht als Marke neben dem Titel, z. B. „Vollzeit oder Teilzeit“.",
      group: "eckdaten"
    }),
    defineField({ name: "standort", title: "Standort", type: "string", group: "eckdaten" }),
    defineField({ name: "umfang", title: "Beginn oder Umfang", type: "string", group: "eckdaten" }),
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 4, group: "ausschreibung" }),
    defineField({ name: "aufgaben", title: "Deine Aufgaben", type: "array", of: [{ type: "string" }], group: "ausschreibung" }),
    defineField({ name: "profil", title: "Das bringst du mit", type: "array", of: [{ type: "string" }], group: "ausschreibung" }),
    defineField({
      name: "besonderheit",
      title: "Besonderheit",
      type: "string",
      description: "Ein Satz, der hervorgehoben unter den Aufzählungen steht.",
      group: "ausschreibung"
    }),
    defineField({
      name: "aktiv",
      title: "Ausgeschrieben",
      type: "boolean",
      description: "Abwählen, statt zu löschen - dann verschwindet die Stelle von der Seite, bleibt aber erhalten.",
      initialValue: true,
      group: "eckdaten"
    }),
  ],
  preview: {
    select: { title: "titel", art: "art", aktiv: "aktiv" },
    prepare: ({ title, art, aktiv }) => ({
      title,
      subtitle: [aktiv === false ? "nicht ausgeschrieben" : null, art].filter(Boolean).join(" · "),
    }),
  },
});
