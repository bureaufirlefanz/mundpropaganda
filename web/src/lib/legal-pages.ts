import { sanityClient } from "sanity:client";
import { withoutNull, type WithoutNull } from "./without-null";
import type {
  LEGAL_PAGES_QUERY_RESULT,
  LEGAL_PAGE_QUERY_RESULT,
} from "./sanity.types";
import { LEGAL_PAGES_QUERY, LEGAL_PAGE_QUERY } from "./queries";
import { fallbackFor } from "./loading";

/**
 * Impressum, Datenschutz, Barrierefreiheit.
 *
 * Der Typ `rechtstext` gab es im Studio seit Anfang an — ausgeblendet, weil
 * die Website keine Route dafür hatte. Der Seitenfuß hatte das Feld
 * `legalLinks` und ließ es leer; im Schema stand als Begründung, die Zeile
 * bleibe leer, „solange es die Rechtstexte noch nicht gibt", statt auf „#"
 * zu zeigen. Genau das ist jetzt aufgelöst.
 *
 * Kein Rückfall auf eingebauten Text. Ein Impressum, das die Website selbst
 * mitbringt, wäre die gefährlichste Sorte Platzhalter: Es sieht vollständig
 * aus, steht unter fremdem Namen und ist rechtlich falsch.
 */

export type LegalPageCard = NonNullable<
  WithoutNull<LEGAL_PAGES_QUERY_RESULT>
>[number];
export type LegalPage = NonNullable<WithoutNull<LEGAL_PAGE_QUERY_RESULT>>;

let cached: Promise<LegalPageCard[]> | null = null;

/** Alle Rechtstexte — für `getStaticPaths` und die Zeile im Seitenfuß. */
export function loadLegalPages(): Promise<LegalPageCard[]> {
  cached ??= sanityClient
    .fetch(LEGAL_PAGES_QUERY)
    .then(withoutNull)
    .then((liste) => liste ?? [])
    .catch(fallbackFor("die Rechtstexte", []));
  return cached;
}

/** Ein einzelner Rechtstext mit Fließtext. */
export async function loadLegalPage(
  slug: string,
): Promise<LegalPage | undefined> {
  return sanityClient
    .fetch(LEGAL_PAGE_QUERY, { slug })
    .then((d) => withoutNull(d) ?? undefined)
    .catch(fallbackFor("einen Rechtstext", undefined));
}
