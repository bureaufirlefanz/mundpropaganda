import { sanityClient } from "sanity:client";
import { documentPath } from "./paths";
import { withoutNull, type WithoutNull } from "./without-null";
import type {
  NAVIGATION_QUERY_RESULT,
  FOOTER_QUERY_RESULT,
} from "./sanity.types";
import { NAVIGATION_QUERY, FOOTER_QUERY } from "./queries";
import { loadSettings, telLink } from "./settings";
import { fallbackFor } from "./loading";

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

export type Navigation = NonNullable<WithoutNull<NAVIGATION_QUERY_RESULT>>;
export type Footer = NonNullable<WithoutNull<FOOTER_QUERY_RESULT>>;
export type LinkValue = NonNullable<Navigation["mainMenu"]>[number];

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
export function linkHref(
  v: LinkValue | undefined | null,
  currentPath: string,
  contact: { phone: string; email: string },
): string | null {
  if (!v) return null;

  if (v.kind === "email")
    return contact.email ? `mailto:${contact.email}` : null;
  if (v.kind === "phone") return contact.phone ? telLink(contact.phone) : null;
  if (v.kind === "external") return v.url || null;

  const path = documentPath(v.target?._type, v.target?.slug ?? undefined);
  if (!path) return null;
  if (!v.anchor) return path;

  /* Trailing slash abziehen, damit „/karriere" und „/karriere/" als dieselbe
     Seite gelten — Astro legt jede Seite als Verzeichnis ab, und der Browser
     steht danach auf der Fassung mit Schrägstrich. */
  const here = currentPath.replace(/\/+$/, "") || "/";
  const there = path.replace(/\/+$/, "") || "/";
  return here === there ? `#${v.anchor}` : `${path}#${v.anchor}`;
}

/** Verweise mit Ziel, fertig zum Rendern. Was kein Ziel hat, fällt raus. */
export async function resolved(
  links: (LinkValue | null)[] | undefined | null,
  currentPath: string,
): Promise<{ text: string; href: string }[]> {
  const { phone, email } = await loadSettings();
  return (links ?? [])
    .filter((v): v is LinkValue => Boolean(v))
    .map((v) => ({
      text: v.text ?? "",
      href: linkHref(v, currentPath, { phone, email }),
    }))
    .filter((v): v is { text: string; href: string } =>
      Boolean(v.text && v.href),
    );
}

let cachedNavigation: Promise<Navigation | undefined> | null = null;
let cachedFooter: Promise<Footer | undefined> | null = null;

export function loadNavigation(): Promise<Navigation | undefined> {
  cachedNavigation ??= sanityClient
    .fetch(NAVIGATION_QUERY)
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("die Navigation", undefined));
  return cachedNavigation;
}

export function loadFooter(): Promise<Footer | undefined> {
  cachedFooter ??= sanityClient
    .fetch(FOOTER_QUERY)
    .then(withoutNull)
    .then((d) => d ?? undefined)
    .catch(fallbackFor("den Seitenfuß", undefined));
  return cachedFooter;
}
