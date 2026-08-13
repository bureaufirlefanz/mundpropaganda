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

export type Placement = "tabelle" | "liste" | "versteckt";
export type Group = "aesthetik" | "zahnersatz" | "behandlung";

export interface ServiceEntry {
  slug: string;
  /** Der kurze Name für Tabelle, Menü und Footer. */
  name: string;
  placement?: Placement;
  group?: Group;
  tag?: string;
  /** Bild am Zeiger in der Services-Tabelle. Aus dem CMS oder lokal. */
  preview?: CmsImageValue | string;
}

/** Überschriften der Menüspalten. Reihenfolge = Reihenfolge im Menü. */
export const GROUPS: { value: Group; title: string }[] = [
  { value: "aesthetik", title: "Ästhetik" },
  { value: "zahnersatz", title: "Zahnersatz" },
  { value: "behandlung", title: "Behandlung" },
];

/* Einmal je Build holen. Drei Bausteine auf mehreren Seiten fragen dieselbe
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
 * Tabelle, Menü und Fuß — vorher wäre die ganze Liste auf den alten Stand
 * zurückgefallen, also auf elf Leistungen, die er dort nicht mehr sieht.
 */
export function loadServiceList(): Promise<ServiceEntry[]> {
  cached ??= sanityClient
    .fetch(SERVICE_LIST_QUERY)
    .then(withoutNull)
    .then((list) => list ?? [])
    .catch(() => []);

  return cached;
}

/** Die Zeilen der Services-Tabelle — mit Vorschaupicture. */
export const forTable = (list: ServiceEntry[]) =>
  list.filter((l) => (l.placement ?? "tabelle") === "tabelle");

/** Die schlichten Links darunter. */
export const forList = (list: ServiceEntry[]) =>
  list.filter((l) => l.placement === "liste");

/** Eine Menüspalte. „versteckt" meint nur die Startseite, nicht das Menü. */
export const forGroup = (list: ServiceEntry[], group: Group) =>
  list.filter((l) => l.group === group);

export const servicePath = (entry: ServiceEntry) => `/leistungen/${entry.slug}`;
