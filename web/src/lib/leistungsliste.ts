import { sanityClient } from "sanity:client";
import { ohneNull } from "./ohne-null";
import { LEISTUNGSLISTE_QUERY } from "./queries";
import type { CmsBild } from "./bilder";

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

export interface LeistungsEintrag {
  slug: string;
  /** Der kurze Name für Tabelle, Menü und Footer. */
  name: string;
  platzierung?: Platzierung;
  gruppe?: Gruppe;
  tag?: string;
  /** Bild am Zeiger in der Services-Tabelle. Aus dem CMS oder lokal. */
  vorschau?: CmsBild | string;
}

/** Überschriften der Menüspalten. Reihenfolge = Reihenfolge im Menü. */
export const GRUPPEN: { wert: Gruppe; titel: string }[] = [
  { wert: "aesthetik", titel: "Ästhetik" },
  { wert: "zahnersatz", titel: "Zahnersatz" },
  { wert: "behandlung", titel: "Behandlung" },
];

/* Einmal je Build holen. Drei Bausteine auf mehreren Seiten fragen dieselbe
   Liste ab — ohne das Merken wären es entsprechend viele Anfragen für dieselbe
   Antwort. */
let gemerkt: Promise<LeistungsEintrag[]> | null = null;

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
export function ladeLeistungsliste(): Promise<LeistungsEintrag[]> {
  gemerkt ??= sanityClient
    .fetch(LEISTUNGSLISTE_QUERY)
    .then(ohneNull)
    .then((liste) => liste ?? [])
    .catch(() => []);

  return gemerkt;
}

/** Die Zeilen der Services-Tabelle — mit Vorschaubild. */
export const fuerTabelle = (liste: LeistungsEintrag[]) =>
  liste.filter((l) => (l.platzierung ?? "tabelle") === "tabelle");

/** Die schlichten Links darunter. */
export const fuerListe = (liste: LeistungsEintrag[]) =>
  liste.filter((l) => l.platzierung === "liste");

/** Eine Menüspalte. „versteckt" meint nur die Startseite, nicht das Menü. */
export const fuerGruppe = (liste: LeistungsEintrag[], gruppe: Gruppe) =>
  liste.filter((l) => l.gruppe === gruppe);

export const pfad = (eintrag: LeistungsEintrag) => `/leistungen/${eintrag.slug}`;
