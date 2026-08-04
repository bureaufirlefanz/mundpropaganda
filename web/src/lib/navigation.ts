import { sanityClient } from "sanity:client";
import { ohneNull, type OhneNull } from "./ohne-null";
import type { NAVIGATION_QUERY_RESULT, FOOTER_QUERY_RESULT } from "./sanity.types";
import { NAVIGATION_QUERY, FOOTER_QUERY } from "./queries";
import { ladeEinstellungen, telLink } from "./einstellungen";

/**
 * Navigation und Seitenfuß aus dem CMS.
 *
 * Bis Aufgabe 8 stand beides fest im Markup. Der Kunde konnte das Hauptmenü
 * nicht umsortieren, keine Spalte umbenennen und die vier Rechtstext-Links
 * nicht setzen — die zeigten alle auf `#`.
 *
 * Die Leistungen selbst kommen weiterhin aus der Collection. Sie hier noch
 * einmal einzutragen wäre die vierte Stelle mit denselben elf Namen.
 */

export type Navigation = NonNullable<OhneNull<NAVIGATION_QUERY_RESULT>>;
export type Footer = NonNullable<OhneNull<FOOTER_QUERY_RESULT>>;
export type Verweis = NonNullable<Navigation["hauptmenue"]>[number];

/**
 * Der Pfad eines Dokuments — dieselbe Regel wie `studio/lib/pfade.ts`.
 *
 * Bewusst hier nachgebaut und nicht importiert: Das Studio ist ein eigenes
 * Paket, und ein Import über die Ordnergrenze wäre genau der Rückschritt
 * hinter Stufe A, den `web/CLAUDE.md` verbietet. Die Liste ist kurz und
 * ändert sich selten; wenn sie sich ändert, bricht `web:check` an der
 * Routen-Deckung.
 */
const VERZEICHNIS: Record<string, string> = {
  leistung: "leistungen",
  beitrag: "magazin",
};

const FESTE_PFADE: Record<string, string> = {
  startseite: "/",
  magazinIndex: "/magazin",
  karriere: "/karriere",
};

function dokumentPfad(typ?: string, slug?: string): string | null {
  if (!typ) return null;
  if (typ in FESTE_PFADE) return FESTE_PFADE[typ];
  if (!slug) return null;
  if (typ in VERZEICHNIS) return `/${VERZEICHNIS[typ]}/${slug}`;
  /* Rechtstexte und Pillar Pages liegen auf der obersten Ebene. */
  return `/${slug}`;
}

/**
 * Die Adresse eines Verweises.
 *
 * `aktuellerPfad` entscheidet über die Sprungmarke: Zeigt der Verweis auf die
 * Seite, auf der man gerade steht, wird daraus `#kontakt` statt `/#kontakt`.
 * Nur so springt der Browser, statt die Seite neu zu laden.
 *
 * Gibt `null` zurück, wenn der Verweis kein Ziel hat — dann rendert der
 * Baustein ihn gar nicht. Ein Link ohne Ziel ist schlimmer als kein Link: Er
 * sieht aus wie ein Angebot. Genau das waren die vier `href="#"` im Fuß.
 */
export function linkZiel(
  v: Verweis | undefined | null,
  aktuellerPfad: string,
  kontakt: { telefon: string; email: string }
): string | null {
  if (!v) return null;

  if (v.art === "email") return kontakt.email ? `mailto:${kontakt.email}` : null;
  if (v.art === "telefon") return kontakt.telefon ? telLink(kontakt.telefon) : null;
  if (v.art === "extern") return v.url || null;

  const pfad = dokumentPfad(v.ziel?._type, v.ziel?.slug ?? undefined);
  if (!pfad) return null;
  if (!v.anker) return pfad;

  /* Trailing slash abziehen, damit „/karriere" und „/karriere/" als dieselbe
     Seite gelten — Astro legt jede Seite als Verzeichnis ab, und der Browser
     steht danach auf der Fassung mit Schrägstrich. */
  const hier = aktuellerPfad.replace(/\/+$/, "") || "/";
  const dort = pfad.replace(/\/+$/, "") || "/";
  return hier === dort ? `#${v.anker}` : `${pfad}#${v.anker}`;
}

/** Verweise mit Ziel, fertig zum Rendern. Was kein Ziel hat, fällt raus. */
export async function aufgeloest(
  verweise: (Verweis | null)[] | undefined | null,
  aktuellerPfad: string
): Promise<{ text: string; href: string }[]> {
  const { telefon, email } = await ladeEinstellungen();
  return (verweise ?? [])
    .filter((v): v is Verweis => Boolean(v))
    .map((v) => ({ text: v.text ?? "", href: linkZiel(v, aktuellerPfad, { telefon, email }) }))
    .filter((v): v is { text: string; href: string } => Boolean(v.text && v.href));
}

let gemerktNav: Promise<Navigation | undefined> | null = null;
let gemerktFooter: Promise<Footer | undefined> | null = null;

export function ladeNavigation(): Promise<Navigation | undefined> {
  gemerktNav ??= sanityClient
    .fetch(NAVIGATION_QUERY)
    .then(ohneNull)
    .then((d) => d ?? undefined)
    .catch(() => undefined);
  return gemerktNav;
}

export function ladeFooter(): Promise<Footer | undefined> {
  gemerktFooter ??= sanityClient
    .fetch(FOOTER_QUERY)
    .then(ohneNull)
    .then((d) => d ?? undefined)
    .catch(() => undefined);
  return gemerktFooter;
}
