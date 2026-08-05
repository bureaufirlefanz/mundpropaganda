import { sanityClient } from "sanity:client";
import { ohneNull, type OhneNull } from "./ohne-null";
import type { KARRIERE_QUERY_RESULT, STELLEN_QUERY_RESULT } from "./sanity.types";
import { KARRIERE_QUERY, STELLEN_QUERY } from "./queries";

/**
 * Die Karriereseite aus dem CMS.
 *
 * Diese Datei trug bis hierher 291 Zeilen Inhalt: vier Stellenausschreibungen,
 * drei Stimmen aus dem Team, zehn Zeilen Vergleichstabelle, vier Etappen des
 * Bewerbungsablaufs und sechs Fragen. Nichts davon konnte der Kunde
 * erreichen — er konnte nicht einmal eine besetzte Stelle abschalten.
 *
 * Ihr eigener Kommentar sagte, die Formen seien „bereits so geschnitten, dass
 * ein Sanity-Dokumenttyp `stelle` sie eins zu eins abbildet“. Das stimmte:
 * Der Typ existierte, stand im Studio und wurde von niemandem gelesen.
 *
 * Kein Rückfall auf Beispieldaten. Fehlt ein Abschnitt, erscheint er nicht —
 * eine erfundene Stellenausschreibung wäre die teuerste Sorte Platzhalter.
 */

export type Karriere = NonNullable<OhneNull<KARRIERE_QUERY_RESULT>>;
export type Stelle = NonNullable<OhneNull<STELLEN_QUERY_RESULT>>[number];

/** Adresse für Bewerbungen mit vorbereitetem Betreff. */
export const bewerbungLink = (mail: string, stelle?: { titel?: string }) =>
  `mailto:${mail}?subject=${encodeURIComponent(
    stelle?.titel ? `Bewerbung: ${stelle.titel}` : "Initiativbewerbung"
  )}`;

let gemerkt: Promise<Karriere | undefined> | null = null;
let gemerktStellen: Promise<Stelle[]> | null = null;

export function ladeKarriere(): Promise<Karriere | undefined> {
  gemerkt ??= sanityClient
    .fetch(KARRIERE_QUERY)
    .then(ohneNull)
    .then((d) => d ?? undefined)
    .catch(() => undefined);
  return gemerkt;
}

/**
 * Die ausgeschriebenen Stellen.
 *
 * `aktiv != false` und nicht `aktiv == true`: Ein Dokument, das vor dem Feld
 * angelegt wurde, hat es gar nicht — und wäre mit der strengen Prüfung
 * unsichtbar, obwohl niemand es abgeschaltet hat.
 */
export function ladeStellen(): Promise<Stelle[]> {
  gemerktStellen ??= sanityClient
    .fetch(STELLEN_QUERY)
    .then(ohneNull)
    .then((liste) => liste ?? [])
    .catch(() => []);
  return gemerktStellen;
}
