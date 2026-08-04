/**
 * Blick — Ausschnittsaufnahme eines einzelnen Abschnitts, zum Prüfen während
 * der Arbeit.
 *
 * `aufnahmen.mjs` nimmt ganze Seiten auf und braucht dafür eine halbe Minute
 * je Seite. Beim Feilen an einer Section will man aber alle zwei Minuten
 * genau diesen einen Abschnitt sehen, in einer bestimmten Breite. Genau das
 * macht dieses Skript — und nichts sonst.
 *
 * Aufruf:
 *   node scripts/blick.mjs /            .s-services         1728
 *   node scripts/blick.mjs /            .c-footer            390
 *   node scripts/blick.mjs /karriere    .s-compare           390  --voll
 *
 * Die letzte Zahl ist die Fensterbreite in CSS-Pixeln. `--voll` nimmt den
 * Abschnitt in ganzer Höhe auf statt nur das, was ins Fenster passt.
 *
 * Aufgenommen wird der Abschnitt selbst, nicht das Fenster: So sitzt der
 * Ausschnitt immer richtig, ohne Scrollposition auszurechnen.
 */
import { starteBrowser, erwarteServer } from "./lib/chrome.mjs";
import { mkdir } from "node:fs/promises";

const BASIS = process.env.MP_BASIS || "http://localhost:4321";
const [pfad = "/", wahl = "body", breite = "1728", ...rest] = process.argv.slice(2);
const VOLL = rest.includes("--voll");
const ORDNER = "/tmp/blick";

await erwarteServer(BASIS, "npm run web");
await mkdir(ORDNER, { recursive: true });

const browser = await starteBrowser();
const seite = await browser.newPage();
await seite.setViewport({
  width: Number(breite),
  // Fensterhöhe zählt bei allem, was sich über `svh` oder `vh` bemisst — der
  // Hero etwa füllt die Fensterhöhe. 844 ist ein iPhone 14/15.
  height: Number(process.env.MP_H || 844),
  deviceScaleFactor: 2,
  // Unter 700px ist es ein Telefon — dort gilt `hover: none`, und daran
  // hängen mehrere Regeln. Ohne das prüfte man ein Layout, das auf dem Gerät
  // niemand zu sehen bekommt.
  hasTouch: Number(breite) <= 700,
  isMobile: Number(breite) <= 700,
});
await seite.goto(BASIS + pfad, { waitUntil: "networkidle0", timeout: 60000 });
await seite.evaluate(() => document.fonts.ready);

/* Einmal durch die Seite, damit jede Einblendung ausgelöst hat — sonst steht
   der gesuchte Abschnitt noch auf Opazität 0 und die Aufnahme ist leer. */
await seite.evaluate(async () => {
  const springe = (y) =>
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
  for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.5) {
    springe(y);
    await new Promise((r) => setTimeout(r, 90));
  }
  springe(0);
});
await new Promise((r) => setTimeout(r, 900));

/* Die Navigationsleiste liegt fest über allem und stünde quer im Bild. Sie
   ist aus dem Fluss genommen, das Ausblenden verschiebt nichts. Ebenso der
   Übergangsvorhang, der nach dem Laden liegenbleibt. */
await seite.evaluate(() => {
  const stil = document.createElement("style");
  stil.textContent = ".c-nav, .c-transition, astro-dev-toolbar { display: none !important; }";
  document.head.appendChild(stil);
});

const ziel = await seite.$(wahl);
if (!ziel) {
  console.error(`Kein Element für "${wahl}" auf ${pfad}.`);
  process.exit(1);
}

/* Den Abschnitt in die Bildmitte holen und dort in Ruhe kommen lassen. Bei
   `--voll` wird ohnehin das ganze Element aufgenommen. */
await ziel.scrollIntoView();
await new Promise((r) => setTimeout(r, 600));

const kasten = await ziel.boundingBox();
const datei = `${ORDNER}/${pfad.replace(/\W+/g, "_")}-${wahl.replace(/\W+/g, "_")}-${breite}.png`;

if (VOLL) {
  await ziel.screenshot({ path: datei, captureBeyondViewport: true });
} else {
  await seite.screenshot({
    path: datei,
    clip: { x: kasten.x, y: kasten.y, width: kasten.width, height: Math.min(kasten.height, 2400) },
  });
}

console.log(`${datei}  (${Math.round(kasten.width)}×${Math.round(kasten.height)} CSS-px)`);
await browser.close();
process.exit(0);
