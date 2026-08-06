import { starteBrowser, erwarteServer } from "./lib/chrome.mjs";
import sharp from "sharp";
const BASE = "http://localhost:4322";
const ZIEL = "/private/tmp/claude-501/-Users-flo-Dropbox-Bureau-Firlefanz-Claude-Code-Mundpropaganda/9fa1e55c-66fe-46b6-ad90-f001f5ed994b/scratchpad";
await erwarteServer(BASE, "npm run web:preview");
const browser = await starteBrowser();

for (const breite of [1440, 1366, 1280, 818]) {
  const seite = await browser.newPage();
  await seite.setViewport({ width: breite, height: 700 });
  await seite.goto(BASE + "/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));

  const geo = await seite.evaluate(() => {
    const p = [...document.querySelectorAll(".c-transition__panel")];
    // Vorhang in Deckstellung bringen
    for (const el of p) el.style.transform = "translateY(100%)";
    return p.map((el) => {
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { links: +b.left.toFixed(2), rechts: +b.right.toFixed(2), breite: +b.width.toFixed(2), rand: cs.borderLeftWidth };
    });
  });
  await new Promise((r) => setTimeout(r, 200));

  const png = await seite.screenshot({ type: "png" });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  // Eine Zeile in der Mitte abtasten
  const y = Math.floor(info.height / 2);
  const spalte = (x) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i+1], data[i+2]]; };
  const grund = spalte(20);

  const auffaellig = [];
  for (let x = 1; x < info.width - 1; x++) {
    const c = spalte(x);
    const d = Math.abs(c[0]-grund[0]) + Math.abs(c[1]-grund[1]) + Math.abs(c[2]-grund[2]);
    if (d > 12) auffaellig.push({ x, c, d });
  }
  // benachbarte x zu Linien gruppieren
  const linien = [];
  for (const a of auffaellig) {
    const letzte = linien.at(-1);
    if (letzte && a.x - letzte.bis <= 1) { letzte.bis = a.x; if (a.d > letzte.d) { letzte.d = a.d; letzte.c = a.c; } }
    else linien.push({ von: a.x, bis: a.x, d: a.d, c: a.c });
  }

  console.log(`\n${breite}px — Spaltenkanten: ${geo.map(g => g.links.toFixed(1)).join(", ")} | Ende ${geo.at(-1).rechts.toFixed(1)}`);
  console.log(`   Spaltenbreiten: ${geo.map(g => g.breite.toFixed(2)).join(", ")}`);
  for (const l of linien) {
    console.log(`   Linie x ${String(l.von).padStart(4)}–${String(l.bis).padEnd(4)} rgb(${l.c.join(",")})  Abstand zum Grund ${l.d}`);
  }
  if (breite === 1440) await seite.screenshot({ path: `${ZIEL}/vorhang.png` });
  await seite.close();
}
await browser.close();
