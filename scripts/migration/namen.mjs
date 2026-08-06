/**
 * Das Verzeichnis für die Umstellung auf englische Bezeichner.
 *
 * **Eine Quelle für alles.** Schema, Datensatz, Seed-Dateien, GROQ-Abfragen
 * und der Astro-Code müssen dieselbe Zuordnung benutzen; jede zweite Liste
 * liefe auseinander, und zwar unbemerkt — eine Abfrage, die ein Feld unter
 * altem Namen sucht, liefert `null` statt eines Fehlers.
 *
 * Drei Gruppen:
 *
 *   TYPEN      Dokument- und Objekttypen (`_type`)
 *   IDS        die festen IDs der Einzeldokumente
 *   FELDER     Feldnamen innerhalb der Dokumente
 *
 * GESCHUETZT sammelt, was NICHT übersetzt werden darf. Das ist der
 * gefährlichste Teil der Migration: `children`, `marks`, `markDefs`, `style`,
 * `listItem` und `level` gehören zur Portable-Text-Spezifikation, `asset`,
 * `hotspot` und `crop` zu Sanitys Bildtyp, `orderRank` zum Sortier-Plugin.
 * Wer sie mit übersetzt, bekommt Dokumente, die Sanity nicht mehr rendern
 * kann — und der Fehler zeigt sich erst im Studio, nicht beim Import.
 */

/** Namen, die uns nicht gehören. Bleiben unangetastet. */
export const GESCHUETZT = new Set([
  // Portable Text
  "children",
  "marks",
  "markDefs",
  "style",
  "listItem",
  "level",
  // Sanity-Bild und -Datei
  "asset",
  "hotspot",
  "crop",
  "media",
  // Plugins und Systemfelder
  "orderRank",
  "slug",
  "current",
  // schon englisch und eindeutig
  "alt",
  "email",
  "href",
  "url",
  "name",
  "meta",
  "tag",
  "seo",
  "hero",
  "intro",
  "faq",
  "benefits",
  "features",
  "links",
  "statement",
  "social",
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "footer",
  "navigation",
  "person",
  "pillar",
  "link",
  "level",
]);

/** Dokument- und Objekttypen. */
export const TYPEN = {
  startseite: "homepage",
  leistung: "service",
  leistungenIndex: "servicesIndex",
  magazinIndex: "magazineIndex",
  beitrag: "post",
  karriere: "careers",
  stelle: "job",
  rechtstext: "legalPage",
  praxis: "practice",
  kontakt: "contactPage",
  notdienst: "emergency",
  einstellungen: "settings",
  /* NICHT `image`: Das ist in Sanity ein reservierter Typname (der
     eingebaute Bildtyp), und das Schema ließ sich damit nicht mehr
     exportieren. `picture` ist frei und sagt dasselbe. */
  bild: "picture",
  abschnitte: "sections",
  abschnittIntro: "sectionIntro",
  abschnittFacts: "sectionFacts",
  abschnittFaq: "sectionFaq",
  abschnittCompare: "sectionCompare",
  abschnittKontakt: "sectionContact",
  abschnittPreise: "sectionPricing",
  abschnittSchritte: "sectionSteps",
  abschnittStatement: "sectionStatement",
  abschnittTimeline: "sectionTimeline",
  abschnittVoices: "sectionVoices",

  /* Inline benannte Objekte in Arrays. Sie stehen nicht als eigener Typ im
     Schema, tragen aber ein `_type` in jedem Dokument — im Datensatz gezählt
     statt aus dem Schema gelesen, sonst wären sie beim Umschreiben stehen
     geblieben und Sanity fände für sie keine Definition mehr. */
  eintrag: "item",
  etappe: "stage",
  frageAntwort: "questionAnswer",
  preis: "price",
  spalte: "column",
  stimme: "voice",
  vergleichSpalte: "comparisonColumn",
  vergleichWert: "comparisonValue",
  vergleichZeile: "comparisonRow",
  zahl: "figure",
};

/** Die festen IDs der Einzeldokumente. */
export const IDS = {
  startseite: "homepage",
  magazinIndex: "magazineIndex",
  karriere: "careers",
  einstellungen: "settings",
  navigation: "navigation",
  footer: "footer",
  leistungenIndex: "servicesIndex",
  praxis: "practice",
  kontakt: "contactPage",
  notdienst: "emergency",
};

/**
 * Feldnamen.
 *
 * Bewusst nicht mechanisch übersetzt: `heroZeilen` wird `heroLines` und nicht
 * `heroRows` — es sind die Textzeilen der Überschrift, keine Tabellenzeilen.
 * `vergleichZeilen` dagegen sind Tabellenzeilen und werden `comparisonRows`.
 * Dieselbe deutsche Vokabel, zwei englische, weil sie zwei Sachen meinen.
 */
