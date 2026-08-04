/**
 * Visuelle QA: fährt die Seite in Etappen ab und legt Screenshots in
 * .shots/ ab. Nutzt das lokal installierte Chrome, lädt also keine
 * eigene Browser-Binary herunter.
 *
 * Aufruf:  npm run shots -- [pfad] [breite] [höhe]
 * Beispiel: npm run shots -- /leistungen/veneers.html 1440 900
 *
 * Standardziel ist der Prototyp auf :5173. Für die Astro-App das Ziel über
 * die Umgebung setzen:
 *   MP_BASE=http://localhost:4321 npm run shots -- /leistungen/veneers
 *
 * Lenis wird per ?nosmooth abgeschaltet, sonst kämpft der Smooth-Scroll
 * gegen die programmatischen Sprünge und wir fotografieren Zwischenbilder.
 */
import puppeteer from "puppeteer-core";
import { mkdir, rm } from "node:fs/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.MP_BASE ?? "http://localhost:5173";
const [path = "/", width = "1440", height = "900"] = process.argv.slice(2);
const W = Number(width);
const H = Number(height);
const OUT = process.env.MP_OUT ?? ".shots";

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}nosmooth`;
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

// Webfonts abwarten, sonst fotografieren wir den Fallback-Satz.
await page.evaluate(() => document.fonts.ready);

const total = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.ceil(total / H);

console.log(`${url}\n${W}×${H} · Seite ${total}px · ${steps} Etappen`);

for (let i = 0; i < steps; i++) {
  const y = i * H;
  await page.evaluate((to) => window.scrollTo(0, to), y);

  // Reveal-Animationen und Lazy-Bilder brauchen einen Moment. Die erste
  // Etappe wartet länger: dort läuft zusätzlich die Hero-Choreografie,
  // die rund zwei Sekunden dauert.
  await new Promise((r) => setTimeout(r, i === 0 ? 3000 : 1100));

  const name = `${OUT}/${String(i).padStart(2, "0")}_y${y}.png`;
  await page.screenshot({ path: name });
  console.log(`  ${name}`);
}

await browser.close();
