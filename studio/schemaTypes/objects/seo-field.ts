import { defineField } from "sanity";

/**
 * Das SEO-Feld, wie es an jedem Dokument mit eigener Adresse hängt.
 *
 * Es stand dreimal wörtlich gleich in den Schemadateien — und einmal gar
 * nicht: Die Leistungsseiten hatten statt des Objekts eine nackte
 * `seoDescription`. Eine Zeile, die an vier Stellen dieselbe sein soll, ist
 * eine Zeile zu viel an drei Stellen.
 *
 * Kein eigener Typ, sondern ein fertiges Feld: `seo` ist der Typ (siehe
 * `seo.ts`), dies hier ist die immer gleiche Art, ihn einzuhängen — unter
 * demselben Namen, mit demselben Titel, in derselben Gruppe. Genau das war
 * das, was auseinanderlaufen konnte.
 */
export const seoField = defineField({
  name: "seo",
  title: "Suchmaschine",
  type: "seo",
  group: "seo",
});
