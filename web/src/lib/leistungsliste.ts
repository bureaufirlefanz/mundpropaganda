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
  /**
   * Der ausgeschriebene Name, der als Überschrift der Seite steht. Fehlt er,
   * gilt der kurze. Im CMS ist das umgekehrt gedacht: dort ist `titel` das
   * Pflichtfeld und `kurzname` die Ausnahme — hier trägt die Liste beides,
   * weil sie ohne CMS auskommen muss.
   */
  titel?: string;
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

/**
 * Der Stand aus dem Prototyp. Trägt die Seite, solange im Studio noch nichts
 * gepflegt ist — und ist zugleich die Vorlage für die Seed-Datei.
 *
 * Die Namen sind hier auf **einen** je Leistung vereinheitlicht. Tabelle und
 * Menü führten dieselbe Leistung bisher unter zwei Schreibweisen
 * („Weisheitszahnentfernung" gegen „Weisheitszähne"); das war keine Absicht,
 * sondern doppelt gepflegtes Markup.
 */
export const beispielListe: LeistungsEintrag[] = [
  /* Reihenfolge = Relevanz. Sie bestimmt, wie Tabelle, Menü und Footer
     sortieren — im Studio zieht man die Liste, hier steht sie fest.

     `name` ist der KURZE Name für Aufzählungen. Der lange Seitentitel steht
     im Dokument der Leistung; die Abfrage setzt beides über
     `coalesce(kurzname, titel)` zusammen. „CMD mit Botoxbehandlung und
     elektronischer Kiefergelenksvermessung" in einer Menüspalte wäre sonst
     drei Zeilen hoch. */
  { slug: "veneers", name: "Veneers", platzierung: "tabelle", gruppe: "aesthetik", tag: "P25", vorschau: "/img/teeth-macro-640.webp" },
  { slug: "zahnimplantate", name: "Zahnimplantate", platzierung: "tabelle", gruppe: "zahnersatz", tag: "P25", vorschau: "/img/lab-veneers-640.webp" },
  { slug: "keramikinlays", name: "Keramikinlays", platzierung: "tabelle", gruppe: "aesthetik", tag: "P25", vorschau: "/img/treatment-02-640.webp" },
  { slug: "zahnersatz-prothetik", name: "Zahnersatz / Prothetik", platzierung: "tabelle", gruppe: "zahnersatz", tag: "P25", vorschau: "/img/treatment-01-640.webp" },
  { slug: "bleaching", name: "Bleaching", platzierung: "tabelle", gruppe: "aesthetik", tag: "P25", vorschau: "/img/smile-portrait-563.webp" },
  { slug: "aligner", name: "Aligner", titel: "Aligner / Unsichtbare Zahnspange", platzierung: "tabelle", gruppe: "aesthetik", tag: "P25", vorschau: "/img/treatment-03-640.webp" },

  { slug: "weisheitszahnentfernung", name: "Weisheitszähne", titel: "Weisheitszahnentfernung mit Eigenblutbehandlung", platzierung: "liste", gruppe: "behandlung" },
  { slug: "wurzelbehandlung", name: "Wurzelbehandlung", titel: "Wurzelbehandlung unterm Mikroskop", platzierung: "liste", gruppe: "behandlung" },
  { slug: "cmd-behandlung", name: "CMD-Behandlung", titel: "CMD mit Botoxbehandlung und elektronischer Kiefergelenksvermessung", platzierung: "liste", gruppe: "behandlung" },
  { slug: "prophylaxe", name: "Prophylaxe", titel: "Prophylaxe / Professionelle Zahnreinigung", platzierung: "liste", gruppe: "behandlung" },
  { slug: "parodontitis-behandlung", name: "Parodontitis", titel: "Parodontitis-Behandlung", platzierung: "liste", gruppe: "behandlung" },
];

/**
 * Trägt die Collection die Listen schon?
 *
 * Nicht `length > 0`: die Felder für den Listeneintrag sind neu, ein
 * bestehendes Dokument hat sie noch nicht. Ohne `gruppe` fiele jede Leistung
 * aus allen Menüspalten heraus — die Seite hätte ein leeres Menü, und das ist
 * nie gemeint. Solange niemand die Felder gepflegt hat, trägt die
 * Beispielliste; ab dem ersten gepflegten Eintrag die Collection.
 */
const istGepflegt = (liste: LeistungsEintrag[]) =>
  liste.some((l) => Boolean(l.gruppe));

/* Einmal je Build holen. Drei Bausteine auf mehreren Seiten fragen dieselbe
   Liste ab — ohne das Merken wären es entsprechend viele Anfragen für dieselbe
   Antwort. */
let gemerkt: Promise<LeistungsEintrag[]> | null = null;

export function ladeLeistungsliste(): Promise<LeistungsEintrag[]> {
  gemerkt ??= sanityClient
    .fetch(LEISTUNGSLISTE_QUERY)
    .then(ohneNull)
    .then((liste) => (liste?.length && istGepflegt(liste) ? liste : beispielListe))
    .catch(() => beispielListe);

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
