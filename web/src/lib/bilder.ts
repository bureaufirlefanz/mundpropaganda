import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "sanity:client";

/**
 * Bild-URLs aus dem CMS.
 *
 * Die Bildpipeline im Prototyp (`npm run images`) erzeugt feste Größen in
 * public/img. Für gepflegte Inhalte geht das nicht: die Datei kommt aus dem
 * Studio, und niemand baut dafür die Seite neu. Stattdessen rechnet Sanitys
 * CDN die Größe zur Laufzeit aus und liefert sie dauerhaft zwischengespeichert
 * aus — `auto("format")` wählt dabei AVIF oder WebP nach Browser, ganz wie die
 * beiden <source>-Zeilen im lokalen Picture-Partial.
 */

/** Was die Abfrage für ein Bildfeld liefert (siehe queries.ts). */
export interface CmsBild {
  _type?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      /** Winziges Base64-JPEG als Platzhalter, bis das Bild da ist. */
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  };
  /** Von der Redaktion gesetzter Bildmittelpunkt. */
  hotspot?: unknown;
  crop?: unknown;
  alt?: string;
}

/**
 * Eine Bildquelle ist entweder ein Bild aus dem CMS oder — solange dort keins
 * gepflegt ist — der Pfad auf ein lokales Motiv. Beides muss dieselbe
 * Komponente annehmen können, sonst bräuchte jede Section zwei Zweige.
 */
export type Bildquelle = CmsBild | string;

/**
 * Projekt und Dataset kommen aus der Konfiguration der Integration, nicht
 * erneut aus der Umgebung — sonst gibt es zwei Stellen, an denen sie
 * auseinanderlaufen können. Den Client selbst zu übergeben ist abgekündigt;
 * für URLs braucht der Bauer ihn nicht.
 *
 * Erst beim ersten Bild angelegt, nicht beim Import: ohne konfiguriertes
 * Projekt soll die Seite weiterhin mit den lokalen Motiven bauen. Ein Fehler
 * beim Laden des Moduls nähme ihr diese Rückfallebene.
 */
let builder: ReturnType<typeof imageUrlBuilder> | null = null;

function holeBauer() {
  if (builder) return builder;
  const { projectId, dataset } = sanityClient.config();
  if (!projectId || !dataset) {
    throw new Error(
      "Für Bilder aus dem CMS fehlen PUBLIC_SANITY_PROJECT_ID oder PUBLIC_SANITY_DATASET (siehe web/.env.example)."
    );
  }
  builder = imageUrlBuilder({ projectId, dataset });
  return builder;
}

export const istCmsBild = (quelle: Bildquelle | undefined | null): quelle is CmsBild =>
  typeof quelle === "object" && quelle !== null && Boolean(quelle.asset);

/**
 * Eine Breite als URL. Ohne `ratio` wird nur die Breite vorgegeben und das
 * Seitenverhältnis der Datei behalten — den Beschnitt macht dann CSS über
 * `object-fit: cover`.
 *
 * Mit `ratio` wird serverseitig beschnitten, und erst dadurch wirkt der
 * Bildmittelpunkt aus dem Studio: ohne Zielformat gibt es nichts, worauf ein
 * Hotspot angewandt werden könnte.
 */
export function bildUrl(quelle: CmsBild, breite: number, ratio?: number): string {
  let bild = holeBauer().image(quelle).width(breite).auto("format").quality(78);
  if (ratio) bild = bild.height(Math.round(breite / ratio)).fit("crop");
  return bild.url();
}

/** srcset über mehrere Breiten — dasselbe Prinzip wie im lokalen Partial. */
export function bildSrcset(quelle: CmsBild, breiten: number[], ratio?: number): string {
  return breiten.map((b) => `${bildUrl(quelle, b, ratio)} ${b}w`).join(", ");
}
