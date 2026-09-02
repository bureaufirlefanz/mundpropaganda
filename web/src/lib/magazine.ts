import { sanityClient } from "sanity:client";
import { withoutNull, type WithoutNull } from "./without-null";
import { stableMotif } from "./images";
import type {
  POSTS_QUERY_RESULT,
  POST_QUERY_RESULT,
  MAGAZINE_INDEX_QUERY_RESULT,
} from "./sanity.types";
import {
  POSTS_QUERY,
  POST_QUERY,
  MAGAZINE_INDEX_QUERY,
  RELATED_QUERY,
} from "./queries";

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

export type Post = NonNullable<WithoutNull<POSTS_QUERY_RESULT>>[number];
export type FullPost = NonNullable<WithoutNull<POST_QUERY_RESULT>>;
export type MagazineIntro = NonNullable<WithoutNull<MAGAZINE_INDEX_QUERY_RESULT>>;

/** Klartext für die Kategorie-Pille auf der Karte. */
const CATEGORIES: Record<string, string> = {
  behandlung: "Behandlung",
  vorsorge: "Vorsorge",
  technik: "Material & Technik",
  praxis: "Praxis",
};

export const categoryLabel = (value?: string) => (value ? (CATEGORIES[value] ?? value) : "");

export const postPath = (slug: string) => `/magazin/${slug}`;

/**
 * Das Ersatzmotiv eines Beitrags, solange kein Vorschaupicture hängt.
 *
 * Die Regel dahinter steht in `images.ts`: am Beitrag festgemacht und nicht
 * an seiner Position in einer Liste, damit Raster, Karussell und die eigene
 * Seite dasselbe Bild zeigen.
 */
const MOTIFS = ["motion-04", "teeth-macro", "lab-veneers", "treatment-03"] as const;

export const motifFor = (slug?: string) => stableMotif(MOTIFS, slug);

/* Einmal je Build und je Filter. Start- und Leistungsseiten questions dieselbe
   Liste ab — auf der Startseite alle, auf einer Leistungsseite die zu ihr
   gehörenden. */
const cached = new Map<string, Promise<Post[]>>();

/**
 * Die Beiträge, neueste zuerst.
 *
 * Mit `service` nur die, die im Studio auf genau diese Leistung verweisen.
 * Dafür ist die Referenz im Schema da: Die Leistungsseite zeigt passende
 * Beiträge, ohne dass jemand sie dort einzeln einträgt.
 */
export function loadPosts(service?: string): Promise<Post[]> {
  const key = service ?? "*";
  if (!cached.has(key)) {
    cached.set(
      key,
      sanityClient
        .fetch(POSTS_QUERY, { service: service ?? null })
        .then(withoutNull)
        .then((liste) => liste ?? [])
        .catch(() => [])
    );
  }
  return cached.get(key)!;
}

export async function loadPost(slug: string): Promise<FullPost | undefined> {
  try {
    return withoutNull(await sanityClient.fetch(POST_QUERY, { slug })) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Bis zu drei Beiträge aus derselben Kategorie.
 *
 * Ohne Kategorie am Ausgangsbeitrag gibt es nichts Ähnliches — dann bleibt
 * die Liste leer und der Abschnitt entfällt. Kein Auffüllen mit den neuesten
 * Beiträgen: „Ähnliche Beiträge", unter denen etwas Unähnliches steht, ist
 * dieselbe stille Behauptung, die Aufgabe 4 überall abgeräumt hat.
 */
export async function loadRelated(category?: string, slug?: string): Promise<Post[]> {
  if (!category || !slug) return [];
  try {
    return withoutNull(await sanityClient.fetch(RELATED_QUERY, { category, slug })) ?? [];
  } catch {
    return [];
  }
}

export async function loadMagazineIntro(): Promise<MagazineIntro | undefined> {
  try {
    return withoutNull(await sanityClient.fetch(MAGAZINE_INDEX_QUERY)) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Wie lange man an einem Beitrag liest.
 *
 * Gerechnet, nicht gepflegt: Ein Feld dafür wäre ein Wert, den die Redaktion
 * beim Kürzen eines Absatzes vergisst — und eine angegebene Lesezeit, die
 * nicht stimmt, ist schlechter als keine.
 *
 * 200 Wörter je Minute ist der übliche Ansatz für Fließtext auf Deutsch;
 * darunter liegen Fachtexte, darüber Belletristik. Aufgerundet auf ganze
 * Minuten, mindestens eine — „0 Minuten Lesezeit" liest niemand als kurz,
 * sondern als kaputt.
 */
export function readingTime(blocks: unknown): number {
  if (!Array.isArray(blocks)) return 1;
  let woerter = 0;
  for (const block of blocks) {
    const b = block as { _type?: string; children?: { text?: string }[] };
    if (b?._type !== "block") continue;
    for (const kind of b.children ?? []) {
      woerter += (kind.text ?? "").trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.round(woerter / 200));
}

/** Deutsches Datum, wie es unter einem Beitrag steht. */
export const dateLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })
    : "";
