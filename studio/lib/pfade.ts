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
 * URLs sind es auch — `/karriere` und nicht `/careers`. Bei der Umstellung
 * der Bezeichner auf Englisch war das kurzzeitig verwechselt, und die
 * Prüfung schützte `/careers` statt `/karriere`: Ein Rechtstext mit dem Slug
 * „karriere" wäre damit durchgegangen und hätte die Karriereseite verdeckt.
 */
export const RESERVIERTE_SLUGS = [
  "leistungen",
  "praxis",
  "magazin",
  "karriere",
  "kontakt",
  "notdienst",
  "design",
  "api",
  "img",
  "fonts",
  "svg",
] as const;

/** Dokumenttypen, die auf der obersten Ebene liegen. */
const OBERSTE_EBENE = ["pillar", "legalPage"];

/* Links der Typname, rechts das Verzeichnis in der URL. Der Typ ist
   englisch, die Adresse bleibt deutsch. */
const VERZEICHNIS: Record<string, string> = {
  service: "leistungen",
  post: "magazin",
};

/** Einzeldokumente und ihr fester Pfad. */
const FESTE_PFADE: Record<string, string> = {
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
export function pfadVon(typ?: string, slug?: string): string | null {
  if (!typ) return null;
  if (typ in FESTE_PFADE) return FESTE_PFADE[typ];
  if (!slug) return null;
  if (typ in VERZEICHNIS) return `/${VERZEICHNIS[typ]}/${slug}`;
  if (OBERSTE_EBENE.includes(typ)) return `/${slug}`;
  return null;
}

/** Ob ein Slug auf oberster Ebene erlaubt ist. */
export const slugFrei = (slug?: string) =>
  !slug || !RESERVIERTE_SLUGS.includes(slug as (typeof RESERVIERTE_SLUGS)[number]);
