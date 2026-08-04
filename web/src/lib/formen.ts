import type { Bildquelle } from "./bilder";

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
export interface Frage {
  frage: string;
  antwort?: string;
}

/** Ein Schritt im Behandlungsablauf. */
export interface Schritt {
  titel: string;
  text: string;
}

/** Eine Preiskarte. */
export interface Preis {
  name: string;
  preis: string;
}

/** Ein aufklappbarer Punkt mit Bild — Standards und Benefits teilen die Form. */
export interface Eintrag {
  name: string;
  text: string;
  bild?: Bildquelle;
}
