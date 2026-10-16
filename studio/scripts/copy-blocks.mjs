/**
 * Portable Text by hand, for the copy files under `scripts/copy/`.
 *
 * The first two post files (13.10.2026) each carried their own copy of this
 * helper. With six more posts on 16.10.2026 it moved here. Not under `copy/`:
 * `copy-import.mjs` imports every `.mjs` in that folder as a page.
 *
 *   p("text")                         paragraph
 *   p(["text ", { text, href }, "."]) paragraph with a link
 *   h2("…") / h3("…")                 headings
 *   li("…")                           bullet point
 *   table([[head…], [row…], …])       a table, first row is the header
 *
 * Keys are counted per file (`make()` returns a fresh set), so two posts
 * never share a `_key`, and the same file produces the same keys on every
 * run: a re-import patches instead of duplicating.
 */
export function make() {
  let k = 0;
  const block = (style, parts, extra = {}) => {
    const n = ++k;
    const markDefs = [];
    const children = (Array.isArray(parts) ? parts : [parts]).map((part, i) => {
      if (typeof part === "string")
        return {
          _type: "span",
          _key: `t${n}s${i + 1}`,
          text: part,
          marks: [],
        };
      const key = `t${n}l${markDefs.length + 1}`;
      markDefs.push({ _key: key, _type: "link", href: part.href });
      return {
        _type: "span",
        _key: `t${n}s${i + 1}`,
        text: part.text,
        marks: [key],
      };
    });
    return {
      _type: "block",
      _key: `t${n}`,
      style,
      markDefs,
      children,
      ...extra,
    };
  };

  return {
    p: (parts) => block("normal", parts),
    h2: (text) => block("h2", text),
    h3: (text) => block("h3", text),
    li: (parts) => block("normal", parts, { listItem: "bullet", level: 1 }),
    table: (rows, caption) => {
      const n = ++k;
      return {
        _type: "table",
        _key: `t${n}`,
        ...(caption ? { caption } : {}),
        rows: rows.map((cells, i) => ({
          _type: "tableRow",
          _key: `t${n}r${i + 1}`,
          cells,
        })),
      };
    },
  };
}
