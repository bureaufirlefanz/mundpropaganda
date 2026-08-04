/**
 * Stil-Abgleich: nimmt für jedes Element im Dokument die gerechneten Werte
 * und seine Position auf und vergleicht sie mit einem früheren Stand.
 *
 * Gebaut für Umbauten am CSS, bei denen sich am Ergebnis nichts ändern soll —
 * etwa das Aufteilen der globalen Stylesheets in die Komponenten. Ein Blick
 * auf Screenshots übersieht drei verschobene Pixel; das hier nicht.
 *
 *   npm run web:build && npm run web:preview   (im zweiten Terminal)
 *   npm run web:styles -- sichern       Stand ablegen
 *   npm run web:styles -- vergleichen   gegen den abgelegten Stand prüfen
 *
 * Geprüft wird der Produktionsstand, nicht der Dev-Server: im
 * Entwicklungsmodus liefert Vite die importierten Stylesheets per JavaScript
 * aus — ohne JS wäre die Seite dort ungestylt. Im Build stehen sie als
 * Stylesheet im Dokument.
 *
 * Gemessen wird **ohne JavaScript**. Das ist keine Einschränkung, sondern der
 * Kern der Sache: sonst mischen sich GSAPs Inline-Stile, die von SplitText und
 * marker.js erzeugten Elemente und der Zeitpunkt, zu dem die Module gelaufen
 * sind, in den Vergleich. Genau das hat einen ersten Durchlauf verrauscht — mit
 * Meldungen über eine Deckkraft auf zugeklappten Menüpunkten, die niemand sehen
 * kann. Ohne JS ist das Dokument statisch und der Vergleich betrifft
 * ausschließlich CSS.
 *
 * Was dadurch nicht geprüft wird: Regeln, die an `html.js` hängen, und alles,
 * was die Module zur Laufzeit anlegen. Dafür ist check-web.mjs zuständig.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { starteBrowser, erwarteServer } from "./lib/chrome.mjs";
import { VIEWPORTS } from "./lib/smoke.mjs";

const BASE = "http://localhost:4322";
const ORDNER = ".shots/styles";
const SEITEN = ["/", "/leistungen/veneers"];

const befehl = process.argv[2] ?? "vergleichen";
if (!["sichern", "vergleichen"].includes(befehl)) {
  console.error(`Unbekannt: ${befehl}. Erwartet „sichern" oder „vergleichen".`);
  process.exit(2);
}

/* Nur Eigenschaften, die man auch sehen würde. Alle ~340 gerechneten Werte
   aufzunehmen bläht die Ablage auf und bringt Rauschen mit. */
const EIGENSCHAFTEN = [
  "display", "position", "inset", "float", "clear",
  "width", "height", "min-width", "max-width", "min-height", "max-height",
  "margin", "padding", "box-sizing",
  "font-family", "font-size", "font-weight", "font-style", "line-height",
  "letter-spacing", "text-transform", "text-align", "text-decoration-line",
  "white-space", "word-break", "text-wrap",
  "color", "background-color", "background-image", "background-size",
  "background-position", "background-repeat",
  "border-width", "border-style", "border-color", "border-radius",
  "opacity", "transform", "transform-origin", "rotate", "scale",
  "z-index", "overflow-x", "overflow-y", "visibility", "pointer-events",
  "flex-direction", "flex-wrap", "align-items", "justify-content", "gap",
  "grid-template-columns", "grid-template-rows", "grid-column", "grid-row",
  "aspect-ratio", "object-fit", "object-position",
  "box-shadow", "filter", "backdrop-filter", "mix-blend-mode",
  "mask-image", "clip-path", "-webkit-mask-image",
  "writing-mode", "list-style-type",
];

