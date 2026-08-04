import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { CaseIcon } from "@sanity/icons/Case";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { TagsIcon } from "@sanity/icons/Tags";

/**
 * Die Seiten, die es genau einmal gibt.
 *
 * Sie hängen an einer festen ID (gleich dem Typnamen) und tauchen in der
 * Seitenleiste als einzelner Eintrag auf, nicht als Liste — anlegen kann man
 * sie nicht, es gibt sie schon. Erzwungen wird das in der Struktur und über
 * den Vorlagenfilter in sanity.config.ts.
 *
 * Alle teilen sich denselben Zuschnitt: eine Kopfgruppe für den Inhalt, eine
 * für SEO. Der Aufbau der Seite steckt im Baukasten (`abschnitte`), damit die
 * Redaktion Abschnitte umstellen kann, ohne dass jemand Code anfasst.
 *
 * Ausnahme ist die Startseite: Ihre Reihenfolge ist gestaltet, nicht
 * zusammengesteckt. Sie bekommt deshalb feste Felder statt eines Baukastens —
 * ein Baukasten, in dem man den Hero nach unten ziehen kann, lädt zu einem
 * Fehler ein, den niemand braucht.
 */

const gruppen = [
  { name: "inhalt", title: "Inhalt", default: true },
  { name: "seo", title: "SEO" },
];

const seoFeld = defineField({ name: "seo", title: "Suchmaschine", type: "seo", group: "seo" });

/** Kopf einer Unterseite: Topline, Titel, Einleitung, Bild. */
const kopfFelder = [
  defineField({
    name: "topline",
    title: "Topline",
    type: "string",
    description: "Die kleine Zeile über der Überschrift.",
    group: "inhalt",
  }),
  defineField({
    name: "titel",
    title: "Überschrift",
    type: "string",
    validation: (r) => r.required(),
    group: "inhalt",
  }),
  defineField({
    name: "einleitung",
    title: "Einleitung",
    type: "text",
    rows: 4,
    description: "Zwei bis drei Sätze unter der Überschrift.",
    group: "inhalt",
  }),
  defineField({ name: "bild", title: "Kopfbild", type: "bild", group: "inhalt" }),
];

const baukasten = defineField({
  name: "abschnitte",
  title: "Abschnitte",
  type: "abschnitte",
  description: "Der Aufbau der Seite. Abschnitte lassen sich ziehen und umstellen.",
  group: "inhalt",
});

/** Erzeugt eine Einzelseite mit Kopf, Baukasten und SEO. */
function einzelseite(name: string, title: string, icon: any, untertitel: string) {
  return defineType({
    name,
    title,
    type: "document",
    icon,
    groups: gruppen,
    fields: [...kopfFelder, baukasten, seoFeld],
    preview: {
      select: { titel: "titel" },
      prepare: ({ titel }) => ({ title, subtitle: titel || untertitel }),
    },
  });
}

/* --- Übersichten und Unterseiten --------------------------------------- */

export const leistungenIndex = einzelseite(
  "leistungenIndex",
  "Leistungen (Übersicht)",
  TagsIcon,
  "/leistungen"
);

export const praxis = einzelseite("praxis", "Praxis & Team", UsersIcon, "/praxis");
export const magazinIndex = einzelseite("magazinIndex", "Magazin (Übersicht)", DocumentsIcon, "/magazin");
export const karriere = einzelseite("karriere", "Karriere", CaseIcon, "/karriere");
export const kontakt = einzelseite("kontakt", "Kontakt", EnvelopeIcon, "/kontakt");
export const notdienst = einzelseite("notdienst", "Notdienst", WarningOutlineIcon, "/notdienst");
