/**
 * Wann passiert was? Misst die Marken, an denen die Hero-Choreografie hängt,
 * und wann die Wortmarke tatsächlich anfängt sich zu bewegen.
 *
 * Aufruf:  npm run takt            (kalt)
 *          MP_RELOAD=1 npm run takt (warmer Cache)
 */
import { starteBrowser } from "./lib/chrome.mjs";

const BASE = process.env.MP_BASE ?? "http://localhost:4322";
const RELOAD = process.env.MP_RELOAD === "1";

const browser = await starteBrowser();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.setCacheEnabled(RELOAD);

const url = `${BASE}/?nosmooth`;

if (RELOAD) {
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));
}

/* Vor dem Dokument einhängen, damit die Marken ab dem allerersten Skriptlauf
   gesetzt werden — später ließe sich der Anfang nicht mehr messen. */
await page.evaluateOnNewDocument(() => {
  window.__takt = {};
  const marke = (name) => (window.__takt[name] ??= Math.round(performance.now()));

  marke("erstesSkript");

  document.addEventListener("DOMContentLoaded", () => marke("domReady"));
  document.addEventListener("astro:page-load", () => marke("astroPageLoad"));
  window.addEventListener("load", () => marke("load"));

  document.fonts.ready.then(() => marke("fontsReady"));

  /* Nur die Schrift, die die Wortmarke braucht. Das ist der entscheidende
     Unterschied: `fonts.ready` wartet auf alle vier Schnitte. */
  try {
    document.fonts.load('500 1em "PP Neue Montreal"').then(() => marke("sans500"));
    document.fonts.load('400 1em "PP Neue Montreal"').then(() => marke("sans400"));
    document.fonts.load('300 1em "GT Pressura Mono"').then(() => marke("mono300"));
  } catch {}

  /* Ab wann bewegt sich die Wortmarke wirklich? Gesucht ist der erste Moment,
     in dem ein Zeichen nicht mehr in seiner Startlage steht. */
  const beobachte = () => {
    const wort = document.querySelector("[data-hero-word]");
    if (wort) {
      if (getComputedStyle(wort).visibility === "visible") marke("typoSichtbar");
      // SplitText verschachtelt Maske und Zeichen; die Transform sitzt am
      // inneren Element. Deshalb alle Nachfahren prüfen, nicht das erste.
      const bewegt = [...wort.querySelectorAll("div")].some((el) => {
        const t = getComputedStyle(el).transform;
        return t && t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
      });
      if (bewegt) marke("typoStartet");
    }
    if (!window.__takt.typoStartet || !window.__takt.typoSichtbar) requestAnimationFrame(beobachte);
  };
  requestAnimationFrame(beobachte);
});

await page.goto(url, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3000));

const takt = await page.evaluate(() => window.__takt);
const reihenfolge = [
  ["erstesSkript", "erstes Skript im Dokument"],
  ["sans500", "PP Neue Montreal 500 (Wortmarke)"],
  ["sans400", "PP Neue Montreal 400"],
  ["mono300", "GT Pressura Mono 300"],
  ["domReady", "DOMContentLoaded"],
  ["fontsReady", "document.fonts.ready (alle vier Schnitte)"],
  ["astroPageLoad", "astro:page-load — hier startet init()"],
  ["typoSichtbar", "Wortmarke freigegeben"],
  ["typoStartet", "Wortmarke bewegt sich"],
  ["load", "window load"],
];

console.log(`${url}${RELOAD ? "  (warmer Cache)" : "  (kalt)"}\n`);
for (const [k, text] of reihenfolge) {
  const v = takt[k];
  console.log(`  ${String(v ?? "—").padStart(5)} ms  ${text}`);
}

await browser.close();
