import type { ImageSource } from "./images";

/**
 * Die Formen, die sich mehrere Bausteine teilen.
 *
 * Sie liegen hier und nicht im Frontmatter der Komponenten, weil eine
 * `.astro`-Datei nur sich selbst exportieren kann — `Frage` gehört zugleich
 * dem Akkordeon und dem FAQ-Abschnitt.
 *
 * Vorher standen sie in `fixtures.ts`, zusammen mit den Beispieldaten. Das
 * ging, solange die Datei doppelt diente: als Vertrag und als Inhalt. Mit
 * Aufgabe 4 ist der Inhalt ins CMS gezogen, und ein Vertrag, der in einer
 * Datei namens „fixtures" steht, wird beim Aufräumen mitgelöscht.
 *
 * Wahlfrei ist hier, was das Schema wahlfrei lässt — nicht mehr und nicht
 * weniger. TypeGen prüft das gegen die Abfrage.
 */

/** Ein Eintrag im Akkordeon. Die Antwort ist wahlfrei, die Frage nicht. */
export interface Question {
  question: string;
  answer?: string;
}

/** Ein Schritt im Behandlungsablauf. */
export interface Step {
  title: string;
  text: string;
  /** Wie lange der Termin dauert, z. B. „ca. 30 bis 60 Minuten". Wahlfrei. */
  duration?: string;
}

/**
 * Eine Preiskarte.
 *
 * Die drei wahlfreien Angaben tragen die Preistabelle einer Pillar Page.
 * Auf den Leistungsseiten sind sie nicht gesetzt, und dann rendert
 * `Prices.astro` genau das Markup von vorher — siehe den Kopf dort.
 */
export interface Price {
  name: string;
  price: string;
  /** Setzt „ab“ vor den Betrag. Nach GOZ ist ein Festpreis nicht zulässig. */
  from?: boolean;
  /** Vergleichszeile, z. B. „0,3–1,0 mm“. */
  reduction?: string;
  /** Vergleichszeile, z. B. „10–15 Jahre“. */
  durability?: string;
  /** Steht rechts in der Pille, z. B. „/ Zahn“ (Figma 177:2029). */
  unit?: string;
}

/** Ein aufklappbarer Punkt mit Bild — Standards und Benefits teilen die Form. */
export interface Entry {
  name: string;
  text: string;
  image?: ImageSource;
}

/**
 * Ein Satz, in dem einzelne Wörter verlinkt sind.
 *
 * Die Teile stehen in Lesereihenfolge: Zeichenketten sind Text, Objekte sind
 * Verweise. Das ist bewusst kein Portable Text — der käme aus dem Studio, und
 * die Ziele dieser Verweise stehen nicht im Studio, sondern im Repository
 * (`pages/veneers-berlin.astro`). Ein `link`-Objekt aus dem Schema kann sie
 * deshalb nicht treffen: Es verlangt für interne Ziele eine Referenz auf ein
 * Dokument, und die Pillar Page ist keines.
 *
 * Solange das so ist, ist der Satz gepflegter Inhalt im Code — dieselbe
 * Begründung wie bei `content/nav-promo.ts`.
 */
export type TextWithLinks = (string | { label: string; href: string })[];
