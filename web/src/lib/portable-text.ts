import type { PortableTextBlock } from "@portabletext/types";

/**
 * Fließtext in der Form, die auch aus Sanity käme.
 *
 * `Prose.astro` rendert Portable Text — dieselbe Kette wie auf den
 * Beitragsseiten. Solange die Inhalte einer Pillar Page lokal liegen, müssen
 * sie diese Form von Hand tragen; sonst bräuchte die Vorlage zwei Wege durch
 * denselben Abschnitt, und einer davon würde beim Umzug ins CMS ungetestet
 * verschwinden.
 *
 * Kein Markdown-Parser. Erkannt werden genau drei Dinge, weil die Seite nicht
 * mehr braucht:
 *
 *   - `### ` am Zeilenanfang wird zu einem h3 im Text
 *   - `- ` am Zeilenanfang zu einem Aufzählungspunkt
 *   - `**fett**` und `[Text](/pfad)` innerhalb einer Zeile
 *
 * **Die Schlüssel entstehen aus der Position**, nicht zufällig. Sanity
 * vergibt `_key` je Block; hier tut es das Präfix plus Index. Zufällige
 * Schlüssel erzeugten bei jedem Build ein anderes HTML, und der Vergleich
 * gegen die Vorlage („hat sich etwas geändert?") wäre wertlos.
 */

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface MarkDef {
  _type: "link";
  _key: string;
  href: string;
}

/** Eine Zeile in Spans zerlegen — fett und Verweise. */
function parseLine(
  line: string,
  key: string,
): { children: Span[]; markDefs: MarkDef[] } {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/;

  let rest = line;
  let i = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(rest))) {
    if (match.index > 0) {
      children.push({
        _type: "span",
        _key: `${key}s${i++}`,
        text: rest.slice(0, match.index),
        marks: [],
      });
    }

    if (match[1] !== undefined) {
      children.push({
        _type: "span",
        _key: `${key}s${i++}`,
        text: match[1],
        marks: ["strong"],
      });
    } else {
      const defKey = `${key}l${markDefs.length}`;
      markDefs.push({ _type: "link", _key: defKey, href: match[3]! });
      children.push({
        _type: "span",
        _key: `${key}s${i++}`,
        text: match[2]!,
        marks: [defKey],
      });
    }

    rest = rest.slice(match.index + match[0].length);
  }

  if (rest)
    children.push({
      _type: "span",
      _key: `${key}s${i++}`,
      text: rest,
      marks: [],
    });
  return { children, markDefs };
}

/**
 * Aus Zeilen einen Portable-Text-Strom.
 *
 * `prefix` unterscheidet die Schlüssel zweier Abschnitte auf derselben Seite
 * — ohne ihn trügen der erste Absatz des einen und des anderen denselben.
 */
export function blocks(prefix: string, lines: string[]): PortableTextBlock[] {
  return lines.map((line, index) => {
    const key = `${prefix}-${index}`;

    const isHeading = line.startsWith("### ");
    const isBullet = line.startsWith("- ");
    const text = isHeading ? line.slice(4) : isBullet ? line.slice(2) : line;

    const { children, markDefs } = parseLine(text, key);

    return {
      _type: "block",
      _key: key,
      style: isHeading ? "h3" : "normal",
      markDefs,
      children,
      ...(isBullet ? { listItem: "bullet", level: 1 } : {}),
    } as unknown as PortableTextBlock;
  });
}
