/**
 * Etappe 2: Dateinamen und Bezeichner im Code.
 *
 * Etappe 1 hat das Inhaltsmodell umgestellt (Typen, IDs, Feldnamen) — das war
 * der Teil mit dem Datensatz daran. Hier geht es um reinen Code.
 *
 * **Getrennt gehalten, weil der Rückweg verschieden ist.** Eine falsche
 * Umbenennung hier bricht den Build und ist in einer Minute gefunden. Eine
 * falsche Umbenennung in Etappe 1 bricht nichts — sie lässt eine Abfrage
 * `null` liefern, und der Abschnitt verschwindet still von der Seite.
 *
 * `seiten/` wird NICHT `pages/`: Astro belegt diesen Namen für die Routen, und
 * zwei Ordner gleichen Namens nebeneinander sind genau die Verwechslung, die
 * diese Ebene vermeiden soll. `templates/` sagt, was darin liegt.
 *
 * Die Reihenfolge zählt: Längere Namen zuerst, sonst macht `bild` aus
 * `bildUrl` ein `imageUrl`, bevor die eigene Regel dafür greift. Der Anwender
 * sortiert selbst nach Länge.
 *
 * ACHTUNG: `scripts/migration/` muss vom Anwender AUSGENOMMEN sein. Beim
 * ersten Lauf war es das nicht — das Skript hat seine eigene Zuordnung
 * umgeschrieben und dabei unbrauchbar gemacht.
 */

export const DATEIEN = {
  "web/src/seiten/Startseite.astro": "web/src/templates/Home.astro",
  "web/src/seiten/Leistung.astro": "web/src/templates/Service.astro",
  "web/src/seiten/Magazin.astro": "web/src/templates/Magazine.astro",
  "web/src/seiten/Beitrag.astro": "web/src/templates/Post.astro",
  "web/src/seiten/Karriere.astro": "web/src/templates/Careers.astro",
  "web/src/seiten/Rechtstext.astro": "web/src/templates/LegalPage.astro",
  "web/src/lib/startseite.ts": "web/src/lib/homepage.ts",
  "web/src/lib/leistungen.ts": "web/src/lib/services.ts",
  "web/src/lib/leistungsliste.ts": "web/src/lib/service-list.ts",
  "web/src/lib/magazin.ts": "web/src/lib/magazine.ts",
  "web/src/lib/karriere.ts": "web/src/lib/careers.ts",
  "web/src/lib/rechtstexte.ts": "web/src/lib/legal-pages.ts",
  "web/src/lib/einstellungen.ts": "web/src/lib/settings.ts",
  "web/src/lib/bilder.ts": "web/src/lib/images.ts",
  "web/src/lib/formen.ts": "web/src/lib/shapes.ts",
  "web/src/lib/ohne-null.ts": "web/src/lib/without-null.ts",
  "web/src/lib/inhaltsverzeichnis.ts": "web/src/lib/table-of-contents.ts",
  "web/src/lib/image-breiten.json": "web/src/lib/image-widths.json",
  "web/src/components/ui/Inhaltsverzeichnis.astro":
    "web/src/components/ui/TableOfContents.astro",
  "web/src/components/ui/TextTitel.astro":
    "web/src/components/ui/TextHeading.astro",
  "web/src/components/ui/PostKarte.astro":
    "web/src/components/ui/PostCard.astro",
  "web/src/components/ui/BildRing.astro":
    "web/src/components/ui/ImageRing.astro",
  "web/src/components/sections/PostListe.astro":
    "web/src/components/sections/PostList.astro",
  "studio/schemaTypes/dokumente/startseite.ts":
    "studio/schemaTypes/documents/homepage.ts",
  "studio/schemaTypes/dokumente/sammlungen.ts":
    "studio/schemaTypes/documents/collections.ts",
  "studio/schemaTypes/dokumente/einzelseiten.ts":
    "studio/schemaTypes/documents/single-pages.ts",
  "studio/schemaTypes/dokumente/karriere.ts":
    "studio/schemaTypes/documents/careers.ts",
  "studio/schemaTypes/dokumente/rahmen.ts":
    "studio/schemaTypes/documents/chrome.ts",
  "studio/schemaTypes/objekte/bild.ts": "studio/schemaTypes/objects/picture.ts",
  "studio/schemaTypes/objekte/link.ts": "studio/schemaTypes/objects/link.ts",
  "studio/schemaTypes/objekte/seo.ts": "studio/schemaTypes/objects/seo.ts",
  "studio/schemaTypes/objekte/abschnitte.ts":
    "studio/schemaTypes/objects/sections.ts",
  "studio/schemaTypes/objekte/fliesstext.ts":
    "studio/schemaTypes/objects/rich-text.ts",
  "studio/schemaTypes/leistung.ts": "studio/schemaTypes/service.ts",
  "studio/schemaTypes/einstellungen.ts": "studio/schemaTypes/settings.ts",
  "studio/lib/pfade.ts": "studio/lib/paths.ts",
  "studio/structure/orte.ts": "studio/structure/locations.ts",
  "studio/components/PublishHinweis.tsx": "studio/components/PublishNotice.tsx",
  "scripts/image-breiten.mjs": "scripts/image-widths.mjs",
};

