/**
 * Wendet DATEIEN und BEZEICHNER an.
 *
 * Ersetzt NUR außerhalb von Zeichenketten und Kommentaren. Der Grund ist der
 * sichtbare Text: `Beitrag` ist ein Typname und steht zugleich in
 * `label="Beitrag lesen"`. Ohne diese Trennung stünde danach „Post lesen" auf
 * der Seite — eine Änderung, die kein Test bemerkt, weil sie nichts kaputt
 * macht, sondern nur falsch ist.
 *
 * Kommentare bleiben ebenfalls unangetastet; sie kommen in Etappe 3 dran und
 * enthalten dieselben Wörter als deutsche Substantive.
 */
import { readdir, readFile, writeFile, rename } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { DATEIEN, BEZEICHNER } from "./bezeichner.mjs";

const ENDUNGEN = new Set([".ts", ".tsx", ".astro", ".js", ".mjs", ".json"]);
/*  MUSS hier stehen: Beim ersten Lauf fehlte es, und das
   Skript hat seine eigene Zuordnungsdatei umgeschrieben — aus
   `"lib/magazin.ts": "lib/magazin.ts"` wurde
   `"lib/magazin.ts": "lib/magazin.ts"`. */
const AUS = [
  "node_modules",
  "dist",
  ".astro/",
  ".netlify",
  ".git/",
  "sanity.types.ts",
  "scripts/migration",
];

async function alle(o) {
  const r = [];
  for (const e of await readdir(o, { withFileTypes: true })) {
    const p = join(o, e.name);
    if (AUS.some((a) => p.includes(a))) continue;
    if (e.isDirectory()) r.push(...(await alle(p)));
    else if (ENDUNGEN.has(extname(e.name))) r.push(p);
  }
  return r;
}

/** Zerlegt Quelltext in Code- und Nicht-Code-Stücke. */
function stuecke(s) {
  const out = [];
  let i = 0,
    start = 0;
  const schiebe = (bis, code) => {
    if (bis > start) out.push([s.slice(start, bis), code]);
  };
  while (i < s.length) {
    const c = s[i],
      n = s[i + 1];
    if (c === "/" && n === "/") {
      schiebe(i, true);
      const e = s.indexOf("\n", i);
      const bis = e === -1 ? s.length : e;
      out.push([s.slice(i, bis), false]);
      i = start = bis;
      continue;
    }
    if (c === "/" && n === "*") {
      schiebe(i, true);
      const e = s.indexOf("*/", i + 2);
      const bis = e === -1 ? s.length : e + 2;
      out.push([s.slice(i, bis), false]);
      i = start = bis;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      schiebe(i, true);
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === "\\") {
          j += 2;
          continue;
        }
        if (s[j] === c) break;
        j++;
      }
      const bis = Math.min(j + 1, s.length);
      out.push([s.slice(i, bis), false]);
      i = start = bis;
      continue;
    }
    i++;
  }
  schiebe(s.length, true);
  return out;
}

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Importpfade aus der Dateiliste ableiten: `lib/magazin` -> `lib/magazin`. */
const PFADE = [];
const RELATIV = [];
for (const [alt, neu] of Object.entries(DATEIEN)) {
  if (!extname(alt)) continue;
  const frag = (p) => {
    const t = p.split("/");
    const base = t.pop();
    const dir = t.pop();
    const ext = extname(base);
    return `${dir}/${ext === ".astro" || ext === ".json" ? base : base.slice(0, -ext.length)}`;
  };
  PFADE.push([frag(alt), frag(neu)]);

  /* Zusätzlich der nackte Dateiname: Ein Import aus demselben Ordner heißt
     `./ohne-null` und nicht `lib/ohne-null` — die Ordnerfassung allein hätte
     ihn nicht getroffen. */
  const nurName = (p) => {
    const base = p.split("/").pop();
    const ext = extname(base);
    return ext === ".astro" || ext === ".json"
      ? base
      : base.slice(0, -ext.length);
  };
  /* Nur als relativer Import (`./name`, `../name`), nicht als beliebiges
     Pfadstück. Ohne diese Einschränkung traf `magazin` auch die ADRESSE
     `/magazin` und machte `/magazine` daraus — die Seite lag danach unter
     einem Pfad, den niemand verlinkt. Die URLs bleiben deutsch. */
  if (nurName(alt) !== nurName(neu)) {
    RELATIV.push([nurName(alt), nurName(neu)]);
  }
}
PFADE.sort((a, b) => b[0].length - a[0].length);
RELATIV.sort((a, b) => b[0].length - a[0].length);

const WORTE = Object.entries(BEZEICHNER).sort(
  (a, b) => b[0].length - a[0].length,
);

let dateienGeaendert = 0;
for (const file of [
  ...(await alle("web/src")),
  ...(await alle("studio")),
  ...(await alle("scripts")),
]) {
  const vor = await readFile(file, "utf8");
  let s = "";
  for (const [teil, istCode] of stuecke(vor)) {
    if (!istCode) {
      /* Importpfade stehen IN Zeichenketten — nur die dürfen dort wandern. */
      let t = teil;
      /* An Grenzen, nicht als blindes Ersetzen: `magazin` ist ein Präfix von
         `magazine`, und `split().join()` machte beim zweiten Lauf
         `magazinee` daraus, beim dritten `magazineee`. Ein Migrationsschritt
         muss man zweimal laufen lassen können. */
      for (const [a, b] of PFADE) {
        t = t.replace(
          new RegExp(`(^|[./"'\`])${esc(a)}(?![\\w-])`, "g"),
          `$1${b}`,
        );
      }
      for (const [a, b] of RELATIV) {
        t = t.replace(
          new RegExp(`(\\.{1,2}/)${esc(a)}(?![\\w-])`, "g"),
          `$1${b}`,
        );
      }

      /* `${…}` in einem Template-Literal ist Code, keine Zeichenkette. Ohne
         diesen Zweig blieben `${VERZEICHNIS[typ]}` und `${quelle}` stehen,
         während ihre Deklarationen umbenannt wurden. */
      if (teil.startsWith("`")) {
        t = t.replace(/\$\{([^{}]*)\}/g, (ganz, inneres) => {
          let k = inneres;
          for (const [a, b] of WORTE)
            k = k.replace(new RegExp(`\\b${esc(a)}\\b`, "g"), b);
          return "${" + k + "}";
        });
      }
      s += t;
      continue;
    }
    let t = teil;
    for (const [a, b] of WORTE)
      t = t.replace(new RegExp(`\\b${esc(a)}\\b`, "g"), b);
    s += t;
  }
  if (s !== vor) {
    await writeFile(file, s, "utf8");
    dateienGeaendert++;
  }
}
console.log(`${dateienGeaendert} Dateien inhaltlich angepasst`);
