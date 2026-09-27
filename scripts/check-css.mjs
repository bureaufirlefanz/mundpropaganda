/**
 * Prüft die CSS-Regeln aus CLAUDE.md — statisch, ohne Browser und ohne Build.
 *
 * Warum überhaupt: Die Regeln standen bisher nur in Prosa da. „tokens.css ist
 * die einzige Quelle der Werte, keine Magic Numbers, keine Hex-Werte außerhalb"
 * ist eine gute Regel, aber eine Regel, die niemand nachrechnet, wird zur
 * Empfehlung und dann zur Fußnote. Dieses Skript rechnet sie nach.
 *
 * Ohne Browser ist Absicht: check-web.mjs braucht Chrome und einen laufenden
 * Server und läuft deshalb nur auf einem Mac von Hand. Diese Prüfung hier
 * kommt mit den Dateien aus und kann damit in CI bei jedem Push laufen.
 *
 * Aufruf: npm run check:css
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "web/src");
const TOKENS = join(SRC, "styles/tokens.css");

/* ---------------------------------------------------------------------------
   Breakpoints
   ---------------------------------------------------------------------------
   Diese Werte lassen sich NICHT als Custom Property ablegen: `@media
   (max-width: var(--bp))` ist kein gültiges CSS. Die Variable wird erst im
   Element aufgelöst, die Media Query aber vorher ausgewertet. Ein Token wäre
   hier also keine Vereinfachung, sondern eine kaputte Datei.

   Bleibt die Liste. Sie ist der Ersatz für ein Token: Wer einen neuen Wert
   einführt, bekommt hier einen Befund und muss ihn bewusst eintragen, statt
   die Skala still um einen vierzehnten Wert wachsen zu lassen.

   Die vier tragenden Stufen, gemessen am Bestand. */
const BREAKPOINTS = [600, 700, 900, 1000];

/* Einzelfälle, die es gibt und die begründet sind. Jeder Eintrag nennt den
   Grund — eine Ausnahmeliste ohne Gründe ist nach einem halben Jahr nur noch
   eine zweite Skala. */
const BREAKPOINT_AUSNAHMEN = new Map([
  [
    701,
    "Gegenstück zu 700: min-width, damit sich die beiden nicht überlappen.",
  ],
  [1024, "Die Navigation klappt früher um als der Rest der Seite."],
  [520, "Sehr schmale Geräte, nur wo eine Zeile sonst bricht."],
  [560, "Zwei Anschriften im Fuß nebeneinander, darunter gestapelt."],
  [620, "Fließtextmaß, nicht Layoutbreite."],
  [640, "Fließtextmaß, nicht Layoutbreite."],
  [800, "Karussell der Geschichten, eigene Mechanik."],
  [1100, "Breite Medienblöcke."],
  [1200, "Der Faden läuft breiter als der Inhalt."],
]);

/* ---------------------------------------------------------------------------
   Dateien einsammeln
   --------------------------------------------------------------------------- */
function dateien(dir, treffer = []) {
  for (const name of readdirSync(dir)) {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) dateien(pfad, treffer);
    else if (/\.(astro|css)$/.test(name)) treffer.push(pfad);
  }
  return treffer;
}

/**
 * Kommentare entfernen, bevor gesucht wird.
 *
 * Ohne das meldet die Prüfung jeden Figma-Verweis in einem Kopfkommentar als
 * Verstoß — und genau solche Verweise sind erwünscht. Sie dokumentieren, aus
 * welchem Wert ein Token entstanden ist.
 */
