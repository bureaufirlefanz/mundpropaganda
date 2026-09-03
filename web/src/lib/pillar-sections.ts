import type { ImageSource } from "./images";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Die Abschnittstypen einer Pillar Page.
 *
 * **Das ist der Vertrag zwischen Inhalt und Vorlage — und zwar der einzige.**
 * `templates/Pillar.astro` verteilt ausschließlich anhand dieser Union, und
 * jede Quelle, die eine Pillar Page füllen will, muss sie erfüllen.
 *
 * Heute ist diese Quelle eine Datei unter `content/`. Später wird es Sanity.
 * Genau dafür stehen die Typen hier und nicht im Frontmatter der Vorlage:
 * Wenn der Baukasten ins Schema wandert, wird `PILLAR_QUERY` gegen diese
 * Formen geschrieben, die Vorlage bleibt unverändert, und der Umzug ist ein
 * Austausch des Imports in der Route.
 *
 * Die Feldnamen sind deshalb schon jetzt die, die das Schema tragen soll —
 * `_type` als Unterscheider, `_key` als stabiler Schlüssel je Eintrag. Beides
 * vergibt Sanity von selbst; hier stehen sie von Hand, damit die Form
 * dieselbe ist.
 *
 * ── Bilder ───────────────────────────────────────────────────────────────
 *
 * `image` ist EIN Feld für zwei Quellen: ein Bild aus dem CMS oder der Name
 * eines gestalteten Motivs aus `lib/image-widths.json`. `CmsImage.astro`
 * unterscheidet das selbst — `ImageSource` ist genau dafür
 * `CmsImageValue | string`. Zwei Felder nebeneinander wären ein zweiter Weg
 * durch dieselbe Stelle, und einer davon bliebe beim Umzug ins CMS
 * ungetestet.
 *
 * Solange die Inhalte lokal liegen, stehen dort Motivnamen. Sobald die
 * Redaktion eigene Aufnahmen hochlädt, steht dort ein Bild.
 */

/**
 * Gemeinsam: jeder Abschnitt trägt Typ, Schlüssel — und wahlfrei eine kurze
 * Beschriftung für die Navigation.
 *
 * **`navLabel` ist nicht die Überschrift.** Auf der Seite steht „Müssen die
 * Zähne für Veneers abgeschliffen werden?", im Verzeichnis und im Dock steht
 * „Abschleifen". Eine Navigation mit zehn ausgeschriebenen Fragen ist keine
 * Übersicht mehr, sondern der Text ein zweites Mal.
 *
 * Aus `navLabel` entsteht auch die Sprungmarke: `/veneers-berlin#abschleifen`
 * statt `#muessen-die-zaehne-fuer-veneers-abgeschliffen-werden`. Kürzer,
 * teilbar, und beim Umformulieren der Überschrift bleibt die Adresse stehen.
 *
 * Ohne `navLabel` bekommt der Abschnitt keinen Eintrag — so entscheidet der
 * Inhalt, was in die Navigation gehört, und nicht der Typ.
 */
interface SectionBase {
  _key: string;
  navLabel?: string;
}

/**
 * „Auf einen Blick" — Begriff und Angabe, vier bis sechs Zeilen.
 *
 * Nicht `sectionFacts`: Das sind Zahlen mit Einheit. Hier stehen ebenso oft
 * Sätze („Bei rein ästhetischer Indikation keine Erstattung"), und die in ein
 * Zahlenfeld zu zwingen hieße, die Antwort in die Einheit zu schreiben.
 */
export interface PillarQuickFacts extends SectionBase {
  _type: "quickFacts";
  topline?: string;
  headline?: string;
  items: { label: string; value: string }[];
}

/**
 * Das Inhaltsverzeichnis.
 *
 * Trägt selbst keine Einträge: Die entstehen aus den Überschriften der
 * Abschnitte, die danach kommen. Ein gepflegtes Verzeichnis liefe
 * auseinander, sobald jemand einen Abschnitt umbenennt — und zwar lautlos.
 */
export interface PillarContents extends SectionBase {
  _type: "contents";
  headline?: string;
  /** Das Porträt rechts neben der Liste. */
  image?: ImageSource;
  alt?: string;
  /** Rechtsbündig unter der Fläche, z. B. der Name der Person. */
  caption?: string;
}

/** Zweispaltiger Einstieg. */
export interface PillarIntro extends SectionBase {
  _type: "intro";
  topline?: string;
  headline: string;
  columns: string[];
  /** Bild über den Spalten, mittig und schmäler als die Seite. */
  image?: ImageSource;
  alt?: string;
  /** `centered` ist die Fassung der Pillar Pages — siehe `Intro.astro`. */
  variant?: "default" | "centered";
}

/** Eine Preiskarte. `from` setzt das „ab" davor. */
export interface PillarPrice {
  name: string;
  price: string;
  from?: boolean;
  reduction?: string;
  durability?: string;
  /** Steht rechts in der Preis-Pille, z. B. „/ Zahn“ (Figma 177:2029). */
  unit?: string;
}

export interface PillarPricing extends SectionBase {
  _type: "pricing";
  headline: string;
  pricing: PillarPrice[];
  note?: string;
  /** Pflicht, sobald Preise dastehen — siehe Briefing §8. */
  disclaimer: string;
}

/**
 * Vergleichstabelle.
 *
 * **Ohne Hervorhebung.** `Compare.astro` kann eine Spalte betonen; auf einer
 * Pillar Page wird das nicht benutzt. Der Abschnitt soll vergleichen, nicht
 * empfehlen — wer eine Spalte optisch heraushebt, hat die Entscheidung schon
 * getroffen, bevor der Leser die Zeilen gelesen hat.
 */