export const BEZEICHNER = {
  ladeStartseite: "loadHomepage",
  ladeLeistungsliste: "loadServiceList",
  ladeLeistung: "loadService",
  ladeBeitraege: "loadPosts",
  ladeBeitrag: "loadPost",
  ladeAehnliche: "loadRelated",
  ladeMagazinKopf: "loadMagazineIntro",
  ladeKarriere: "loadCareers",
  ladeStellen: "loadJobs",
  ladeRechtstexte: "loadLegalPages",
  ladeRechtstext: "loadLegalPage",
  ladeEinstellungen: "loadSettings",
  ladeNavigation: "loadNavigation",
  ladeFooter: "loadFooter",
  istCmsBild: "isCmsImage",
  bildSrcset: "imageSrcset",
  bildUrl: "imageUrl",
  stabilesMotiv: "stableMotif",
  motivPfad: "motifPath",
  motivFuer: "motifFor",
  CmsBild: "CmsImageValue",
  Bildquelle: "ImageSource",
  pfadVon: "pathFor",
  slugFrei: "slugAvailable",
  RESERVIERTE_SLUGS: "RESERVED_SLUGS",
  FESTE_PFADE: "FIXED_PATHS",
  VERZEICHNIS: "DIRECTORIES",
  OBERSTE_EBENE: "TOP_LEVEL",
  linkZiel: "linkHref",
  aufgeloest: "resolved",
  dokumentPfad: "documentPath",
  Verweis: "LinkValue",
  aktuellerPfad: "currentPath",
  kategorieText: "categoryLabel",
  beitragPfad: "postPath",
  datumText: "dateLabel",
  KATEGORIEN: "CATEGORIES",
  BeitragVoll: "FullPost",
  Beitrag: "Post",
  MagazinKopf: "MagazineIntro",
  markenAus: "headingsFrom",
  idVon: "idFrom",
  mitKennungen: "withHeadingIds",
  Marke: "Heading",
  marken: "headings",
  ebene: "level",
  vorschauClient: "previewClient",
  vorschauToken: "previewToken",
  zielVon: "targetFor",
  VORSCHAU_COOKIE: "PREVIEW_COOKIE",
  Ziel: "Target",
  fuerTabelle: "forTable",
  fuerListe: "forList",
  LeistungsEintrag: "ServiceEntry",
  Leistung: "Service",
  StartseiteInhalt: "HomepageContent",
  vervollstaendige: "fillRequired",
  PFLICHT_TEXT: "REQUIRED_TEXT",
  PFLICHT_LISTE: "REQUIRED_LIST",
  Karriere: "CareersContent",
  Stelle: "Job",
  RechtstextKarte: "LegalPageCard",
  Rechtstext: "LegalPage",
  Einstellungen: "Settings",
  Schritt: "Step",
  Frage: "Question",
  Preis: "Price",
  Eintrag: "Entry",
  OhneNull: "WithoutNull",
  ohneNull: "withoutNull",
  gemerktStellen: "cachedJobs",
  gemerktNav: "cachedNavigation",
  gemerktFooter: "cachedFooter",
  gemerkt: "cached",
  beitraege: "posts",
  leistungen: "services",
  stellen: "jobs",
  eintraege: "items",
  daten: "data",
  zeilen: "rows",
  spalten: "columns",
  seiten: "pages",
  seite: "page",
  motiv: "motif",
  MOTIVE: "MOTIFS",
  breiten: "widths",
  breite: "width",
  hoehe: "height",
  quelle: "source",
  wurzel: "root",
  dateien: "files",
  datei: "file",
  ordner: "folder",
  treffer: "matches",
  vorher: "before",
  nachher: "after",
  zaehle: "count",
  schluessel: "key",
  bewerbungLink: "applicationLink",
};
