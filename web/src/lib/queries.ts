import { defineQuery } from "groq";

/**
 * Abfragen liegen bewusst hier und nicht in den Seiten: getStaticPaths wird
 * von Astro in einen eigenen Modulkontext gehoben und sieht Konstanten aus
 * dem Frontmatter nicht — importierte dagegen schon.
 *
 * Welche Seiten gebaut werden, entscheidet nicht mehr eine eigene
 * Slug-Abfrage, sondern die Leistungsliste (lib/service-list.ts) — dieselbe
 * Quelle, aus der auch Tabelle, Menü und Footer entstehen.
 */
/**
 * Bildfelder werden als Objekt übernommen, nicht auf `asset->url` verkürzt.
 * Nur so bleiben Beschnitt und Bildmittelpunkt aus dem Studio erhalten — der
 * URL-Bauer rechnet die Größen daraus.
 *
 * `metadata.lqip` kommt nicht von selbst mit und muss ausgeschrieben werden:
 * das ist der winzige Platzhalter, der den Rahmen füllt, bis das Bild da ist.
 * Der Alternativtext liegt als Feld am Bild und wandert über `...` mit.
 *
 * Steht bewusst ganz oben: Die Abfragen darunter binden es in ihre
 * Zeichenkette ein, und eine `const` weiter unten wäre zum Zeitpunkt der
 * Auswertung noch nicht belegt.
 */
const BILD = `{
    ...,
    asset->{ _id, url, metadata { lqip, dimensions { width, height } } }
  }`;

/**
 * Die praxisweiten Angaben. Über die feste ID statt über den Typ: das ist die
 * schnellere Abfrage, und sie kann nicht versehentlich ein zweites Dokument
 * erwischen. Die Studio-Struktur hängt das Einzeldokument an dieselbe ID.
 */
