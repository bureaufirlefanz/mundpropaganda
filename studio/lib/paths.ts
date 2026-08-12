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
 *   /praxis/<slug>           eine Person des Teams
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
 * URLs sind es auch: `/karriere`, nicht `/careers`.
 *
 * Bei der Umstellung der Bezeichner auf Englisch wurde diese Liste
 * mitübersetzt — sie schützte danach `/services`, `/magazine` und
 * `/careers`, also drei Adressen, die es gar nicht gibt. Ein Rechtstext mit
 * dem Slug „karriere" wäre durchgegangen und hätte die Karriereseite
 * verdeckt: `/[slug]` und `/karriere` beanspruchen dieselbe Stelle, und wer
 * gewinnt, entscheidet die Reihenfolge im Build und nicht eine Absicht.
 *
 * Der Kommentar, der hier stand, behauptete die Reparatur bereits — und war
 * selbst ein Opfer derselben Ersetzung („`/karriere` und nicht
 * `/karriere`"). Ein Beleg dafür, dass eine Prüfung im Code mehr wert ist
 * als eine Zusage im Kommentar; deshalb steht sie jetzt in
 * `scripts/check-web.mjs` unter „Reservierte Pfade".
 */
export const RESERVED_SLUGS = [
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
const TOP_LEVEL = ["pillar", "legalPage"];

/* Links der Typname, rechts das Verzeichnis in der URL. Der Typ ist
   englisch, die Adresse bleibt deutsch. */
const DIRECTORIES: Record<string, string> = {
  service: "leistungen",
  post: "magazin",
  /* Eine Person liegt unter der Praxisseite, nicht auf eigener Ebene: Sie
     ist kein selbständiges Thema, sondern ein Teil des Teams — und wer die
     Adresse kürzt, landet dort, wo alle stehen. */
  person: "praxis",
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
 * hat (Einstellungen, Stellen) oder der Slug noch fehlt.
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
