import { sanityClient } from "sanity:client";
import { STARTSEITE_QUERY } from "./queries";
import type { Bildquelle } from "./bilder";

/**
 * Die Inhalte der Startseite aus dem CMS.
 *
 * Alles ist wahlfrei. Was fehlt, bleibt `undefined` — und die Bausteine
 * setzen dann den Text ein, der heute in ihnen steht. Deshalb gibt es hier
 * KEINE Beispieldaten: Sie stünden ein zweites Mal neben denen in den
 * Komponenten, und beim nächsten Textwechsel pflegte jemand nur eine der
 * beiden Stellen.
 *
 * Der Preis dafür: Ein Feld, das die Redaktion absichtlich leert, fällt auf
 * den eingebauten Text zurück statt zu verschwinden. Das ist die richtige
 * Richtung — eine leere Startseite ist ein größerer Schaden als ein
 * überflüssiger Satz.
 */

export interface StartseiteInhalt {
  heroZeilen?: string[];

  splitTopline?: string;
  splitTitel?: string;
  splitAbsaetze?: string[];
  splitBild?: Bildquelle;

  servicesTitel?: string;
  servicesZusatz?: { text: string; ziel?: string }[];

  standardsTitel?: string;
  standardsEintraege?: { name: string; text?: string }[];
  standardsBild?: Bildquelle;

  standorteTitel?: string;
  standorteBilder?: { bild: Bildquelle; beschriftung?: string }[];

  expertenTitel?: string;
  expertenText?: string;
  expertenNamen?: string;
  expertenBild?: Bildquelle;

  storiesEintraege?: { name: string; bild?: Bildquelle; zitat?: string }[];

  magazinTopline?: string;
  magazinTitel?: string;
  magazinText?: string;

  faqTitel?: string;
  faqText?: string;
  faq?: { frage: string; antwort?: string }[];

  seo?: { titel?: string; beschreibung?: string; nichtIndexieren?: boolean };
}

/* Einmal je Build. Die Seite besteht aus einem Dutzend Bausteinen, die alle
   aus demselben Dokument lesen — ohne das Merken wäre es ein Dutzend
   Abfragen für eine Antwort. */
let gemerkt: Promise<StartseiteInhalt> | null = null;

export function ladeStartseite(): Promise<StartseiteInhalt> {
  gemerkt ??= sanityClient
    .fetch<StartseiteInhalt | null>(STARTSEITE_QUERY)
    /* Leere Zeichenketten wie fehlende Felder behandeln: Ein Feld, das im
       Studio angefasst und wieder geleert wurde, ist "" und nicht
       undefined — ohne diese Reinigung stünde auf der Seite nichts, statt
       dass der eingebaute Text greift. */
    .then((d) => saeubere(d ?? {}))
    .catch(() => ({}));

  return gemerkt;
}

function saeubere<T extends object>(d: T): T {
  const raus: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    raus[k] = v;
  }
  return raus as T;
}