function ohneKommentare(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

const ALLE = dateien(SRC);
const kurz = (p) => relative(ROOT, p);

let befunde = 0;

/* ---------------------------------------------------------------------------
   1. Hex-Werte außerhalb tokens.css
   --------------------------------------------------------------------------- */
function pruefeFarben() {
  /* Der Styleguide zeigt die Farbtafel und muss die Werte deshalb ausschreiben.
     Dass sie mit tokens.css übereinstimmen, prüft check-web.mjs am gerenderten
     Ergebnis — hier wäre es eine zweite, schwächere Kopie derselben Prüfung. */
  const AUSGENOMMEN = ["styles/tokens.css", "pages/design/styleguide.astro"];

  const treffer = [];
  for (const pfad of ALLE) {
    const rel = kurz(pfad);
    if (AUSGENOMMEN.some((a) => rel.endsWith(a))) continue;

    const text = ohneKommentare(readFileSync(pfad, "utf8"));
    for (const zeile of text.split("\n")) {
      /* `theme-color` wird eigens geprüft, siehe unten. */
      if (zeile.includes("theme-color")) continue;
      const m = zeile.match(/#[0-9a-fA-F]{3,8}\b/g);
      if (m) treffer.push([rel, m.join(" ")]);
    }
  }

  if (!treffer.length) {
    console.log("  ✓ keine Hex-Werte außerhalb tokens.css");
    return 0;
  }
  for (const [datei, werte] of treffer) {
    console.log(`  ✗ ${datei}: ${werte}`);
    console.log(`      gehört als Token nach web/src/styles/tokens.css`);
  }
  return treffer.length;
}

/* ---------------------------------------------------------------------------
   2. theme-color stimmt mit dem Hintergrund-Token überein
   ---------------------------------------------------------------------------
   Ein <meta>-Attribut kann keine Custom Property lesen, der Wert muss dort
   also ausgeschrieben stehen. Statt ihn auszunehmen wird er nachgerechnet:
   Er hat dem zu entsprechen, was --c-bg am Ende auflöst.
   --------------------------------------------------------------------------- */
function pruefeThemeColor() {
  const tokens = readFileSync(TOKENS, "utf8");

  /* --c-bg zeigt auf ein anderes Token; eine Stufe auflösen reicht hier. */
  const bg = tokens.match(/--c-bg:\s*var\(([^)]+)\)/);
  const name = bg ? bg[1].trim() : "--c-bg";
  const wert = tokens.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{3,8})`));

  if (!wert) {
    console.log("  ✗ --c-bg lässt sich in tokens.css nicht auflösen");
    return 1;
  }
  const soll = wert[1].toLowerCase();

  let schief = 0;
  let geprueft = 0;
  for (const pfad of ALLE) {
    for (const zeile of readFileSync(pfad, "utf8").split("\n")) {
      if (!zeile.includes("theme-color")) continue;
      const ist = zeile.match(/content="(#[0-9a-fA-F]{3,8})"/);
      if (!ist) continue;
      geprueft++;
      if (ist[1].toLowerCase() !== soll) {
        console.log(
          `  ✗ ${kurz(pfad)}: theme-color ${ist[1]}, ${name} ist ${soll}`,
        );
        schief++;
      }
    }
  }

  if (!schief)
    console.log(`  ✓ ${geprueft}x theme-color entspricht ${name} (${soll})`);
  return schief;
}

/* ---------------------------------------------------------------------------
   3. Breakpoints
   --------------------------------------------------------------------------- */
function pruefeBreakpoints() {
  const gefunden = new Map();

  for (const pfad of ALLE) {
    const text = ohneKommentare(readFileSync(pfad, "utf8"));
    for (const m of text.matchAll(
      /@media[^{]*?\(\s*(?:min|max)-width:\s*(\d+)px/g,
    )) {
      const wert = Number(m[1]);
      if (!gefunden.has(wert)) gefunden.set(wert, new Set());
      gefunden.get(wert).add(kurz(pfad));
    }
  }

  const unbekannt = [...gefunden.keys()]
    .filter((w) => !BREAKPOINTS.includes(w) && !BREAKPOINT_AUSNAHMEN.has(w))
    .sort((a, b) => a - b);

  const summe = [...gefunden.values()].reduce((n, s) => n + s.size, 0);

  if (!unbekannt.length) {
    console.log(
      `  ✓ ${gefunden.size} Breakpoint-Werte, alle bekannt (${summe} Stellen)`,
    );
    return 0;
  }

  for (const wert of unbekannt) {
    const dateien = [...gefunden.get(wert)];
    /* Ein neuer Wert dicht neben einem bekannten ist fast immer ein Versehen
       und keine Absicht — deshalb wird der Nachbar mitgenannt. */
    const nah = BREAKPOINTS.find((b) => Math.abs(b - wert) <= 70);
    console.log(`  ✗ ${wert}px ist kein bekannter Breakpoint`);
    console.log(`      in: ${dateien.slice(0, 3).join(", ")}`);
    if (nah) console.log(`      dicht an ${nah}px — Versehen, oder gewollt?`);
    console.log(`      sonst in scripts/check-css.mjs eintragen, mit Grund.`);
  }
  return unbekannt.length;
}

/* ---------------------------------------------------------------------------
   4. Elementbreiten als nackte px-Zahl
   --------------------------------------------------------------------------- */
function pruefeBreiten() {
  const treffer = [];
  for (const pfad of ALLE) {
    if (kurz(pfad).endsWith("styles/tokens.css")) continue;
    /* Die Seiten unter design/ sind Werkzeug, nicht Auslieferung: Der Katalog
       stellt Bausteine absichtlich auf willkürliche Maße, um zu zeigen, wie sie
       sich verhalten. Ein Token dafür wäre eine Behauptung über die Seite, die
       gar nicht gemeint ist. */
    if (kurz(pfad).includes("pages/design/")) continue;
    const text = ohneKommentare(readFileSync(pfad, "utf8"));
    for (const m of text.matchAll(/^\s*max-width:\s*(\d+)px/gm)) {
      treffer.push([kurz(pfad), m[1]]);
    }
  }

  if (!treffer.length) {
    console.log("  ✓ keine Elementbreiten als nackte px-Zahl");
    return 0;
  }
  for (const [datei, wert] of treffer) {
    console.log(`  ✗ ${datei}: max-width: ${wert}px`);
    console.log(
      `      als Token ablegen, oder mit clamp() an die Seite binden`,
    );
  }
  return treffer.length;
}

/* ---------------------------------------------------------------------------
   5. Custom properties that are read but never set
   ---------------------------------------------------------------------------
   A `var(--x)` whose `--x` is set nowhere resolves to its fallback, or to
   nothing, silently. That is how the "wide image" option in posts did
   nothing for months: `var(--rand-breite, 0px)`, and nothing ever set
   `--rand-breite`. Definitions are searched in CSS, in inline `style`
   attributes and in JS (`setProperty("--x")`).

   A read with a fallback can be a deliberate hook that a parent may set.
   Those are listed here, with the reason, so an unset hook is a decision
   and not an accident. */
const UNSET_HOOKS = new Map([
  [
    "--post-surface-top",
    "PostCard: the magazine overview is meant to lower the text surface. Not wired yet, see STYLEGUIDE-UMBAU.md.",
  ],
]);

/* ------------------------------------------------------------------------ */
function codeFiles(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) codeFiles(path, found);
    else if (/\.(astro|css|js|ts)$/.test(name)) found.push(path);
  }
  return found;
}

function checkUndefinedProperties() {
  const defined = new Set();
  const all = codeFiles(SRC);
  for (const path of all) {
    const text = readFileSync(path, "utf8");
    for (const m of text.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) defined.add(m[1]);
    for (const m of text.matchAll(/["'`](--[a-zA-Z0-9_-]+)["'`]/g))
      defined.add(m[1]);
    /* Template-built names like `--${key}` can't be resolved statically. */
  }

  const missing = [];
  for (const path of ALLE) {
    const text = ohneKommentare(readFileSync(path, "utf8"));
    for (const m of text.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*([,)])/g)) {
      const [, name, next] = m;
      if (defined.has(name) || UNSET_HOOKS.has(name)) continue;
      missing.push([kurz(path), name, next === ","]);
    }
  }

  if (!missing.length) {
    console.log(
      `  ✓ every var() is set somewhere (${UNSET_HOOKS.size} documented hook(s))`,
    );
    return 0;
  }
  for (const [file, name, fallback] of missing)
    console.log(
      `  ✗ ${file}: ${name} is read${fallback ? " (with a fallback)" : ""} but set nowhere`,
    );
  return missing.length;
}