async function nimmAuf(browser, pfad, vp) {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  await page.goto(`${BASE}${pfad}?nosmooth`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  // Bilder verschieben nach dem Laden noch Höhen.
  await new Promise((r) => setTimeout(r, 1500));

  const daten = await page.evaluate((eigenschaften) => {
    /* Astro hängt an Elemente mit eigenem <style>-Block ein
       data-astro-cid-Attribut und teils eine astro-* Klasse. Beides gehört
       nicht in den Schlüssel — sonst gilt allein das Aufteilen des CSS schon
       als Änderung. */
    const schluessel = (el) => {
      const klassen = [...el.classList]
        .filter((k) => !k.startsWith("astro-"))
        .sort()
        .join(".");
      return `${el.tagName.toLowerCase()}${klassen ? "." + klassen : ""}`;
    };

    return [...document.querySelectorAll("body *")]
      .filter((el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE")
      .map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const werte = {};
        for (const p of eigenschaften) werte[p] = s.getPropertyValue(p);
        return {
          k: schluessel(el),
          // Auf ganze Pixel gerundet: Subpixel schwanken zwischen Durchläufen.
          rect: [Math.round(r.x), Math.round(r.y + window.scrollY), Math.round(r.width), Math.round(r.height)],
          werte,
        };
      });
  }, EIGENSCHAFTEN);

  await page.close();
  return daten;
}

function vergleiche(alt, neu, wo) {
  const funde = [];

  if (alt.length !== neu.length) {
    funde.push(`${wo}: ${alt.length} Elemente vorher, ${neu.length} jetzt — das Markup hat sich verschoben`);
  }

  const n = Math.min(alt.length, neu.length);
  for (let i = 0; i < n; i++) {
    const a = alt[i];
    const b = neu[i];

    if (a.k !== b.k) {
      funde.push(`${wo}: an Position ${i} stand „${a.k}", jetzt „${b.k}" — ab hier ist der Vergleich wertlos`);
      break;
    }

    const abweichungen = [];

    const felder = ["x", "y", "Breite", "Höhe"];
    a.rect.forEach((v, j) => {
      if (v !== b.rect[j]) abweichungen.push(`${felder[j]} ${v} → ${b.rect[j]}`);
    });

    for (const [p, v] of Object.entries(a.werte)) {
      if (b.werte[p] !== v) abweichungen.push(`${p}: ${v} → ${b.werte[p]}`);
    }

    if (abweichungen.length) funde.push(`${wo} · ${a.k} (#${i})\n      ${abweichungen.join("\n      ")}`);
  }

  return funde;
}

await erwarteServer(BASE, "npm run web:build && npm run web:preview");
await mkdir(ORDNER, { recursive: true });

const browser = await starteBrowser();
let funde = 0;

for (const vp of VIEWPORTS) {
  for (const pfad of SEITEN) {
    const name = `${pfad.replace(/[^a-z0-9]+/gi, "_") || "start"}-${vp.name}.json`;
    const datei = `${ORDNER}/${name}`;
    const jetzt = await nimmAuf(browser, pfad, vp);

    if (befehl === "sichern") {
      await writeFile(datei, JSON.stringify(jetzt));
      console.log(`  ↓ ${pfad} · ${vp.name} — ${jetzt.length} Elemente`);
      continue;
    }

    let vorher;
    try {
      vorher = JSON.parse(await readFile(datei, "utf8"));
    } catch {
      console.log(`  – ${pfad} · ${vp.name} — kein gesicherter Stand, übersprungen`);
      continue;
    }

    const liste = vergleiche(vorher, jetzt, `${pfad} · ${vp.name}`);
    if (liste.length) {
      funde += liste.length;
      liste.forEach((f) => console.log(`  ✗ ${f}`));
    } else {
      console.log(`  ✓ ${pfad} · ${vp.name} — ${jetzt.length} Elemente unverändert`);
    }
  }
}

await browser.close();

if (befehl === "sichern") {
  console.log(`\nStand liegt in ${ORDNER}/.`);
} else {
  console.log(funde ? `\n${funde} Abweichung(en).` : "\nKeine Abweichung.");
  process.exit(funde ? 1 : 0);
}