export const SETTINGS_QUERY = defineQuery(`
  *[_id == "settings"][0]{
    siteName,
    favicon ${BILD},
    phone,
    email,
    contactTitle,
    contactText,
    reviewsProvider,
    reviewsCount,
    reviewsAverage,
    social,
    searchEngines,
    defaultDescription,
    shareImage ${BILD},
    googleVerification,
    plausibleDomain,
    locations[]{
      shortCode, name, street, city, description,
      latitude, longitude,
      hours[]{ days, time }
    }
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
 * `shortName` fällt auf den Titel zurück, damit die Redaktion es nur pflegen
 * muss, wenn der Listenname vom Seitentitel abweicht.
 */
export const SERVICE_LIST_QUERY = defineQuery(`
  *[_type == "service" && defined(slug.current)] | order(orderRank) {
    "slug": slug.current,
    "name": coalesce(shortName, title),
    placement,
    group,
    tag,
    "preview": preview{ ..., asset->{ _id, url } }
  }
`);

/**
 * Eine Leistung mit allem, was ihre Seite baut.
 *
 * Die letzten vier Abschnitte sind mit Aufgabe 4 dazugekommen. Sie waren
 * gebaut, standen aber nicht im Schema — die Seite nahm sie aus
 * `fixtures.ts`, und zwar bei jeder Leistung dieselben. Auf der
 * Bleaching-Seite stand deshalb „In vier Schritten zu neuen Veneers".
 *
 * `explainer` ist der zweite Textblock weiter unten, mit randlosem Bild.
 * `hero.claim`, `hero.actionLabel`, `pricingTitle` und `steps.items[].duration`
 * sind mit der Veneers-Copy dazugekommen: alle wahlfrei, alle ohne Wirkung auf
 * die Seiten, die sie nicht pflegen.
 */
export const SERVICE_QUERY =
  defineQuery(`*[_type == "service" && slug.current == $slug][0]{
  title,
  topline,
  hero{ claim, text, actionLabel, image${BILD} },
  intro{ topline, headline, columns },
  benefits{ topline, headline, items[]{ name, text, image${BILD} } },
  pricingTitle,
  pricing[]{ name, price },
  faq[]{ question, answer },
  beforeAfter{ topline, before${BILD}, after${BILD} },
  statement{ topline, text },
  explainer{ topline, headline, columns, actionLabel },
  steps{ title, items[]{ title, text, duration } },
  features[]{ topline, title, text, image${BILD} },
  seo{ title, description, noIndex, image${BILD} }
}`);

/**
 * Ein Verweis, aufgelöst so weit GROQ es kann.
 *
 * `target->` holt Typ und Slug des Zieldokuments — daraus baut `linkZiel()` in
 * `lib/navigation.ts` den Pfad, über dieselbe Regel wie das Studio. Der Pfad
 * steht nirgends als Text im Datensatz; er entsteht an einer Stelle.
 */
const LINK = `{
    text,
    kind,
    anchor,
    url,
    target->{ _type, "slug": slug.current }
  }`;

/** Navigation und Seitenfuß — der Rahmen, der auf jeder Seite gleich ist. */
export const NAVIGATION_QUERY = defineQuery(`
  *[_id == "navigation"][0]{
    mainMenu[]${LINK},
    menuColumns[]{ title, links[]${LINK} },
    action${LINK}
  }
`);

export const FOOTER_QUERY = defineQuery(`
  *[_id == "footer"][0]{
    servicesHeading,
    columns[]{ title, links[]${LINK} },
    action${LINK},
    legalLinks[]${LINK},
    copyright
  }
`);

/**
 * Die Karriereseite und die ausgeschriebenen Stellen.
 *
 * Die Stellen kommen aus ihrer eigenen Sammlung, nicht aus dem Dokument:
 * `active` schaltet eine ab, ohne sie zu löschen, und die Kennung trägt
 * Sprungmarke und Mail-Betreff. Beides gäbe es in einem eingebetteten Array
 * nicht.
 */
export const CAREERS_QUERY = defineQuery(`
  *[_id == "careers"][0]{
    topline, title, lead, image${BILD}, action${LINK},
    introTopline, introHeadline, introColumns,
    figuresTopline, figuresHeadline, figuresItems[]{ value, unit, text },
    comparisonTopline, comparisonHeadline,
    comparisonColumns[]{ name, emphasised },
    comparisonRows[]{ name, values[]{ kind, text } },
    comparisonNote,
    videoUrl, videoTitle, videoPoster${BILD},
    weekTopline, weekHeadline, weekText,
    benefitsTopline, benefitsHeadline, benefitsItems,
    reasonsTopline, reasonsHeadline, reasonsItems[]{ title, text },
    jobsTopline, jobsHeadline, jobsText,
    voicesTopline, voicesHeadline,
    voicesItems[]{ quote, name, role, since, image${BILD}, offset },
    processHeadline, processStages[]{ title, text },
    speculativeTopline, speculativeTitle, speculativeText, speculativeParagraph,
    applicationEmail,
    faq[]{ question, answer },
    seo{ title, description, noIndex, image${BILD} }
  }
`);

export const JOBS_QUERY = defineQuery(`
  *[_type == "job" && active != false] | order(orderRank) {
    title,
    "handle": handle.current,
    kind,
    location,
    hours,
    lead,
    duties,
    profile,
    highlight,
    applicationEmail,
    applicationQuestions[]{ label, kind, choices, required }
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
 * `$service` filtert auf Beiträge, die auf eine Leistung verweisen — dafür
 * ist die Referenz im Schema da. Ohne Wert (null) kommen alle.
 */
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)
    && ($service == null || service->slug.current == $service)]
    | order(date desc) {
    "slug": slug.current,
    title,
    date,
    category,
    lead,
    previewImage${BILD}
  }
`);

/** Ein einzelner Beitrag mit Fließtext. */
/**
 * Ein einzelner Beitrag mit Fließtext, Autor und den Bildern darin.
 *
 * `inlineImage` trägt sein Bild in einem Unterfeld und ist nicht selbst eines:
 * Sanity lässt auf Subtypen von "image" keine zusätzlichen Felder zu, also ist
 * es ein Objekt aus Bild, Breite und Bildunterschrift.
 *
 * KEIN Kommentar innerhalb des Template-Literals unten. Dort einen zu setzen
 * hat die Abfrage zerlegt: Backticks um ein Wort beenden die Zeichenkette,
 * und TypeGen fand danach null Abfragen in der Datei — mit der Folge, dass
 * jedes Ergebnis `any` wurde und 34 Bausteine ihre Typen verloren.
 */
export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  date,
  category,
  lead,
  previewImage${BILD},
  text[]{ ..., _type == "inlineImage" => { ..., image${BILD} } },
  "service": service->{ title, "slug": slug.current },
  "author": author->{ name, role, image${BILD} },
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
export const LEGAL_PAGES_QUERY = defineQuery(`
  *[_type == "legalPage" && defined(slug.current)] | order(title asc) {
    "slug": slug.current,
    title
  }