/* ---------------------------------------------------------------------------
   6. Legacy token names
   ---------------------------------------------------------------------------
   `--fs-h1` … `--fs-h5` survive in tokens.css only for the archived
   prototype in prototypen/vite. Inside web/ they are the old, misleading
   names and must not come back. */
function checkLegacyNames() {
  const hits = [];
  for (const path of ALLE) {
    if (kurz(path).endsWith("styles/tokens.css")) continue;
    const text = ohneKommentare(readFileSync(path, "utf8"));
    for (const m of text.matchAll(/--fs-h[1-5](?:-[a-z]+)?\b/g))
      hits.push([kurz(path), m[0]]);
  }
  if (!hits.length) {
    console.log("  ✓ no legacy --fs-h* names");
    return 0;
  }
  for (const [file, name] of hits)
    console.log(`  ✗ ${file}: ${name} → use the --fs-title-* step`);
  return hits.length;
}

/* ---------------------------------------------------------------------------
   7. Literal values, as a ratchet
   ---------------------------------------------------------------------------
   Values that belong in tokens.css but are still written out in a
   component. They can't all go at once — the homepage is frozen, and some
   literals are deliberate — so each file has a ceiling, recorded in
   scripts/css-baseline.json. A file may go below it, never above it.

   A new literal therefore fails the check. Either use a token, or, when
   the literal is deliberate, raise the ceiling on purpose:

       npm run check:css -- --update

   and say why in the commit. A new file starts with a ceiling of zero.

   What counts, per file (comments ignored, tokens.css and design/ pages
   excluded):
     clamp     clamp() with a px/rem literal, outside a custom property
     px        px literals other than 0 and 1px
     lh        line-height written as a number
     tracking  letter-spacing written as a length
     size      font-size not taken from a token
     colour    color-mix(), rgb(), rgba(), hsl() outside tokens.css
   --------------------------------------------------------------------------- */