export interface PillarCompare extends SectionBase {
  _type: "compare";
  /** Wahlfrei: Über der Tabelle steht auf Pillar Pages nur die nummerierte
      Überschrift, keine zweite Zeile darüber. */
  topline?: string;
  headline: string;
  columns: { name: string; meta?: string }[];
  lines: {
    name: string;
    values: { kind: "text" | "ja" | "nein" | "pille"; text?: string }[];
  }[];
  note?: string;
}

/** Der abgesetzte Kasten unter einem Textabschnitt. */
export interface PillarNote {
  variant: "source" | "info" | "warning";
  title?: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

/** Überschrift links, Fließtext rechts, wahlweise ein Bild darüber. */
export interface PillarProse extends SectionBase {
  _type: "prose";
  /** Steht nummeriert über dem Abschnitt (`ui/SectionHeading.astro`). */
  heading: string;
  body: PortableTextBlock[];
  image?: ImageSource;
  alt?: string;
  /** Auf welcher Seite das Bild steht. Die Abschnitte wechseln sich ab. */
  side?: "left" | "right";
  note?: PillarNote;
}

export interface PillarSteps extends SectionBase {
  _type: "steps";
  headline: string;
  steps: { title: string; text: string }[];
}

export interface PillarFaq extends SectionBase {
  _type: "faq";
  headline: string;
  text?: string;
  questions: { question: string; answer?: string }[];
}

/**
 * Vorher/Nachher mit Schieberegler.
 *
 * Nutzt `BeforeAfter.astro` unverändert — denselben Baustein wie die
 * Leistungsseiten. Die Aufnahmen sind wahlfrei; ohne sie greifen die
 * gestalteten Motive, was der Baustein selbst regelt.
 */
export interface PillarBeforeAfter extends SectionBase {
  _type: "beforeAfter";
  topline: string;
  before?: ImageSource;
  after?: ImageSource;
}

/**
 * Patientenstimmen.
 *
 * Trägt selbst keine Einträge: Die kommen aus der Startseite und werden über
 * die Route hereingereicht — dieselbe Quelle wie auf den Leistungsseiten.
 * Zwei gepflegte Fassungen derselben Zitate liefen auseinander.
 */
export interface PillarStories extends SectionBase {
  _type: "stories";
}

/**
 * Der Kontaktbereich, in der erweiterten Fassung.
 *
 * Trägt selbst keinen Text: Überschrift und Einstieg holt `Contact.astro` aus
 * den Einstellungen, wie auf jeder anderen Seite auch. Hier steht nur, welche
 * Leistung vorausgewählt ist und ob die drei Zusatzfelder mitkommen.
 *
 * Die Pillar Page ist heute die einzige Seite mit `extended: true` — siehe den
 * Kopf von `sections/Contact.astro`.
 */
export interface PillarContact extends SectionBase {
  _type: "contact";
  /** Vorauswahl im Feld „Leistung". */
  service?: string;
  /** Rückrufnummer, Erreichbarkeit, vorhandenes Angebot. */
  extended?: boolean;
}

export interface PillarCtaBand extends SectionBase {
  _type: "ctaBand";
  headline: string;
  text?: string;
  actionLabel?: string;
  /** Fertiger Pfad. Die Seite baut keine URLs, sie bekommt sie. */
  actionHref?: string;
  /** Das randabfallende Bild hinter der Karte. */
  image?: ImageSource;
  alt?: string;
}

export type PillarSection =
  | PillarQuickFacts
  | PillarContents
  | PillarIntro
  | PillarPricing
  | PillarCompare
  | PillarProse
  | PillarSteps
  | PillarFaq
  | PillarBeforeAfter
  | PillarStories
  | PillarContact
  | PillarCtaBand;

/** Eine ganze Seite. */
export interface PillarPage {
  title: string;
  topline?: string;
  lead?: string;
  image?: ImageSource;
  /** Alternativtext des Kopfbilds. Leer lassen, wenn es rein dekorativ ist. */
  imageAlt?: string;
  seoDescription?: string;
  /**
   * Der Button im Kopf.
   *
   * Steht hier und nicht als Voreinstellung im Hero: Der Hero der
   * Leistungsseiten springt auf `#kontakt`, weil dort unten ein
   * Kontaktabschnitt steht. Eine Pillar Page hat den nicht zwingend — und
   * ein Button, der ins Leere zeigt, sieht aus wie ein kaputter Klick.
   * `npm run web:check` hat genau das gemeldet.
   */
  action?: { label: string; href: string };
  sections: PillarSection[];
}

/**
 * Der Eintrag eines Abschnitts in Verzeichnis und Navigation.
 *
 * An einer Stelle, weil drei Dinge dieselbe Antwort brauchen: das
 * Inhaltsverzeichnis im Text, die Abschnittsnavigation am unteren Rand und
 * die `id` am Abschnitt selbst. Liefen die auseinander, zeigte das
 * Verzeichnis auf Marken, die es nicht gibt.
 *
 * `null` heißt: kein Eintrag. Der Hero, „Auf einen Blick", das Verzeichnis
 * selbst und die Handlungsbänder sind Ziele oder Wegweiser, keine Kapitel —
 * sie tragen deshalb kein `navLabel`.
 */
export function navLabelOf(section: PillarSection): string | null {
  return section.navLabel ?? null;
}