`);

export const LEGAL_PAGE_QUERY =
  defineQuery(`*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  text[]{ ..., _type == "image" => ${BILD} },
  seo
}`);

/**
 * Beiträge aus derselben Kategorie — der Weiterlesen-Block unter einem
 * Beitrag.
 *
 * Über `category` und nicht über ein eigenes Tag-System: Die vier Werte
 * (Behandlung, Vorsorge, Material & Technik, Praxis) stehen schon im Schema,
 * jeder Beitrag trägt genau einen davon, und eine zweite Ordnung daneben
 * hieße, dass der Kunde beim Anlegen zweimal dasselbe entscheidet.
 *
 * `$slug` schließt den gerade gelesenen Beitrag aus. Ohne das stünde er unter
 * sich selbst.
 */
export const RELATED_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)
    && category == $category && slug.current != $slug]
    | order(date desc) [0...3] {
    "slug": slug.current,
    title,
    date,
    category,
    lead,
    previewImage${BILD}
  }
`);

/** Der Kopf der Magazin-Übersicht. Die Beiträge kommen aus der Collection. */
export const MAGAZINE_INDEX_QUERY = defineQuery(`
  *[_id == "magazineIndex"][0]{ title, topline, lead, seo }
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
 *   `expertenText`     angeschlossen, heißt jetzt `expertsParagraphs`.
 *   `standardsBild`    an die richtige Stelle gerückt: Das Motiv hängt am
 *                      einzelnen Punkt, nicht am Abschnitt.
 *   `locationsImages`  angeschlossen — der Ring liest jetzt daraus.
 */
export const HOMEPAGE_QUERY = defineQuery(`
  *[_id == "homepage"][0]{
    heroLines,
    splitTopline, splitTitle, splitParagraphs, splitImage${BILD},
    servicesTitle,
    standardsTitle, standardsItems[]{ name, text, image${BILD} },
    locationsTitle, locationsImages[]{ image${BILD}, caption },
    expertsTitle, expertsParagraphs, expertsNames, expertsImage${BILD},
    storiesItems[]{ name, image${BILD}, quote },
    storiesAction${LINK},
    magazineTopline, magazineTitle, magazineText,
    faq[]{ question, answer },
    seo{ title, description, noIndex, image${BILD} }
  }
`);

/**
 * Die Praxisseite. Team und Standorte stehen NICHT darin — sie kommen aus
 * der Personen-Sammlung und aus den Einstellungen. Hier liegen nur die
 * Überschriften der Abschnitte und der eigene Text.
 */
export const PRACTICE_QUERY = defineQuery(`
  *[_id == "practice"][0]{
    topline, title, lead, image${BILD},
    storyTopline, storyHeadline, storyColumns, storyImage${BILD},
    figures[]{ value, text },
    valuesTopline, valuesHeadline, valuesText, valuesItems[]{ title, text },
    teamTopline, teamHeadline, teamText, teamPhoto${BILD},
    locationsTopline, locationsHeadline, locationsText,
    seo{ title, description, noIndex, image${BILD} }
  }
`);

/**
 * Das Team fürs Raster. Sortiert nach `orderRank` — die Reihenfolge schreibt
 * die Drag-Liste im Studio.
 *
 * Nur Personen mit Slug: Ohne ihn gäbe es keine Detailseite, und eine Kachel,
 * die ins Leere führt, ist schlechter als keine.
 *
 * **Ohne `image`.** Das Raster zeigt keine Porträts (die Begründung steht in
 * `components/sections/Team.astro`), und eine Abfrage, die ein Bild holt, das
 * niemand rendert, schleppt bei vierzehn Personen vierzehn Bildmetadaten
 * durch den Build. Das Porträt holt `PERSON_QUERY` für die eigene Seite.
 */
export const TEAM_QUERY = defineQuery(`
  *[_type == "person" && defined(slug.current)] | order(orderRank) {
    name,
    "slug": slug.current,
    role,
    text
  }
`);

/** Eine Person mit allem, was ihre Seite baut. */
export const PERSON_QUERY = defineQuery(`
  *[_type == "person" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    role,
    text,
    quote,
    image${BILD},
    bio,
    milestones[]{ year, text },
    languages,
    email,
    "focusAreas": focusAreas[]->{ title, "slug": slug.current },
    seo{ title, description, noIndex, image${BILD} }
  }
`);
