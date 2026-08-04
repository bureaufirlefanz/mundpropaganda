/**
 * Ganzseiten-Aufnahmen aller Seiten, in Figma-Referenzbreite.
 *
 * Aufruf:  node scripts/aufnahmen.mjs              (1728px, doppelte Auflösung)
 *          MP_W=390 node scripts/aufnahmen.mjs
 *          MP_SKALA=1 node scripts/aufnahmen.mjs
 *          MP_NUR=/karriere node scripts/aufnahmen.mjs   (nur eine Seite)
 *
 * Die Auflösung kommt über die Gerätepixeldichte, nicht über eine größere
 * Breite. Das ist ein Unterschied: Bei 3456px Fensterbreite gälte ein anderer
 * Breakpoint und die `clamp()`-Werte fielen anders aus — die Aufnahme zeigte
 * ein Layout, das so niemand sieht. Mit `deviceScaleFactor` bleibt das Layout
 * bei 1728 CSS-Pixeln und wird nur feiner gerastert.
 *
 * ── Warum gekachelt und nicht `fullPage: true` ───────────────────────────
 *
 * Chrome setzt eine Aufnahme über eine Textur zusammen und kann dabei
 * 16384px je Richtung nicht überschreiten. Darüber bricht die Darstellung
 * ein — und zwar OHNE Fehlermeldung: Hintergründe fehlen, Bilder bleiben
 * graue Flächen, ganze Textblöcke werden nicht gezeichnet. Bei 1× lagen die
 * Seiten mit 12–14.000px knapp darunter und sahen gut aus; bei 2× lagen
 * dieselben Seiten bei 25–28.000px, und die Aufnahmen waren unbrauchbar.
 *
 * Deshalb wird fensterweise aufgenommen und anschließend zusammengesetzt.
 * Jede Kachel ist so groß wie das Fenster, liegt also immer weit unter der
 * Grenze — unabhängig davon, wie lang die Seite ist.
 *
 * Fixierte Elemente (die Navigationsleiste) werden ab der zweiten Kachel
 * ausgeblendet. Sonst klebten sie in jeder Kachel und die fertige Aufnahme
 * zeigte die Leiste ein Dutzend Mal übereinander.
 */
import { starteBrowser, erwarteServer } from "./lib/chrome.mjs";
import { mkdir, rm } from "node:fs/promises";
import sharp from "sharp";

const BASIS = "http://localhost:4322";
const BREITE = Number(process.env.MP_W || 1728);
const SKALA = Number(process.env.MP_SKALA || 2);
const FENSTER = 1000; // Kachelhöhe in CSS-Pixeln
const ORDNER = "aufnahmen";
const TEMP = "aufnahmen/.kacheln";

await erwarteServer(BASIS, "npm run web:preview");
await mkdir(ORDNER, { recursive: true });

const browser = await starteBrowser();

/* Seiten aus der Startseite heraus finden, damit hier keine zweite Liste
   gepflegt werden muss, die veraltet. */
const sucher = await browser.newPage();
await sucher.goto(BASIS + "/", { waitUntil: "networkidle2", timeout: 60000 });
const gefunden = await sucher.evaluate(() =>
  [...document.querySelectorAll('a[href^="/"]')]
    .map((a) => new URL(a.getAttribute("href"), location.origin).pathname)
    .filter((p) => !/\.[a-z0-9]+$/i.test(p))
);
await sucher.close();

const ALLE = [...new Set(["/", ...gefunden, "/design/styleguide", "/design/komponenten"])];
const SEITEN = process.env.MP_NUR ? ALLE.filter((p) => p === process.env.MP_NUR) : ALLE;

