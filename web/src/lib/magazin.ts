import { sanityClient } from "sanity:client";
import { ohneNull, type OhneNull } from "./ohne-null";
import type {
  BEITRAEGE_QUERY_RESULT,
  BEITRAG_QUERY_RESULT,
  MAGAZIN_INDEX_QUERY_RESULT,
} from "./sanity.types";
import { BEITRAEGE_QUERY, BEITRAG_QUERY, MAGAZIN_INDEX_QUERY } from "./queries";

/**
 * Die Magazinbeiträge.
 *
 * Bis hierher standen vier Beiträge fest im Markup von `Magazine.astro` —
 * Kategorie, Titel, Anrisstext und Bild, dazu zwei Links auf `#`. Der Kunde
 * konnte im Studio nichts daran ändern, weil es das Feld nicht gab; und der
 * Dokumenttyp `beitrag` lag seit Aufgabe 3 auf Eis, weil ihm die Route
 * fehlte. Beides ist jetzt aufgelöst.
 *
 * Kein Rückfall auf Beispielbeiträge: Gibt es keine, zeigt das Karussell
 * nichts, und der Abschnitt verschwindet. Ein erfundener Magazinbeitrag wäre
 * die teuerste Sorte Platzhalter — er sieht aus wie ein Versprechen an
 * Patientinnen und Patienten.
 */

export type Beitrag = NonNullable<OhneNull<BEITRAEGE_QUERY_RESULT>>[number];
export type BeitragVoll = NonNullable<OhneNull<BEITRAG_QUERY_RESULT>>;
export type MagazinKopf = NonNullable<OhneNull<MAGAZIN_INDEX_QUERY_RESULT>>;

/** Klartext für die Kategorie-Pille auf der Karte. */
const KATEGORIEN: Record<string, string> = {
  behandlung: "Behandlung",
  vorsorge: "Vorsorge",
  technik: "Material & Technik",
  praxis: "Praxis",
};

export const kategorieText = (wert?: string) => (wert ? (KATEGORIEN[wert] ?? wert) : "");

export const beitragPfad = (slug: string) => `/magazin/${slug}`;

/* Einmal je Build und je Filter. Start- und Leistungsseiten fragen dieselbe
   Liste ab — auf der Startseite alle, auf einer Leistungsseite die zu ihr
   gehörenden. */
const gemerkt = new Map<string, Promise<Beitrag[]>>();

/**
 * Die Beiträge, neueste zuerst.
 *
 * Mit `leistung` nur die, die im Studio auf genau diese Leistung verweisen.
 * Dafür ist die Referenz im Schema da: Die Leistungsseite zeigt passende
 * Beiträge, ohne dass jemand sie dort einzeln einträgt.
 */
export function ladeBeitraege(leistung?: string): Promise<Beitrag[]> {
  const schluessel = leistung ?? "*";
  if (!gemerkt.has(schluessel)) {
    gemerkt.set(
      schluessel,
      sanityClient
        .fetch(BEITRAEGE_QUERY, { leistung: leistung ?? null })
        .then(ohneNull)
        .then((liste) => liste ?? [])
        .catch(() => [])
    );
  }
  return gemerkt.get(schluessel)!;
}

export async function ladeBeitrag(slug: string): Promise<BeitragVoll | undefined> {
  try {
    return ohneNull(await sanityClient.fetch(BEITRAG_QUERY, { slug })) ?? undefined;
  } catch {
    return undefined;
  }
}

export async function ladeMagazinKopf(): Promise<MagazinKopf | undefined> {
  try {
    return ohneNull(await sanityClient.fetch(MAGAZIN_INDEX_QUERY)) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Deutsches Datum, wie es unter einem Beitrag steht. */
export const datumText = (wert?: string) =>
  wert
    ? new Date(wert).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })
    : "";
