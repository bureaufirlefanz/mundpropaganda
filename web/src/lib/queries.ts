import { defineQuery } from "groq";

/**
 * Abfragen liegen bewusst hier und nicht in den Seiten: getStaticPaths wird
 * von Astro in einen eigenen Modulkontext gehoben und sieht Konstanten aus
 * dem Frontmatter nicht — importierte dagegen schon.
 *
 * Welche Seiten gebaut werden, entscheidet nicht mehr eine eigene
 * Slug-Abfrage, sondern die Leistungsliste (lib/leistungsliste.ts) — dieselbe
 * Quelle, aus der auch Tabelle, Menü und Footer entstehen.
 */
/**
 * Die praxisweiten Angaben. Über die feste ID statt über den Typ: das ist die
 * schnellere Abfrage, und sie kann nicht versehentlich ein zweites Dokument
 * erwischen. Die Studio-Struktur hängt das Einzeldokument an dieselbe ID.
 */
export const EINSTELLUNGEN_QUERY = defineQuery(`
  *[_id == "einstellungen"][0]{
    telefon,
    email,
    kontaktTitel,
    kontaktText,
    bewertungenAnbieter,
    bewertungenAnzahl,
    bewertungenSchnitt,
    social,
    standorte[]{ kuerzel, name, strasse, ort, beschreibung }
  }
`);

/**
 * Alle Leistungen als Listeneinträge — für die Services-Tabelle, das
 * Navigationsmenü und den Footer. Drei Aufzählungen, eine Quelle.
 *
 * Sortiert nach `orderRank`: das Feld schreibt die Drag-Liste im Studio. Ohne
 * das `order()` käme die Reihenfolge der Datenbank heraus, und das Ziehen im
 * Studio hätte keine Wirkung.
 *
 * `kurzname` fällt auf den Titel zurück, damit die Redaktion es nur pflegen
 * muss, wenn der Listenname vom Seitentitel abweicht.
 */
export const LEISTUNGSLISTE_QUERY = defineQuery(`
  *[_type == "leistung" && defined(slug.current)] | order(orderRank) {
    "slug": slug.current,
    "name": coalesce(kurzname, titel),
    platzierung,
    gruppe,
    tag,
    "vorschau": vorschau{ ..., asset->{ _id, url } }
  }
`);

/**
 * Bildfelder werden als Objekt übernommen, nicht auf `asset->url` verkürzt.
 * Nur so bleiben Beschnitt und Bildmittelpunkt aus dem Studio erhalten — der
 * URL-Bauer rechnet die Größen daraus.
 *
 * `metadata.lqip` kommt nicht von selbst mit und muss ausgeschrieben werden:
 * das ist der winzige Platzhalter, der den Rahmen füllt, bis das Bild da ist.
 * Der Alternativtext liegt als Feld am Bild und wandert über `...` mit.
 */
const BILD = `{
    ...,
    asset->{ _id, url, metadata { lqip, dimensions { width, height } } }
  }`;

/**
 * Eine Leistung mit allem, was ihre Seite baut.
 *
 * Die letzten vier Abschnitte sind mit Aufgabe 4 dazugekommen. Sie waren
 * gebaut, standen aber nicht im Schema — die Seite nahm sie aus
 * `fixtures.ts`, und zwar bei jeder Leistung dieselben. Auf der
 * Bleaching-Seite stand deshalb „In vier Schritten zu neuen Veneers".
 */
export const LEISTUNG_QUERY = defineQuery(`*[_type == "leistung" && slug.current == $slug][0]{
  titel,
  topline,
  seoBeschreibung,
  hero{ text, bild${BILD} },
  intro{ topline, headline, spalten },
  benefits{ topline, headline, eintraege[]{ name, text, bild${BILD} } },
  preise[]{ name, preis },
  faq[]{ frage, antwort },
  vorherNachher{ topline, vorher${BILD}, nachher${BILD} },
  statement{ topline, text },
  schritte{ titel, eintraege[]{ titel, text } },
  features[]{ topline, titel, text, bild${BILD} }
}`);

