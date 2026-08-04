/**
 * Nimmt die ersten Sekunden nach dem Aufruf in festen Abständen auf — ein
 * Daumenkino der Ladeanimation. Ohne das beurteilt man eine Choreografie aus
 * dem Gedächtnis: man sieht sie einmal, und beim nächsten Aufruf ist sie
 * schon wieder vorbei.
 *
 * Aufruf:  npm run intro -- [pfad]
 * Ziel über die Umgebung wählen:
 *   MP_BASE=http://localhost:4321 npm run intro
 *
 * Standardmäßig ohne Cache: so sieht es beim ersten Aufruf aus, mit dem
 * Nachladen von Schriften und Bildern.
 *
 * MP_RELOAD=1 lädt stattdessen zweimal und nimmt den zweiten Aufruf auf —
 * der Fall mit warmem Cache. Der ist nicht dasselbe: liegen die Schriften
 * schon vor, löst `document.fonts.ready` sofort aus, und die Choreografie
 * startet zu einem völlig anderen Zeitpunkt gegenüber dem ersten Bild.
 */
import { mkdir, rm } from "node:fs/promises";
import { starteBrowser } from "./lib/chrome.mjs";

const BASE = process.env.MP_BASE ?? "http://localhost:4322";
const OUT = process.env.MP_OUT ?? ".shots/intro";
const [pfad = "/"] = process.argv.slice(2);

// Dicht gelegt, wo die Choreografie einsetzt, weiter auseinander gegen Ende.
const MS = [150, 300, 450, 600, 800, 1000, 1200, 1500, 1800, 2200, 2600, 3200, 4000];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await starteBrowser();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const RELOAD = process.env.MP_RELOAD === "1";
await page.setCacheEnabled(RELOAD);

const url = `${BASE}${pfad}${pfad.includes("?") ? "&" : "?"}nosmooth`;

if (RELOAD) {
  // Erst einmal vollständig laden, damit Schriften und Bilder im Cache
  // liegen. Aufgenommen wird dann der zweite Aufruf.
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));
}

/* Die Uhr läuft ab dem ersten Bild, nicht ab dem Ende des Ladens: `goto`
   kehrt erst zurück, wenn das Dokument steht — bis dahin wäre die
   Choreografie schon halb gelaufen. Deshalb wird auf domcontentloaded
   gewartet und der Startzeitpunkt aus der Navigation der Seite selbst
   genommen. */
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
const start = Date.now() - (await page.evaluate(() => Math.round(performance.now())));

console.log(`${url}${RELOAD ? "  (zweiter Aufruf, warmer Cache)" : "  (erster Aufruf, kalt)"}\n`);

for (const [i, ms] of MS.entries()) {
  const warten = start + ms - Date.now();
  if (warten > 0) await new Promise((r) => setTimeout(r, warten));
  const name = `${OUT}/${String(i).padStart(2, "0")}_${String(ms).padStart(4, "0")}ms.png`;
  await page.screenshot({ path: name });
  console.log(`  ${name}`);
}

await browser.close();