const name = (pfad) =>
  (pfad === "/" ? "startseite" : pfad.replace(/^\//, "").replace(/\//g, "-")) +
  `-${BREITE}${SKALA > 1 ? `@${SKALA}x` : ""}.png`;

console.log(`${SEITEN.length} Seiten, ${BREITE}px breit, ${SKALA}× Auflösung → ${ORDNER}/\n`);

for (const pfad of SEITEN) {
  await rm(TEMP, { recursive: true, force: true });
  await mkdir(TEMP, { recursive: true });

  const seite = await browser.newPage();
  await seite.setViewport({ width: BREITE, height: FENSTER, deviceScaleFactor: SKALA });
  await seite.goto(BASIS + pfad, { waitUntil: "networkidle0", timeout: 60000 });
  await seite.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1600));

  /* Einmal durch und zurück, damit jede Einblendung ausgelöst hat und jedes
     lazy geladene Bild angefordert wurde. Schrittweise — ein Sprung ans Ende
     überspränge die meisten Auslöser. */
  await seite.evaluate(async () => {
    const springe = (y) =>
      window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.5) {
      springe(y);
      await new Promise((r) => setTimeout(r, 120));
    }
    springe(0);
  });
  await new Promise((r) => setTimeout(r, 1200));

  /* Klebende Elemente einmalig lösen. In einem Standbild gehört ein
     Tabellenkopf oder eine mitlaufende Überschrift an ihren natürlichen
     Platz — geklebt erschiene sie in jeder Kachel erneut, die ihr Abschnitt
     durchläuft. `static` ergibt dieselbe Box wie `sticky`, das Layout
     verschiebt sich dadurch nicht. */
  await seite.evaluate(() => {
    const stil = document.createElement("style");
    stil.textContent =
      ".mp-nicht-klebend { position: static !important; }" +
      ".mp-aufnahme-aus { display: none !important; }";
    document.head.appendChild(stil);

    document.querySelectorAll("body *").forEach((el) => {
      if (getComputedStyle(el).position === "sticky") el.classList.add("mp-nicht-klebend");
    });
  });
  await new Promise((r) => setTimeout(r, 400));

  const hoehe = await seite.evaluate(() => Math.round(document.documentElement.scrollHeight));
  const kacheln = Math.ceil(hoehe / FENSTER);
  const teile = [];

  for (let i = 0; i < kacheln; i++) {
    const y = i * FENSTER;

    await seite.evaluate(
      (ziel, ersteKachel) => {
        window.__lenis ? window.__lenis.scrollTo(ziel, { immediate: true }) : scrollTo(0, ziel);

        /* Ab der zweiten Kachel alles ausblenden, was am Fenster festsitzt —
           sonst stünde die Navigationsleiste in jeder Kachel und damit ein
           Dutzend Mal in der fertigen Aufnahme.

           `display: none`, nicht `visibility: hidden`: Die Leiste setzt an
           ihrem inneren Element `visibility: visible`, und ein Nachfahre
           bleibt damit sichtbar, auch wenn der Vorfahr verborgen ist. Genau
           daran ist der erste Versuch gescheitert — die Leiste war laut
           Messung verborgen und stand trotzdem in jeder Kachel.

           Ausblenden ist hier unbedenklich: Was fest am Fenster sitzt, ist
           ohnehin aus dem Fluss genommen, das Layout verschiebt sich
           dadurch nicht. */
        document.querySelectorAll("body *").forEach((el) => {
          if (getComputedStyle(el).position === "fixed" || el.classList.contains("mp-aufnahme-aus")) {
            el.classList.toggle("mp-aufnahme-aus", !ersteKachel);
          }
        });
      },
      y,
      i === 0
    );
    await new Promise((r) => setTimeout(r, 260));

    /* Der Ausschnitt rechnet in SEITEN-Koordinaten, nicht in
       Fensterkoordinaten — Puppeteer misst ihn vom Dokumentanfang aus.
       Mit einem fensterrelativen Wert erwischte jede Kachel denselben
       oberen Bereich, und die fertige Aufnahme zeigte den Hero ein Dutzend
       Mal untereinander.

       Die letzte Kachel ist meist niedriger; aufgenommen wird nur, was noch
       zur Seite gehört. */
    const rest = Math.min(FENSTER, hoehe - y);
    const datei = `${TEMP}/${String(i).padStart(3, "0")}.png`;
    await seite.screenshot({
      path: datei,
      clip: { x: 0, y, width: BREITE, height: rest },
    });
    teile.push({ datei, top: y * SKALA, hoehe: rest * SKALA });
  }

  await seite.close();

  const ziel = `${ORDNER}/${name(pfad)}`;
  await sharp({
    create: {
      width: BREITE * SKALA,
      height: hoehe * SKALA,
      channels: 3,
      background: "#d6d6d6",
    },
  })
    .composite(teile.map((t) => ({ input: t.datei, top: t.top, left: 0 })))
    .png()
    .toFile(ziel);

  console.log(`  ${pfad.padEnd(34)} ${String(hoehe).padStart(6)}px · ${String(kacheln).padStart(2)} Kacheln  →  ${ziel}`);
}

await rm(TEMP, { recursive: true, force: true });
await browser.close();
process.exit(0);