export const FELDER = {
  // allgemein
  titel: "title",
  topline: "topline",
  text: "text",
  beschreibung: "description",
  einleitung: "lead",
  bild: "image",
  aktion: "action",
  eintraege: "items",
  zeilen: "lines",
  spalten: "columns",
  wert: "value",
  werte: "values",
  art: "kind",
  ziel: "target",
  anker: "anchor",
  marke: "marker",
  versatz: "offset",
  hinweis: "note",
  headline: "headline",
  schmuck: "decorative",
  beschriftung: "caption",
  betont: "emphasised",
  kuerzel: "shortCode",
  kennung: "handle",
  nichtIndexieren: "noIndex",

  // Startseite
  heroZeilen: "heroLines",
  splitTopline: "splitTopline",
  splitTitel: "splitTitle",
  splitAbsaetze: "splitParagraphs",
  splitBild: "splitImage",
  servicesTitel: "servicesTitle",
  standardsTitel: "standardsTitle",
  standardsEintraege: "standardsItems",
  standorteTitel: "locationsTitle",
  standorteBilder: "locationsImages",
  expertenTitel: "expertsTitle",
  expertenAbsaetze: "expertsParagraphs",
  expertenNamen: "expertsNames",
  expertenBild: "expertsImage",
  storiesEintraege: "storiesItems",
  storiesAktion: "storiesAction",
  magazinTopline: "magazineTopline",
  magazinTitel: "magazineTitle",
  magazinText: "magazineText",
  faqTitel: "faqTitle",
  faqText: "faqText",
  frage: "question",
  antwort: "answer",
  fragen: "questions",

  // Leistung
  kurzname: "shortName",
  platzierung: "placement",
  gruppe: "group",
  vorschau: "preview",
  vorschaubild: "previewImage",
  vorherNachher: "beforeAfter",
  vorher: "before",
  nachher: "after",
  schritte: "steps",
  preise: "pricing",
  preis: "price",
  leistung: "service",
  /* Nicht `servicesTitle` wie auf der Startseite: Beide meinen etwas
     anderes (dort die Überschrift des Abschnitts, hier die über der
     Linkspalte im Fuß), und zwei Felder auf denselben Namen zu legen
     macht jede spätere Suche mehrdeutig. */
  leistungenTitel: "servicesHeading",
  seoBeschreibung: "seoDescription",

  // Magazin
  datum: "date",
  kategorie: "category",

  // Karriere
  introTopline: "introTopline",
  introHeadline: "introHeadline",
  introSpalten: "introColumns",
  zahlen: "figures",
  zahlenTopline: "figuresTopline",
  zahlenHeadline: "figuresHeadline",
  zahlenEintraege: "figuresItems",
  einheit: "unit",
  vergleichTopline: "comparisonTopline",
  vergleichHeadline: "comparisonHeadline",
  vergleichSpalten: "comparisonColumns",
  vergleichZeilen: "comparisonRows",
  vergleichHinweis: "comparisonNote",
  stellenTopline: "jobsTopline",
  stellenHeadline: "jobsHeadline",
  stimmen: "voices",
  stimmenTopline: "voicesTopline",
  stimmenHeadline: "voicesHeadline",
  stimmenEintraege: "voicesItems",
  zitat: "quote",
  rolle: "role",
  dabeiSeit: "since",
  ablaufTopline: "processTopline",
  ablaufHeadline: "processHeadline",
  ablaufEtappen: "processStages",
  etappen: "stages",
  initiativTopline: "speculativeTopline",
  initiativTitel: "speculativeTitle",
  initiativText: "speculativeText",
  initiativAbsatz: "speculativeParagraph",
  bewerbungMail: "applicationEmail",

  // Stelle
  aktiv: "active",
  aufgaben: "duties",
  profil: "profile",
  besonderheit: "highlight",
  standort: "location",
  umfang: "hours",
  schwerpunkte: "focusAreas",

  // Einstellungen und Rahmen
  telefon: "phone",
  standorte: "locations",
  strasse: "street",
  ort: "city",
  kontaktTitel: "contactTitle",
  kontaktText: "contactText",
  bewertungenAnbieter: "reviewsProvider",
  bewertungenAnzahl: "reviewsCount",
  bewertungenSchnitt: "reviewsAverage",
  hauptmenue: "mainMenu",
  menueSpalten: "menuColumns",
  rechtliches: "legalLinks",
  copyright: "copyright",
  abschnitte: "sections",
};

/* Ein Feldname darf nicht gleichzeitig geschützt und übersetzt sein — sonst
   entscheidet die Reihenfolge der Anwendung über das Ergebnis. */
for (const alt of Object.keys(FELDER)) {
  if (GESCHUETZT.has(alt)) {
    throw new Error(`„${alt}" steht in FELDER und in GESCHUETZT.`);
  }
}

/* Zwei Felder dürfen nicht auf denselben neuen Namen zeigen, wenn sie im
   selben Dokument vorkommen können. Hier geprüft wird der einfache Fall:
   überhaupt doppelte Ziele. `servicesTitle` kommt zweimal vor (Startseite und
   Seitenfuß), liegt aber in verschiedenen Dokumenten — deshalb nur eine
   Warnung und kein Abbruch. */
export function doppelteZiele() {
  const gesehen = new Map();
  const doppelt = [];
  for (const [alt, neu] of Object.entries(FELDER)) {
    if (gesehen.has(neu)) doppelt.push([gesehen.get(neu), alt, neu]);
    else gesehen.set(neu, alt);
  }
  return doppelt;
}
