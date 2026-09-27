import type { TextWithLinks } from "../lib/shapes";

/**
 * Der Satz, der von einer Leistungsseite auf die Pillar Page weiterführt.
 *
 * Steht hier und nicht im Studio, aus demselben Grund wie `nav-promo.ts` und
 * die Inhalte der Pillar Page selbst: Das Ziel ist eine Seite im Repository
 * (`pages/veneers-berlin.astro`), kein Dokument im Datensatz. Ein `link` aus
 * dem Schema verlangt für interne Verweise eine Referenz auf ein Dokument —
 * genau, damit ein Pfad nicht kaputtgehen kann, ohne dass es jemand merkt.
 * Die Pillar Page kann diese Referenz nicht erfüllen, und ein getippter Pfad
 * im CMS wäre die Rückkehr zu dem, was `objects/link.ts` abgeschafft hat.
 *
 * Zieht die Pillar Page ins CMS um, wird aus diesem Import eine Abfrage und
 * `sections/Benefits.astro` bleibt unverändert.
 *
 * **Die Sprungmarke ist keine getippte Erfindung.** `#arten-im-vergleich`
 * entsteht aus dem `navLabel` „Arten im Vergleich" des Vergleichsabschnitts
 * in `content/veneers-pillar.ts`, über `idFrom()` in
 * `lib/table-of-contents.ts` — dieselbe Regel, aus der auch das
 * Inhaltsverzeichnis dort seine Ziele baut. Wer das navLabel ändert, ändert
 * die Marke mit und muss diese Zeile nachziehen.
 */
export const benefitsFootnote: Record<string, TextWithLinks> = {
  veneers: [
    "Mehr zum Thema findest du in ",
    {
      label: "unserem medizinischen Veneers-Ratgeber",
      href: "/veneers-berlin",
    },
    " und der ",
    {
      label: "großen Vergleichstabelle aller Veneer-Arten",
      href: "/veneers-berlin#arten-im-vergleich",
    },
    ".",
  ],
};
