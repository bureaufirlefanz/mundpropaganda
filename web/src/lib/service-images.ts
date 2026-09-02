/**
 * Welches Foto zu welcher Leistung gehört.
 *
 * **Eine Quelle für zwei Darstellungen.** Dieselbe Leistung erscheint an zwei
 * Stellen: als Zeile in der Tabelle auf der Startseite, wo das Bild beim
 * Überfahren erscheint, und als Kopf ihrer eigenen Seite. Beide zeigen
 * dasselbe CMS-Dokument, also müssen sie dasselbe Bild zeigen — sonst führt
 * die Startseite ein Versprechen ein, das die Seite dahinter nicht einlöst.
 *
 * Vorher lag die Zuordnung an zwei Orten und war an beiden anders:
 * `Services.astro` verteilte sechs Motive über die Tabellenposition, und
 * `ServiceHero.astro` hatte EIN festes Motiv für alle elf Leistungsseiten.
 * Wer von der Startseite auf „Bleaching" klickte, sah dort das Bild, das auch
 * unter „Prophylaxe" stand.
 *
 * **Behandlungssituationen mit Menschen, keine Objektaufnahmen.** Eine
 * Leistung ist, was jemand mit einem Menschen tut; ein Tablett mit
 * Instrumenten zeigt Werkzeug. Man soll die Situation sehen, in der man
 * selbst säße.
 *
 * Zugeordnet über den Slug und nicht über die Position: Die Reihenfolge
 * schreibt die Drag-Liste im Studio, und beim ersten Umsortieren wanderten
 * sonst alle Bilder mit.
 *
 * Ein gepflegtes Bild im CMS gewinnt immer. Diese Liste ist der Rückfall für
 * die Leistungen, an denen noch keines hängt.
 */

const MOTIFS: Record<string, string> = {
  veneers: "veneers-farbbestimmung",
  zahnimplantate: "implantat-beratung",
  keramikinlays: "modell-abformung",
  "zahnersatz-prothetik": "kronen-modell",
  bleaching: "bleaching-beratung-spiegel",
  aligner: "aligner",
  weisheitszahnentfernung: "blutabnahme-weissheitszahn",
  wurzelbehandlung: "wurzelbehandlung-mikroskop",
  "cmd-behandlung": "cmd-gesichtsbogen",
  prophylaxe: "behandlung-prophylaxe",
  "parodontitis-behandlung": "instrumente",
};

/**
 * Das Beratungsgespräch als Rückfall.
 *
 * Richtig für jede Leistung, weil jede damit anfängt — und deshalb die
 * einzige Aufnahme, die auch bei einer neuen, hier noch nicht eingetragenen
 * Leistung nichts Falsches behauptet.
 */
const FALLBACK = "beratung-patientin";

/** Der Motivname zu einer Leistung, für `Picture`. */
export const serviceMotif = (slug?: string) =>
  (slug && MOTIFS[slug]) || FALLBACK;
