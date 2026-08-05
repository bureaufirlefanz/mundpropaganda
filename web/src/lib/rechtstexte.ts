import { sanityClient } from "sanity:client";
import { ohneNull, type OhneNull } from "./ohne-null";
import type {
  RECHTSTEXTE_QUERY_RESULT,
  RECHTSTEXT_QUERY_RESULT,
} from "./sanity.types";
import { RECHTSTEXTE_QUERY, RECHTSTEXT_QUERY } from "./queries";

/**
 * Impressum, Datenschutz, Barrierefreiheit.
 *
 * Der Typ `rechtstext` gab es im Studio seit Anfang an — ausgeblendet, weil
 * die Website keine Route dafür hatte. Der Seitenfuß hatte das Feld
 * `rechtliches` und ließ es leer; im Schema stand als Begründung, die Zeile
 * bleibe leer, „solange es die Rechtstexte noch nicht gibt", statt auf „#"
 * zu zeigen. Genau das ist jetzt aufgelöst.
 *
 * Kein Rückfall auf eingebauten Text. Ein Impressum, das die Website selbst
 * mitbringt, wäre die gefährlichste Sorte Platzhalter: Es sieht vollständig
 * aus, steht unter fremdem Namen und ist rechtlich falsch.
 */

export type RechtstextKarte = NonNullable<OhneNull<RECHTSTEXTE_QUERY_RESULT>>[number];
export type Rechtstext = NonNullable<OhneNull<RECHTSTEXT_QUERY_RESULT>>;

let gemerkt: Promise<RechtstextKarte[]> | null = null;

/** Alle Rechtstexte — für `getStaticPaths` und die Zeile im Seitenfuß. */
export function ladeRechtstexte(): Promise<RechtstextKarte[]> {
  gemerkt ??= sanityClient
    .fetch(RECHTSTEXTE_QUERY)
    .then(ohneNull)
    .then((liste) => liste ?? [])
    .catch(() => []);
  return gemerkt;
}

/** Ein einzelner Rechtstext mit Fließtext. */
export async function ladeRechtstext(slug: string): Promise<Rechtstext | undefined> {
  try {
    return ohneNull(await sanityClient.fetch(RECHTSTEXT_QUERY, { slug })) ?? undefined;
  } catch {
    return undefined;
  }
}
