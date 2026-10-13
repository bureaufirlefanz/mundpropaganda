/**
 * Das Pfadmodell der Website — die zweite Hälfte von `studio/lib/paths.ts`.
 *
 * Links der Typname (englisch, wie im Schema), rechts das Verzeichnis in der
 * Adresse (deutsch, wie die Website). Beide Hälften müssen übereinstimmen,
 * und sie tun es nicht von selbst; `scripts/check-web.mjs` vergleicht sie
 * seit dieser Datei Eintrag für Eintrag.
 *
 * **Warum es die zweite Hälfte überhaupt gibt.** Das Studio ist ein eigenes
 * Paket. Ein Import über die Ordnergrenze wäre der Rückschritt hinter Stufe
 * A, den `web/CLAUDE.md` verbietet — genau die Richtung, die es einmal
 * möglich machte, mit einer Änderung „im Prototyp" die Website zu ändern.
 *
 * **Warum es innerhalb von `web/` nur diese eine Stelle gibt.** Es waren
 * zwei: `documentPath()` in `navigation.ts` baute Adressen, `targetFor()` in
 * `preview.ts` las sie zurück. Sie sind auseinandergelaufen, und zwar
 * lautlos. Nach der Sprachmigration prüfte `targetFor` weiter auf `careers`,
 * `magazine` und `services`, während die Website längst `/karriere`,
 * `/magazin` und `/leistungen` auslieferte. Ergebnis: Aus dem Studio ließ
 * sich keine einzige Seite in der Vorschau öffnen außer der Startseite —
 * jede Leistung, jeder Beitrag, die Karriereseite gaben 404. Aufgefallen ist
 * es niemandem, weil beide Hälften für sich stimmig aussahen.
 *
 * Deshalb steht die Rückrichtung hier nicht ausgeschrieben, sondern wird aus
 * denselben Tabellen abgeleitet — bis hin zum Typ `Target`, dessen Fälle aus
 * den Schlüsseln entstehen. Ein neuer Typ kann damit nicht mehr in der einen
 * Richtung bekannt sein und in der anderen nicht.
 */

/** Typname → Verzeichnis in der Adresse. Ergibt `/<verzeichnis>/<slug>`. */
export const DIRECTORIES = {
  service: "leistungen",
  post: "magazin",
  /* `person` is gone since 2026-10-01: there are no person pages any more.
     People remain as documents, for the magazine's author line. */
} as const satisfies Record<string, string>;

/** Einzeldokumente und ihr fester Pfad. */
export const FIXED_PATHS = {
  homepage: "/",
  practice: "/praxis",
  magazineIndex: "/magazin",
  careers: "/karriere",
  emergency: "/notdienst",
} as const satisfies Record<string, string>;

/**
 * Typen ohne Verzeichnis, direkt unter der Wurzel.
 *
 * Nur Rechtstexte. Die Pillar Page liegt zwar auch dort, ihr Inhalt steht
 * aber noch im Repository und nicht im CMS (`pages/veneers-berlin.astro`) —
 * es gibt kein Dokument, dessen Pfad zu bauen oder dessen Vorschau zu öffnen
 * wäre. Sobald sie ins Schema wandert, gehört `pillar` hier dazu.
 */
export const TOP_LEVEL = ["legalPage"] as const;

type FixedType = keyof typeof FIXED_PATHS;
type SluggedType = keyof typeof DIRECTORIES | (typeof TOP_LEVEL)[number];

/**
 * Der Pfad eines Dokuments. `null`, wenn der Typ keine eigene Seite hat
 * (Einstellungen, Stellen) oder der Slug fehlt.
 */
export function documentPath(type?: string, slug?: string): string | null {
  if (!type) return null;
  if (type in FIXED_PATHS) return FIXED_PATHS[type as FixedType];
  if (!slug) return null;
  if (type in DIRECTORIES)
    return `/${DIRECTORIES[type as keyof typeof DIRECTORIES]}/${slug}`;
  if ((TOP_LEVEL as readonly string[]).includes(type)) return `/${slug}`;
  return null;
}

/**
 * Welche Seite steckt hinter einem Pfad? Die Umkehrung von `documentPath()`.
 *
 * `kind` trägt den Typnamen aus dem Schema, nicht einen eigenen. So steht in
 * der Vorschau dasselbe Wort wie im Studio, und ein Tippfehler ist ein
 * Typfehler.
 */
export type Target = { kind: FixedType } | { kind: SluggedType; slug: string };

/** Umgekehrte Tabellen, einmal gebaut statt bei jedem Aufruf. */
const BY_FIXED_PATH = new Map<string, FixedType>(
  Object.entries(FIXED_PATHS).map(([type, path]) => [path, type as FixedType]),
);
const BY_DIRECTORY = new Map<string, keyof typeof DIRECTORIES>(
  Object.entries(DIRECTORIES).map(([type, directory]) => [
    directory,
    type as keyof typeof DIRECTORIES,
  ]),
);

export function targetFor(path: string): Target | null {
  /* Führende und schließende Schrägstriche weg — Astro liefert den Restpfad
     mal mit, mal ohne, je nachdem ob die URL auf / endet. */
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return { kind: "homepage" };

  if (segments.length === 1) {
    /* Erst die festen Pfade, dann der Slug.
       `/karriere` liegt auf derselben Ebene wie ein Rechtstext. Stünde der
       Slug zuerst, verdeckte ein Rechtstext namens „karriere" die
       Karriereseite. Im Studio verhindert `slugAvailable()` genau diesen
       Fall, aber die Reihenfolge hier darf sich nicht darauf verlassen. */
    const fixed = BY_FIXED_PATH.get(`/${segments[0]}`);
    if (fixed) return { kind: fixed };
    return { kind: TOP_LEVEL[0], slug: segments[0]! };
  }

  if (segments.length === 2) {
    const type = BY_DIRECTORY.get(segments[0]!);
    if (type) return { kind: type, slug: segments[1]! };
  }

  return null;
}
