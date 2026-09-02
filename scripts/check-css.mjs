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
import { readFileSync, readdirSync, statSync } from "node:fs";
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
  [
    767,
    "Aus der Stripe-Vorlage übernommen, siehe Kopf von Compare.astro. Kandidat für 700px — die Änderung verschiebt aber das Verhalten zwischen 701px und 767px und gehört deshalb bewusst entschieden, nicht nebenbei.",
  ],
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

console.log(befunde ? `\n${befunde} Befund(e).` : "\nAlles sauber.");
process.exit(befunde ? 1 : 0);