const BASELINE = join(ROOT, "scripts/css-baseline.json");

function cssOf(path, text) {
  if (path.endsWith(".css")) return text;
  return [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1])
    .join("\n");
}

function countLiterals(path) {
  const css = ohneKommentare(cssOf(path, readFileSync(path, "utf8")));
  const count = { clamp: 0, px: 0, lh: 0, tracking: 0, size: 0, colour: 0 };
  for (const m of css.matchAll(/(?:^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+);/g)) {
    const [, prop, value] = m;
    if (prop.startsWith("--")) continue;
    if (/clamp\([^)]*\d(px|rem)/.test(value)) count.clamp++;
    const px = (value.match(/(?<![\w.-])\d+(\.\d+)?px/g) ?? []).filter(
      (v) => v !== "0px" && v !== "1px",
    );
    if (!value.includes("clamp(")) count.px += px.length;
    if (prop === "line-height" && /^\s*[\d.]+\s*$/.test(value)) count.lh++;
    if (prop === "letter-spacing" && /-?[\d.]+(em|px)/.test(value))
      count.tracking++;
    if (
      prop === "font-size" &&
      !/^\s*(var\(--fs-[\w-]+\)|inherit|1em|100%)\s*$/.test(value)
    )
      count.size++;
    if (/color-mix\(|rgba?\(|hsla?\(/.test(value)) count.colour++;
  }
  return count;
}

function checkLiterals(update) {
  const current = {};
  for (const path of ALLE) {
    const rel = kurz(path);
    if (rel.endsWith("styles/tokens.css") || rel.includes("pages/design/"))
      continue;
    const c = countLiterals(path);
    if (Object.values(c).some(Boolean)) current[rel] = c;
  }

  if (update) {
    writeFileSync(BASELINE, JSON.stringify(current, null, 2) + "\n");
    console.log(
      `  ↓ ceilings written for ${Object.keys(current).length} files`,
    );
    return 0;
  }

  let baseline = {};
  try {
    baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
  } catch {
    console.log("  ✗ scripts/css-baseline.json missing — run with --update");
    return 1;
  }

  let over = 0;
  let below = 0;
  for (const [file, counts] of Object.entries(current)) {
    const ceiling = baseline[file] ?? {};
    for (const [kind, n] of Object.entries(counts)) {
      const max = ceiling[kind] ?? 0;
      if (n > max) {
        console.log(`  ✗ ${file}: ${n} ${kind} literal(s), ceiling ${max}`);
        over++;
      } else if (n < max) below++;
    }
  }
  const total = Object.values(current).reduce(
    (sum, c) => sum + Object.values(c).reduce((a, b) => a + b, 0),
    0,
  );
  if (!over)
    console.log(
      `  ✓ no file above its ceiling (${total} literals left in ${Object.keys(current).length} files)`,
    );
  if (below)
    console.log(
      `  · ${below} ceiling(s) can be lowered: npm run check:css -- --update`,
    );
  return over;
}

/* --- Lauf ---------------------------------------------------------------- */
console.log(`Geprüfte Dateien: ${ALLE.length} unter web/src`);

console.log("\n── Farbwerte ──");
befunde += pruefeFarben();

console.log("\n── theme-color ──");
befunde += pruefeThemeColor();

console.log("\n── Breakpoints ──");
befunde += pruefeBreakpoints();

console.log("\n── Elementbreiten ──");
befunde += pruefeBreiten();

console.log("\n── Undefined custom properties ──");
befunde += checkUndefinedProperties();

console.log("\n── Legacy token names ──");
befunde += checkLegacyNames();

console.log("\n── Literal values (ratchet) ──");
befunde += checkLiterals(process.argv.includes("--update"));

console.log(befunde ? `\n${befunde} Befund(e).` : "\nAlles sauber.");
process.exit(befunde ? 1 : 0);
