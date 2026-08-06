/**
 * Schreibt die Bezeichner in den Quelldateien um.
 *
 * **Gezielt statt flächendeckend.** Ein einfaches Suchen-und-Ersetzen über
 * „titel" träfe im Studio auch `title: "Titel"` — und das ist die
 * Beschriftung, die der Kunde im Formular liest. Sie bleibt deutsch. Deshalb
 * hängt jede Regel hier an einem Muster, das nur den Bezeichner trifft:
 *
 *   name: "titel"          das Feld im Schema
 *   type: "leistung"       ein Typverweis
 *   _type == "beitrag"     in GROQ
 *   _id == "startseite"    in GROQ
 *   d.titel                ein Zugriff im Astro-Code
 *
 * Aufruf:
 *
 *     node scripts/migration/quellen.mjs --pruefen     nur zeigen
 *     node scripts/migration/quellen.mjs               anwenden
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { pathToFileURL } from "node:url";
import { TYPEN, IDS, FELDER, GESCHUETZT } from "./namen.mjs";

const ENDUNGEN = new Set([".ts", ".tsx", ".astro", ".js", ".mjs"]);

/* `.ndjson` fehlt mit Absicht: Die Seed-Dateien gehen durch `umschreiben.mjs`,
   also durch denselben Weg wie der Datensatz. Ein Regex über JSON träfe auch
   Inhaltstexte — in einem Beitrag über Veneers steht das Wort „Titel"
   irgendwann im Fließtext, und dann stünde es dort auf Englisch.

   `sanity.types.ts` wird von TypeGen erzeugt und nach der Migration neu
   geschrieben. Sie hier anzufassen hieße, 541 Zeilen von Hand zu pflegen,
   die beim nächsten `npm run types` ohnehin überschrieben werden. */
const AUSGENOMMEN = [
  "node_modules",
  "dist",
  ".astro",
  ".netlify",
  ".git",
  "scripts/migration",
  "sanity.types.ts",
];

async function dateien(ordner) {
  const raus = [];
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name);
    if (AUSGENOMMEN.some((a) => pfad.includes(a))) continue;
    if (eintrag.isDirectory()) raus.push(...(await dateien(pfad)));
    else if (ENDUNGEN.has(extname(eintrag.name))) raus.push(pfad);
  }
  return raus;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Alle Ersetzungen, in der Reihenfolge, in der sie angewandt werden. */
function regeln() {
  const r = [];

  /* --- Typen ----------------------------------------------------------- */
  for (const [alt, neu] of Object.entries(TYPEN)) {
    const a = esc(alt);
    // name: "leistung" / type: "leistung" / schemaType("leistung")
    r.push([new RegExp(`(\\b(?:name|type|schemaType|documentTypeListItem)\\s*[:(]\\s*)(["'])${a}\\2`, "g"), `$1$2${neu}$2`]);
    // _type == "leistung" und _type in ["leistung", …]
    r.push([new RegExp(`(_type\\s*(?:==|!=)\\s*)(["'])${a}\\2`, "g"), `$1$2${neu}$2`]);
    // "leistung" in einer Liste von Typnamen (OHNE_ROUTE, EINZELDOKUMENTE, …)
    r.push([new RegExp(`(["'])${a}\\1(\\s*[,\\]])`, "g"), `$1${neu}$1$2`]);
  }

  /* --- IDs der Einzeldokumente ----------------------------------------- */
  for (const [alt, neu] of Object.entries(IDS)) {
    const a = esc(alt);
    r.push([new RegExp(`(_id\\s*(?:==|!=)\\s*)(["'])${a}\\2`, "g"), `$1$2${neu}$2`]);
    r.push([new RegExp(`(documentId\\(\\s*)(["'])${a}\\2`, "g"), `$1$2${neu}$2`]);
  }

  /* --- Feldnamen -------------------------------------------------------- */
  for (const [alt, neu] of Object.entries(FELDER)) {
    if (GESCHUETZT.has(alt)) continue;
    const a = esc(alt);
    // name: "titel" im Schema
    r.push([new RegExp(`(\\bname\\s*:\\s*)(["'])${a}\\2`, "g"), `$1$2${neu}$2`]);
    // select: { titel: "titel" } und andere Objektschlüssel im Schema
    r.push([new RegExp(`(\\{[^{}]*?\\b)${a}(\\s*:)`, "g"), `$1${neu}$2`]);
  }

  return r;
}

export async function laufe({ pruefen = false, wurzeln = ["studio", "web/src", "scripts"] } = {}) {
  const REGELN = regeln();
  const bericht = [];

  for (const wurzel of wurzeln) {
    for (const datei of await dateien(wurzel)) {
      const vorher = await readFile(datei, "utf8");
      let nachher = vorher;
      for (const [muster, ersatz] of REGELN) nachher = nachher.replace(muster, ersatz);
      if (nachher === vorher) continue;

      const zeilen = vorher.split("\n").filter((z, i) => z !== nachher.split("\n")[i]).length;
      bericht.push({ datei, zeilen });
      if (!pruefen) await writeFile(datei, nachher, "utf8");
    }
  }
  return bericht;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pruefen = process.argv.includes("--pruefen");
  const bericht = await laufe({ pruefen });
  for (const b of bericht) console.log(`  ${String(b.zeilen).padStart(4)} Zeilen  ${b.datei}`);
  console.log(`\n${bericht.length} Dateien${pruefen ? " (nur geprüft, nichts geschrieben)" : " geändert"}.`);
}
