import { sanityClient } from "sanity:client";
import { ohneNull } from "./ohne-null";
import { STARTSEITE_QUERY } from "./queries";
import type { Bildquelle } from "./bilder";

/**
 * Die Inhalte der Startseite aus dem CMS.
 *
 * Bis Aufgabe 4 war hier alles wahlfrei, und was fehlte, ließen die Bausteine
 * durch ihre eigenen Vorgaben ersetzen. Das ist abgeschafft: Ein Feld, das die
 * Redaktion leert, VERSCHWINDET von der Seite. Nichts tritt an seine Stelle.
 *
 * Die Klassifizierung steht in diesem Vertrag und ist an ihm ablesbar:
 *
 *   `feld: T`   Klasse 1 — trägt die Seite. Im Schema `required()`, das Studio
 *               verweigert den Publish ohne. Der Baustein darf sich darauf
 *               verlassen und hat keine Vorgabe mehr.
 *   `feld?: T`  Klasse 2 — wahlfrei. Fehlt es, blendet der Baustein die Stelle
 *               aus. Kein Ersatz.
 *
 * Klasse 3 kommt hier nicht vor: Was nie gepflegt wird, hat gar kein Feld und
 * steht fest im Baustein.
 *
 * Bilder sind die bewusste Ausnahme in Klasse 2. Sie fallen weiter auf das
 * gestaltete Motiv aus der lokalen Bildpipeline zurück, statt den Abschnitt
 * auszublenden — der Kunde hat dieses Foto nie getippt. Ein leeres Bildfeld
 * heißt „noch nicht hochgeladen“, nicht „bewusst gelöscht“.
 */

export interface StartseiteInhalt {
  heroZeilen: string[];

  splitTopline: string;
  splitTitel: string;
  splitAbsaetze: string[];
  splitBild?: Bildquelle;

  servicesTitel: string;

  standardsTitel: string;
  standardsEintraege: { name: string; text?: string }[];

  standorteTitel: string;

  expertenTitel: string;
  expertenNamen: string;
  expertenAbsaetze: string[];
  expertenBild?: Bildquelle;

  storiesEintraege: { name: string; bild?: Bildquelle; zitat?: string }[];

  magazinTopline: string;
  magazinTitel: string;
  magazinText: string;

  faqTitel: string;
  faqText?: string;
  faq: { frage: string; antwort?: string }[];

  /**
   * Suchmaschinen- und Teilen-Angaben. Kein sichtbarer Seiteninhalt, deshalb
   * gilt die Regel der Aufgabe hier nicht: Ein Dokument ohne `<title>` ist
   * kaputt, nicht leer. Fehlt der Titel, nimmt die Seite ihren eigenen — genau
   * das sagt das Schema dem Kunden auch zu.
   */
  seo?: {
    titel?: string;
    beschreibung?: string;
    nichtIndexieren?: boolean;
    bild?: Bildquelle;
  };
}

/* Die Felder der Klasse 1, aufgeteilt nach ihrer leeren Form. Diese beiden
   Listen sind die einzige Stelle, an der die Zusage „das Feld ist da“
   eingelöst wird — der Rest der Anwendung liest sie am Vertrag oben ab.

   Warum überhaupt auffüllen, wo das Schema `required()` sagt: Sanity kann den
   Publish verweigern, aber der Build liest ein Dataset, nicht das Studio. Ein
   vor der Regel angelegtes Dokument, ein Import, ein von Hand gelöschtes Feld
   — in all diesen Fällen fehlt der Wert trotzdem. Dann steht die Stelle LEER
   da. Genau das ist der Sinn der Aufgabe: sichtbar nichts, statt eines
   Satzes, den niemand mehr im Studio findet. */
const PFLICHT_TEXT = [
  "splitTopline",
  "splitTitel",
  "servicesTitel",
  "standardsTitel",
  "standorteTitel",
  "expertenTitel",
  "expertenNamen",
  "magazinTopline",
  "magazinTitel",
  "magazinText",
  "faqTitel",
] as const;

const PFLICHT_LISTE = [
  "heroZeilen",
  "splitAbsaetze",
  "standardsEintraege",
  "expertenAbsaetze",
  "storiesEintraege",
  "faq",
] as const;

/* Einmal je Build. Die Seite besteht aus einem Dutzend Bausteinen, die alle
   aus demselben Dokument lesen — ohne das Merken wäre es ein Dutzend
   Abfragen für eine Antwort. */
let gemerkt: Promise<StartseiteInhalt> | null = null;

export function ladeStartseite(): Promise<StartseiteInhalt> {
  gemerkt ??= sanityClient
    .fetch(STARTSEITE_QUERY)
    .then(ohneNull)
    .then((d) => vervollstaendige(saeubere(d ?? {})))
    .catch(() => vervollstaendige({}));

  return gemerkt;
}

/**
 * Leere Zeichenketten und leere Listen wie fehlende Felder behandeln.
 *
 * Ein Feld, das im Studio angefasst und wieder geleert wurde, kommt als `""`
 * an und nicht als `undefined`. Ohne diese Reinigung wäre der Unterschied
 * zwischen „nie gepflegt“ und „bewusst geleert“ im Frontend sichtbar, obwohl
 * er für die Seite keiner ist.
 */
function saeubere(d: object): Record<string, unknown> {
  const raus: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    raus[k] = v;
  }
  return raus;
}

/** Die Zusage der Klasse 1 einlösen: Das Feld ist da — notfalls leer. */
function vervollstaendige(d: Record<string, unknown>): StartseiteInhalt {
  for (const k of PFLICHT_TEXT) d[k] ??= "";
  for (const k of PFLICHT_LISTE) d[k] ??= [];
  return d as unknown as StartseiteInhalt;
}