/**
 * Ein Verweis, aufgelöst so weit GROQ es kann.
 *
 * `ziel->` holt Typ und Slug des Zieldokuments — daraus baut `linkZiel()` in
 * `lib/navigation.ts` den Pfad, über dieselbe Regel wie das Studio. Der Pfad
 * steht nirgends als Text im Datensatz; er entsteht an einer Stelle.
 */
const LINK = `{
    text,
    art,
    anker,
    url,
    ziel->{ _type, "slug": slug.current }
  }`;

/** Navigation und Seitenfuß — der Rahmen, der auf jeder Seite gleich ist. */
export const NAVIGATION_QUERY = defineQuery(`
  *[_id == "navigation"][0]{
    hauptmenue[]${LINK},
    menueSpalten[]{ titel, links[]${LINK} },
    aktion${LINK}
  }
`);

export const FOOTER_QUERY = defineQuery(`
  *[_id == "footer"][0]{
    leistungenTitel,
    spalten[]{ titel, links[]${LINK} },
    aktion${LINK},
    rechtliches[]${LINK},
    copyright
  }
`);

/**
 * Die Karriereseite und die ausgeschriebenen Stellen.
 *
 * Die Stellen kommen aus ihrer eigenen Sammlung, nicht aus dem Dokument:
 * `aktiv` schaltet eine ab, ohne sie zu löschen, und die Kennung trägt
 * Sprungmarke und Mail-Betreff. Beides gäbe es in einem eingebetteten Array
 * nicht.
 */
export const KARRIERE_QUERY = defineQuery(`
  *[_id == "karriere"][0]{
    topline, titel, einleitung, bild${BILD}, aktion${LINK},
    introTopline, introHeadline, introSpalten,
    zahlenTopline, zahlenHeadline, zahlenEintraege[]{ wert, einheit, text },
    vergleichTopline, vergleichHeadline,
    vergleichSpalten[]{ name, meta, betont },
    vergleichZeilen[]{ name, werte[]{ art, text } },
    vergleichHinweis,
    stellenTopline, stellenHeadline,
    stimmenTopline, stimmenHeadline,
    stimmenEintraege[]{ zitat, name, rolle, dabeiSeit, bild${BILD}, versatz },
    ablaufTopline, ablaufHeadline, ablaufEtappen[]{ marke, titel, text },
    initiativTopline, initiativTitel, initiativText, initiativAbsatz,
    bewerbungMail,
    faqTitel, faq[]{ frage, antwort },
    seo{ titel, beschreibung, nichtIndexieren, bild${BILD} }
  }
`);

export const STELLEN_QUERY = defineQuery(`
  *[_type == "stelle" && aktiv != false] | order(orderRank) {
    titel,
    "kennung": kennung.current,
    art,
    standort,
    umfang,
    einleitung,
    aufgaben,
    profil,
    besonderheit
  }
`);

/**
 * Die Magazinbeiträge als Karten — für das Karussell auf Start- und
 * Leistungsseiten und für die Übersicht unter /magazin.
 *
 * Nur die Felder, die eine Karte braucht. Der Fließtext bleibt draußen: Er
 * wird für die Karte nicht gebraucht und wäre bei zwölf Beiträgen der
 * größte Posten der Antwort.
 *
 * `$leistung` filtert auf Beiträge, die auf eine Leistung verweisen — dafür
 * ist die Referenz im Schema da. Ohne Wert (null) kommen alle.
 */
export const BEITRAEGE_QUERY = defineQuery(`
  *[_type == "beitrag" && defined(slug.current)
    && ($leistung == null || leistung->slug.current == $leistung)]
    | order(datum desc) {
    "slug": slug.current,
    titel,
    datum,
    kategorie,
    einleitung,
    vorschaubild${BILD}
  }
`);

/** Ein einzelner Beitrag mit Fließtext. */
export const BEITRAG_QUERY = defineQuery(`*[_type == "beitrag" && slug.current == $slug][0]{
  titel,
  datum,
  kategorie,
  einleitung,
  vorschaubild${BILD},
  text[]{ ..., _type == "bild" => ${BILD} },
  "leistung": leistung->{ titel, "slug": slug.current },
  seo
}`);

