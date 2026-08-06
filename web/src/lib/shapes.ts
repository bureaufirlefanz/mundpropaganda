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
}

/** Eine Preiskarte. */
export interface Price {
  name: string;
  price: string;
}

/** Ein aufklappbarer Punkt mit Bild — Standards und Benefits teilen die Form. */
export interface Entry {
  name: string;
  text: string;
  image?: ImageSource;
}
