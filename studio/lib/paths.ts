/**
 * Das URL-Modell der Website — eine Quelle für Studio, Vorschau und Frontend.
 *
 * Warum hier und nicht verstreut: Der Pfad einer Seite entscheidet über ihre
 * Auffindbarkeit und lässt sich später kaum noch ändern, ohne Weiterleitungen
 * zu schreiben. Wenn Studio-Vorschau und Website ihn getrennt zusammenbauen,
 * laufen sie irgendwann auseinander — und das merkt man erst, wenn die
 * Vorschau ins Leere zeigt.
 *
 *   /                        Startseite
 *   /leistungen              Übersicht aller Leistungen
 *   /leistungen/<slug>       eine Leistung
 *   /praxis                  Praxis & Team
 *   /magazin                 Übersicht
 *   /magazin/<slug>          ein Beitrag
 *   /karriere                Karriere
 *   /kontakt                 Kontakt
 *   /notdienst               Notdienst
 *   /<slug>                  Pillar Page und Rechtstexte
 *
 * Pillar Pages stehen bewusst auf der obersten Ebene. Sie sind auf ein
 * Suchwort hin gebaut („zahnarzt-prenzlauer-berg“); jedes Verzeichnis davor
 * verwässert das Signal und verlängert die URL ohne Gewinn. Dasselbe gilt für
 * Impressum und Datenschutz — die sucht man nicht, die ruft man auf, und
 * /impressum ist die Adresse, die alle erwarten.
 *
 * Der Preis dafür: Ein Pillar-Slug darf mit keinem festen Pfad kollidieren.
 * Deshalb die Liste unten und die Prüfung, die daran hängt.
 */

/**
 * Feste Pfade der obersten Ebene. Kein freier Slug darf so heißen.
 *
 * **Das sind Adressen, keine Typnamen.** Die Website ist deutsch und ihre
 * URLs sind es auch — `/karriere` und nicht `/karriere`. Bei der Umstellung
 * der Bezeichner auf Englisch war das kurzzeitig verwechselt, und die
 * Prüfung schützte `/karriere` statt `/karriere`: Ein Rechtstext mit dem Slug
 * „careers" wäre damit durchgegangen und hätte die Karriereseite verdeckt.
 */
export const RESERVED_SLUGS = [
  "services",
  "praxis",
  "magazine",
  "careers",
  "kontakt",
  "notdienst",
  "design",
  "api",
  "img",
  "fonts",
  "svg",
] as const;

/** Dokumenttypen, die auf der obersten Ebene liegen. */
const TOP_LEVEL = ["pillar", "legalPage"];

/* Links der Typname, rechts das Verzeichnis in der URL. Der Typ ist
   englisch, die Adresse bleibt deutsch. */
const DIRECTORIES: Record<string, string> = {
  service: "leistungen",
  post: "magazin",
};

/** Einzeldokumente und ihr fester Pfad. */
const FIXED_PATHS: Record<string, string> = {
  homepage: "/",
  servicesIndex: "/leistungen",
  practice: "/praxis",
  magazineIndex: "/magazin",
  careers: "/karriere",
  contactPage: "/kontakt",
  emergency: "/notdienst",
};

/**
 * Der Pfad eines Dokuments. Gibt null zurück, wenn der Typ keine eigene Seite
 * hat (Einstellungen, Personen, Stellen) oder der Slug noch fehlt.
 */
export function pathFor(typ?: string, slug?: string): string | null {
  if (!typ) return null;
  if (typ in FIXED_PATHS) return FIXED_PATHS[typ];
  if (!slug) return null;
  if (typ in DIRECTORIES) return `/${DIRECTORIES[typ]}/${slug}`;
  if (TOP_LEVEL.includes(typ)) return `/${slug}`;
  return null;
}

/** Ob ein Slug auf oberster Ebene erlaubt ist. */
export const slugAvailable = (slug?: string) =>
  !slug || !RESERVED_SLUGS.includes(slug as (typeof RESERVED_SLUGS)[number]);
