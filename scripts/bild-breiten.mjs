/**
 * Schreibt auf, welche Breiten je Motiv tatsächlich in `web/public/img`
 * liegen.
 *
 * Warum das nötig ist: Die Pipeline deckelt jede Stufe auf die Breite der
 * Quelle (`WIDTHS.filter(w => w <= meta.width)`), das Markup schrieb die
 * Stufen aber von Hand hin. `treatment-02` ist 1920px breit und hat deshalb
 * keine 2200er Fassung — `Features.astro` forderte sie trotzdem an. Auf einem
 * breiten Schirm wählte der Browser genau diese Kandidatin, bekam 404 und
 * zeigte nichts. Auf der Veneers-Seite war das die erste Bild-Text-Zeile.
 *
 * Dass im Code bereits `widths="640,961"` und `widths="640,1017"` standen,
 * war der Hinweis: Wer die Stufen abtippt, tippt irgendwann eine ab, die es
 * nicht gibt. Diese Datei ist die eine Quelle dafür; `Picture.astro` liest
 * sie, und niemand nennt mehr eine Breite von Hand.
 *
 * Läuft am Ende von `npm run images` mit und lässt sich einzeln aufrufen:
 *
 *     node scripts/bild-breiten.mjs
 *
 * Es liest den Ordner und nicht `assets/raw` — die Roh-Exporte liegen nicht
 * im Repository, die fertigen Bilder schon.
 */
import { readdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ORDNER = "web/public/img";
const ZIEL = "web/src/lib/bild-breiten.json";

export async function schreibeBreiten() {
  const dateien = await readdir(ORDNER);

  /* Nur AVIF zählen. Jede Breite existiert in beiden Formaten; zweimal zu
     zählen ergäbe dieselbe Liste doppelt. */
  const je = new Map();
  for (const datei of dateien) {
    const treffer = datei.match(/^(.+)-(\d+)\.avif$/);
    if (!treffer) continue;
    const [, name, breite] = treffer;
    if (!je.has(name)) je.set(name, new Set());
    je.get(name).add(Number(breite));
  }

  const fehlend = [];
  for (const [name, breiten] of je) {
    for (const b of breiten) {
      if (!dateien.includes(`${name}-${b}.webp`)) fehlend.push(`${name}-${b}.webp`);
    }
  }
  if (fehlend.length) {
    throw new Error(
      `Zu diesen AVIF-Dateien fehlt die WebP-Fassung: ${fehlend.join(", ")}.\n` +
        `Der <source>-Rückfall liefe damit ins Leere. Bitte 'npm run images' laufen lassen.`
    );
  }

  const karte = Object.fromEntries(
    [...je].sort(([a], [b]) => a.localeCompare(b)).map(([name, b]) => [name, [...b].sort((x, y) => x - y)])
  );

  await writeFile(ZIEL, JSON.stringify(karte, null, 2) + "\n", "utf8");
  return karte;
}

/* `pathToFileURL` statt eines zusammengesetzten Strings: Der Projektpfad
   enthält Leerzeichen, und `import.meta.url` kodiert die als %20. Ein
   Vergleich mit `file://${process.argv[1]}` schlug deshalb immer fehl, und
   das Skript tat beim Direktaufruf gar nichts. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const karte = await schreibeBreiten();
  for (const [name, breiten] of Object.entries(karte)) {
    console.log(`  ${name.padEnd(24)} ${breiten.join(", ")}`);
  }
  console.log(`\n${Object.keys(karte).length} Motive nach ${ZIEL} geschrieben.`);
}
