import { sanityClient } from "sanity:client";
import { withoutNull, type WithoutNull } from "./without-null";
import type { CAREERS_QUERY_RESULT, JOBS_QUERY_RESULT } from "./sanity.types";
import { CAREERS_QUERY, JOBS_QUERY } from "./queries";
import { fallbackFor } from "./loading";

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

export type CareersContent = NonNullable<WithoutNull<CAREERS_QUERY_RESULT>>;
export type Job = NonNullable<WithoutNull<JOBS_QUERY_RESULT>>[number];

/** Adresse für Bewerbungen mit vorbereitetem Betreff. */
export const applicationLink = (mail: string, job?: { title?: string }) =>
  `mailto:${mail}?subject=${encodeURIComponent(
    job?.title ? `Bewerbung: ${job.title}` : "Initiativbewerbung",
  )}`;

let cached: Promise<CareersContent | undefined> | null = null;
let cachedJobs: Promise<Job[]> | null = null;

export function loadCareers(): Promise<CareersContent | undefined> {
  cached ??= sanityClient
    .fetch(CAREERS_QUERY)
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("die Karriereseite", undefined));
  return cached;
}

/**
 * Die ausgeschriebenen Stellen.
 *
 * `active != false` und nicht `active == true`: Ein Dokument, das vor dem Feld
 * angelegt wurde, hat es gar nicht — und wäre mit der strengen Prüfung
 * unsichtbar, obwohl niemand es abgeschaltet hat.
 */
export function loadJobs(): Promise<Job[]> {
  cachedJobs ??= sanityClient
    .fetch(JOBS_QUERY)
    .then(withoutNull)
    .then((liste) => liste ?? [])
    .catch(fallbackFor("die Stellenliste", []));
  return cachedJobs;
}
