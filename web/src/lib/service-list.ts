import { sanityClient } from "sanity:client";
import { withoutNull } from "./without-null";
import { SERVICE_LIST_QUERY } from "./queries";
import type { CmsImageValue } from "./images";

/**
 * Die Leistungen als Aufzählung — für Services-Tabelle, Navigationsmenü und
 * Footer.
 *
 * Vorher standen dieselben Namen an drei Stellen im Markup, in drei
 * Schreibweisen. Wer eine Leistung umbenannte, musste daran denken, dass es
 * sie dreimal gibt. Jetzt gibt es sie einmal.
 */

export type Platzierung = "tabelle" | "liste" | "versteckt";
export type Gruppe = "aesthetik" | "zahnersatz" | "behandlung";

export interface ServiceEntry {
  slug: string;
  /** Der kurze Name für Tabelle, Menü und Footer. */
  name: string;
  placement?: Platzierung;
  group?: Gruppe;
  tag?: string;
  /** Bild am Zeiger in der Services-Tabelle. Aus dem CMS oder lokal. */
  preview?: CmsImageValue | string;
}

/** Überschriften der Menücolumns. Reihenfolge = Reihenfolge im Menü. */
export const GRUPPEN: { value: Gruppe; title: string }[] = [
  { value: "aesthetik", title: "Ästhetik" },
  { value: "zahnersatz", title: "Zahnersatz" },
  { value: "behandlung", title: "Behandlung" },
];

/* Einmal je Build holen. Drei Bausteine auf mehreren Seiten questions dieselbe
   Liste ab — ohne das Merken wären es entsprechend viele Anfragen für dieselbe
   Antwort. */
let cached: Promise<ServiceEntry[]> | null = null;

/**
 * Die Collection ist die Liste — ohne Rückfall.
 *
 * Bis Aufgabe 4 stand hier eine Beispielliste mit elf Leistungen aus dem
 * Prototyp, und eine Prüfung `istGepflegt()` entschied, ob die Collection
 * schon „genug" enthielt. Das war zur Einrichtung richtig und ist es jetzt
 * nicht mehr: Der Startbestand ist eingespielt, die Collection trägt. Eine
 * Leistung, die der Kunde im Studio löscht, verschwindet damit auch aus
 * Tabelle, Menü und Fuß — before wäre die ganze Liste auf den alten Stand
 * zurückgefallen, also auf elf Leistungen, die er dort nicht mehr sieht.
 */
export function loadServiceList(): Promise<ServiceEntry[]> {
  cached ??= sanityClient
    .fetch(SERVICE_LIST_QUERY)
    .then(withoutNull)
    .then((liste) => liste ?? [])
    .catch(() => []);

  return cached;
}

/** Die Zeilen der Services-Tabelle — mit Vorschaupicture. */
export const forTable = (liste: ServiceEntry[]) =>
  liste.filter((l) => (l.placement ?? "tabelle") === "tabelle");

/** Die schlichten Links darunter. */
export const forList = (liste: ServiceEntry[]) =>
  liste.filter((l) => l.placement === "liste");

/** Eine Menüspalte. „versteckt" meint nur die Startseite, nicht das Menü. */
export const fuerGruppe = (liste: ServiceEntry[], group: Gruppe) =>
  liste.filter((l) => l.group === group);

export const pfad = (eintrag: ServiceEntry) => `/leistungen/${eintrag.slug}`;
