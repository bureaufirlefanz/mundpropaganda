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
export interface CmsImageValue {
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
export type ImageSource = CmsImageValue | string;

/* --- Ersatzmotive ------------------------------------------------------- */

import BREITEN from "./image-widths.json";

/**
 * Welches gestaltete Motiv vertritt einen Inhalt, solange kein Bild im CMS
 * liegt?
 *
 * **Am Inhalt festgemacht, nicht an seiner Position in einer Liste.** Der
 * Index war der naheliegende Weg und an drei Stellen falsch: Ein Beitrag
 * stand im Raster an erster, im Karussell an dritter Stelle und bekam dort
 * zwei verschiedene Bilder; auf seiner eigenen Seite gab es gar keine Liste
 * und damit ein festes drittes. Der Streuwert kommt deshalb aus einem
 * stabilen Schlüssel — dem Slug.
 *
 * Zwei Inhalte können sich ein Motiv teilen. Bei vier Motiven und sechs
 * Beiträgen ist das unvermeidlich, und ein wiederkehrendes Motiv ist
 * harmloser als eines, das je nach Seite wechselt.
 */
export function stableMotif(motive: readonly string[], key?: string): string {
  if (!key) return motive[0];
  let summe = 0;
  for (let i = 0; i < key.length; i++) {
    summe = (summe * 31 + key.charCodeAt(i)) >>> 0;
  }
  return motive[summe % motive.length];
}

/**
 * Die fertige Adresse eines lokalen Motivs — für die Stellen, die kein
 * `<picture>` bauen können, sondern eine einzelne URL brauchen (das
 * Zeiger-Preview der Services-Tabelle hängt sie an ein data-Attribut).
 *
 * Die Breite wird nicht angenommen, sondern aus dem Verzeichnis gewählt: Die
 * Pipeline deckelt jede Stufe auf die Breite der Quelle, `praxis-01` hört bei
 * 800 auf und `smile-portrait` bei 563. Eine fest hingeschriebene 640 ergäbe
 * dort einen 404 — genau der Fehler, der auf der Veneers-Seite das Bild der
 * ersten Zeile verschluckt hat.
 */
export function motifPath(name: string, minimum = 640): string | undefined {
  const widths = (BREITEN as Record<string, number[]>)[name];
  if (!widths?.length) return undefined;
  const passend = widths.find((b) => b >= minimum) ?? widths.at(-1);
  return `/img/${name}-${passend}.webp`;
}

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
      "Für Bilder aus dem CMS fehlen PUBLIC_SANITY_PROJECT_ID oder PUBLIC_SANITY_DATASET (siehe web/.env.example).",
    );
  }
  builder = imageUrlBuilder({ projectId, dataset });
  return builder;
}

export const isCmsImage = (
  source: ImageSource | undefined | null,
): source is CmsImageValue =>
  typeof source === "object" && source !== null && Boolean(source.asset);

/**
 * Eine Breite als URL. Ohne `ratio` wird nur die Breite vorgegeben und das
 * Seitenverhältnis der Datei behalten — den Beschnitt macht dann CSS über
 * `object-fit: cover`.
 *
 * Mit `ratio` wird serverseitig beschnitten, und erst dadurch wirkt der
 * Bildmittelpunkt aus dem Studio: ohne Zielformat gibt es nichts, worauf ein
 * Hotspot angewandt werden könnte.
 */
export function imageUrl(
  source: CmsImageValue,
  width: number,
  ratio?: number,
): string {
  let image = holeBauer().image(source).width(width).auto("format").quality(78);
  if (ratio) image = image.height(Math.round(width / ratio)).fit("crop");
  return image.url();
}

/** srcset über mehrere Breiten — dasselbe Prinzip wie im lokalen Partial. */
export function imageSrcset(
  source: CmsImageValue,
  widths: number[],
  ratio?: number,
): string {
  return widths.map((b) => `${imageUrl(source, b, ratio)} ${b}w`).join(", ");
}

/**
 * Die Maße, die ins `<img>` gehören.
 *
 * `width` und `height` am Bild sind keine Größenangabe — CSS überschreibt
 * beides —, sondern die Angabe des Seitenverhältnisses, bevor die Datei da
 * ist. Der Browser reserviert damit den Platz und muss nichts nachrücken.
 *
 * Gemessen ist der Gewinn heute klein: Fast jede Bildfläche der Seite hat in
 * ihrem CSS ein `aspect-ratio`, und der Wert für die Layoutverschiebung liegt
 * auf allen Seiten unter 0,003. Die Angabe kostet aber nichts und trägt genau
 * dort, wo das CSS sie nicht hat — und das ist der Fall, den man nicht sieht,
 * weil er erst mit einem neuen Abschnitt entsteht.
 *
 * Der Beschnitt zählt mit. `crop` gibt an, wieviel von jeder Seite wegfällt;
 * die Metadaten nennen die ganze Datei. Ohne diese Rechnung stünde am Bild
 * das Verhältnis des Originals, während die CDN-Adresse den Ausschnitt
 * liefert — und der reservierte Platz wäre falsch.
 */
export function imageSize(
  source: CmsImageValue,
  width: number,
  ratio?: number,
): { width: number; height: number } | undefined {
  if (ratio) return { width, height: Math.round(width / ratio) };

  const dimensions = source.asset?.metadata?.dimensions;
  if (!dimensions?.width || !dimensions?.height) return undefined;

  const crop = source.crop as
    | { top?: number; bottom?: number; left?: number; right?: number }
    | undefined;
  const waagerecht = 1 - (crop?.left ?? 0) - (crop?.right ?? 0);
  const senkrecht = 1 - (crop?.top ?? 0) - (crop?.bottom ?? 0);
  if (waagerecht <= 0 || senkrecht <= 0) return undefined;

  const eigen =
    (dimensions.width * waagerecht) / (dimensions.height * senkrecht);
  return { width, height: Math.round(width / eigen) };
}

/**
 * Der Bildmittelpunkt als `object-position`.
 *
 * Bis hierher wirkte der Hotspot aus dem Studio nur, wenn die Aufrufstelle ein
 * `ratio` mitgab — dann beschneidet das CDN und wendet ihn an. Das taten 27
 * von 28 Stellen nicht: Die Redaktion konnte den Punkt setzen, CSS schnitt
 * trotzdem um die Mitte, und der Punkt war reine Zierde.
 *
 * Ohne serverseitigen Beschnitt lässt sich derselbe Wunsch im Browser
 * erfüllen — `object-fit: cover` schneidet dann um den gesetzten Punkt statt
 * um die Mitte. `undefined`, wenn kein Hotspot gesetzt ist: Dann soll die
 * Regel aus dem Stylesheet gelten und nicht eine hier erfundene Mitte.
 */
export function hotspotPosition(source: CmsImageValue): string | undefined {
  const hotspot = source.hotspot as { x?: number; y?: number } | undefined;
  if (typeof hotspot?.x !== "number" || typeof hotspot?.y !== "number")
    return undefined;
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`;
}