/**
 * Die Rechtstexte. Sie liegen auf der obersten Ebene: /impressum, /datenschutz.
 *
 * Zwei Abfragen statt einer: Die Liste trägt nur die Slugs für
 * `getStaticPaths` und die Zeile im Seitenfuß, der Einzelabruf den Fließtext.
 * Ein Datenschutztext ist der längste Text der ganzen Site — ihn dreimal
 * mitzuladen, nur um drei Links zu setzen, wäre der teuerste Posten einer
 * Seite, auf der er gar nicht steht.
 */
export const RECHTSTEXTE_QUERY = defineQuery(`
  *[_type == "rechtstext" && defined(slug.current)] | order(titel asc) {
    "slug": slug.current,
    titel
  }
`);

export const RECHTSTEXT_QUERY = defineQuery(`*[_type == "rechtstext" && slug.current == $slug][0]{
  titel,
  text[]{ ..., _type == "bild" => ${BILD} },
  seo
}`);

/**
 * Beiträge aus derselben Kategorie — der Weiterlesen-Block unter einem
 * Beitrag.
 *
 * Über `kategorie` und nicht über ein eigenes Tag-System: Die vier Werte
 * (Behandlung, Vorsorge, Material & Technik, Praxis) stehen schon im Schema,
 * jeder Beitrag trägt genau einen davon, und eine zweite Ordnung daneben
 * hieße, dass der Kunde beim Anlegen zweimal dasselbe entscheidet.
 *
 * `$slug` schließt den gerade gelesenen Beitrag aus. Ohne das stünde er unter
 * sich selbst.
 */
export const AEHNLICHE_QUERY = defineQuery(`
  *[_type == "beitrag" && defined(slug.current)
    && kategorie == $kategorie && slug.current != $slug]
    | order(datum desc) [0...3] {
    "slug": slug.current,
    titel,
    datum,
    kategorie,
    einleitung,
    vorschaubild${BILD}
  }
`);

/** Der Kopf der Magazin-Übersicht. Die Beiträge kommen aus der Collection. */
export const MAGAZIN_INDEX_QUERY = defineQuery(`
  *[_id == "magazinIndex"][0]{ titel, topline, einleitung, seo }
`);

/**
 * Die Startseite. Ein Einzeldokument mit fester ID — jeder Abschnitt der
 * Seite hat hier seine Felder.
 *
 * Abgefragt wird alles auf einmal statt je Abschnitt: Es ist ein Dokument,
 * und ein Rundgang zum Server ist billiger als neun.
 *
 * Vier Felder erreichten bis Aufgabe 4 kein Markup. Eine Abfrage, die mehr
 * auswählt, als die Seite verwendet, ist keine Reserve — sie ist die
 * Behauptung, das Feld täte etwas. Aufgelöst wurden sie unterschiedlich:
 *
 *   `servicesZusatz`   entfernt. Die Links unter der Tabelle kommen aus der
 *                      Leistungen-Collection, und die ist die bessere Quelle.
 *   `expertenText`     angeschlossen, heißt jetzt `expertenAbsaetze`.
 *   `standardsBild`    an die richtige Stelle gerückt: Das Motiv hängt am
 *                      einzelnen Punkt, nicht am Abschnitt.
 *   `standorteBilder`  angeschlossen — der Ring liest jetzt daraus.
 */
export const STARTSEITE_QUERY = defineQuery(`
  *[_id == "startseite"][0]{
    heroZeilen,
    splitTopline, splitTitel, splitAbsaetze, splitBild,
    servicesTitel,
    standardsTitel, standardsEintraege[]{ name, text, bild${BILD} },
    standorteTitel, standorteBilder[]{ bild${BILD}, beschriftung },
    expertenTitel, expertenAbsaetze, expertenNamen, expertenBild,
    storiesEintraege[]{ name, bild, zitat },
    storiesAktion${LINK},
    magazinTopline, magazinTitel, magazinText,
    faqTitel, faqText, faq[]{ frage, antwort },
    seo{ titel, beschreibung, nichtIndexieren, bild${BILD} }
  }
`);
