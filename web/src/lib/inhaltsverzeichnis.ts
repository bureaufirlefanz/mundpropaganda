/**
 * Sprungmarken für die Zwischentitel eines Beitrags.
 *
 * Die Kennung entsteht an genau einer Stelle: hier. Das Verzeichnis links und
 * die Überschrift im Text müssen dieselbe treffen, und zwei Funktionen, die
 * „ungefähr dasselbe" slugifizieren, laufen garantiert auseinander — dann
 * führt ein Eintrag ins Leere, und zwar nur bei den Überschriften mit Umlaut
 * oder Sonderzeichen. Das fällt beim Klicken auf, nicht beim Bauen.
 *
 * Die Überschrift im Text schlägt ihre Kennung deshalb über `_key` nach,
 * statt sie ein zweites Mal zu berechnen. `_key` vergibt Sanity je Block; er
 * ist stabil und eindeutig, auch wenn zwei Zwischentitel gleich lauten.
 */

import type { PortableTextBlock } from "@portabletext/types";

/** Ein Zwischentitel, wie ihn das Verzeichnis anzeigt. */
export interface Marke {
  /** Der `_key` des Portable-Text-Blocks. */
  key: string;
  id: string;
  text: string;
  /** 2 oder 3 — h3 rückt im Verzeichnis ein. */
  ebene: 2 | 3;
}

/**
 * Aus einem Zwischentitel eine Kennung machen.
 *
 * Umlaute werden ausgeschrieben und nicht bloß zerlegt: Eine reine
 * NFD-Zerlegung machte aus „ä" ein „a", und „Zähne" und „Zahne" bekämen
 * dieselbe Kennung. Bei zwei Zwischentiteln in einem Beitrag reicht das für
 * eine Kollision.
 */
export function idVon(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Block {
  _type?: string;
  _key?: string;
  style?: string;
  children?: { text?: string }[];
}

/**
 * Die Zwischentitel eines Beitrags, in der Reihenfolge des Textes.
 *
 * Doppelte Kennungen bekommen eine Nummer angehängt. Zwei gleich lautende
 * Zwischentitel („Fazit" zweimal) sind selten, aber ohne diese Behandlung
 * spränge der zweite Eintrag zum ersten zurück — ein Fehler, den niemand
 * meldet, weil er wie Absicht aussieht.
 */
export function markenAus(blocks: unknown): Marke[] {
  if (!Array.isArray(blocks)) return [];

  const vergeben = new Map<string, number>();
  const marken: Marke[] = [];

  for (const [i, block] of blocks.entries()) {
    const b = block as Block;
    if (b?._type !== "block") continue;
    if (b.style !== "h2" && b.style !== "h3") continue;

    const text = (b.children ?? [])
      .map((k) => k.text ?? "")
      .join("")
      .trim();
    if (!text) continue;

    const basis = idVon(text) || "abschnitt";
    const wievielt = (vergeben.get(basis) ?? 0) + 1;
    vergeben.set(basis, wievielt);

    marken.push({
      key: b._key ?? `block-${i}`,
      id: wievielt === 1 ? basis : `${basis}-${wievielt}`,
      text,
      ebene: b.style === "h2" ? 2 : 3,
    });
  }

  return marken;
}

/**
 * Die Kennung an den Block selbst hängen.
 *
 * Der Umweg ist nötig, weil `astro-portabletext` genau vier Props annimmt
 * (`value`, `components`, `listNestingMode`, `onMissingComponent`) und alles
 * andere verwirft — eine Karte von außen erreichte den Zwischentitel also
 * nie. Was er bekommt, ist sein eigener Block. Also steht die Kennung dort.
 *
 * Kopiert statt geändert: Das Ergebnis der Abfrage wird an mehreren Stellen
 * gelesen, und ein Feld, das beim Rendern hineinwächst, ist die Sorte
 * Nebenwirkung, die man drei Bausteine später sucht.
 */
export function mitKennungen(blocks: unknown, marken: Marke[]): PortableTextBlock[] {
  if (!Array.isArray(blocks)) return [];
  const karte = new Map(marken.map((m) => [m.key, m.id]));
  return blocks.map((block) => {
    const key = (block as Block)?._key;
    const id = key ? karte.get(key) : undefined;
    return id ? { ...block, _tocId: id } : block;
  }) as PortableTextBlock[];
}
