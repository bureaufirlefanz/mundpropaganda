/**
 * Zeigt das erste Bild — den Zustand, den der Browser zeichnet, bevor die
 * Module laufen.
 *
 * Dazu wird das JS-Bundle blockiert und alles andere normal geladen. Was dann
 * zu sehen ist, sieht auch jeder Besucher für den Bruchteil einer Sekunde
 * zwischen Stylesheet und Skript. Steht dort etwas in seiner Endlage, das
 * eigentlich erst animiert erscheinen soll, springt es gleich darauf in den
 * Startzustand zurück — der Fehler, den man als „die Animation feuert nicht"
 * wahrnimmt.
 *
 * Mit einem Zeitstichprobenlauf ist das nicht zu fassen: lokal liegen zwischen
 * erstem Bild und Skriptlauf oft weniger als 50 ms.
 *
 * Aufruf:  npm run erstbild -- [pfad]
 */
import { mkdir, rm } from "node:fs/promises";
import { starteBrowser } from "./lib/chrome.mjs";

const BASE = process.env.MP_BASE ?? "http://localhost:4322";
const OUT = process.env.MP_OUT ?? ".shots/erstbild";
const [pfad = "/"] = process.argv.slice(2);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await starteBrowser();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

await page.setRequestInterception(true);
const blockiert = [];
page.on("request", (r) => {
  // Alle Skripte abweisen, Inline-Skripte im Dokument laufen weiter.
  if (r.resourceType() === "script") {
    blockiert.push(new URL(r.url()).pathname);
    r.abort().catch(() => {});
    return;
  }
  r.continue().catch(() => {});
});

const url = `${BASE}${pfad}`;
await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => {});
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));

const zustand = await page.evaluate(() => {
  const sicht = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return "fehlt";
    const s = getComputedStyle(el);
    return `visibility=${s.visibility} opacity=${s.opacity}`;
  };
  return {
    js: document.documentElement.classList.contains("js"),
    wortmarke: sicht(".s-hero__word"),
    leiste: sicht("[data-nav] .c-nav__inner"),
    bewertung: sicht(".s-hero__foot"),
    scrollknopf: sicht(".s-hero__scroll"),
    zahn: sicht(".s-hero__tooth"),
    // Kinder eines Stagger-Containers mitzählen: sie tragen kein
    // [data-reveal], werden aber genauso erst von GSAP eingeblendet.
    reveals: [...document.querySelectorAll("[data-reveal], [data-reveal-child]")].filter(
      (el) => parseFloat(getComputedStyle(el).opacity) > 0.05
    ).length,
    revealsGesamt: document.querySelectorAll("[data-reveal], [data-reveal-child]").length,
    splits: [...document.querySelectorAll("[data-split], [data-hero-word]")].filter(
      (el) => getComputedStyle(el).visibility !== "hidden"
    ).length,
    splitsGesamt: document.querySelectorAll("[data-split], [data-hero-word]").length,
  };
});

console.log(`${url}\nBlockierte Skripte: ${[...new Set(blockiert)].join(", ") || "keine"}\n`);
console.log(`  js-Klasse gesetzt:      ${zustand.js ? "ja" : "NEIN — dann greift keine Startregel"}`);
console.log(`  Wortmarke:              ${zustand.wortmarke}`);
console.log(`  Navigationsleiste:      ${zustand.leiste}`);
console.log(`  Bewertungsleiste:       ${zustand.bewertung}`);
console.log(`  Scroll-Knopf:           ${zustand.scrollknopf}`);
console.log(`  Zahn:                   ${zustand.zahn}`);
console.log(`  sichtbare [data-reveal]: ${zustand.reveals} von ${zustand.revealsGesamt}`);
console.log(`  sichtbare [data-split]:  ${zustand.splits} von ${zustand.splitsGesamt}`);

await page.screenshot({ path: `${OUT}/erstbild.png` });
console.log(`\n  ${OUT}/erstbild.png`);

await browser.close();
