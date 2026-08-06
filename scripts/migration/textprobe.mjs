/**
 * Nimmt den sichtbaren Text aller gebauten Seiten auf.
 *
 * Der Wächter für Etappe 2 und 3: Eine Umbenennung im Code darf am Text der
 * Seite NICHTS ändern. Genau das fängt kein Typprüfer und kein Rauchtest —
 * aus `label="Beitrag lesen"` würde „Post lesen", und die Seite wäre technisch
 * einwandfrei und inhaltlich falsch.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function seiten(o) {
  const r = [];
  for (const e of await readdir(o, { withFileTypes: true })) {
    const p = join(o, e.name);
    if (e.isDirectory()) r.push(...(await seiten(p)));
    else if (e.name.endsWith(".html")) r.push(p);
  }
  return r;
}

const ziel = process.argv[2];
const raus = {};
for (const datei of (await seiten("web/dist")).sort()) {
  const html = await readFile(datei, "utf8");
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  raus[datei.replace("web/dist/", "")] = text;
}
await writeFile(ziel, JSON.stringify(raus, null, 1), "utf8");
console.log(`${Object.keys(raus).length} Seiten aufgenommen -> ${ziel}`);
