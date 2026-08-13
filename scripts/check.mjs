/**
 * Rauchtest des Prototyps: lädt jede Seite, scrollt einmal durch und meldet
 * Konsolenfehler, fehlgeschlagene Requests, unsichtbar gebliebene Reveals
 * und horizontales Überlaufen — über drei Breakpoints.
 *
 * Aufruf: npm run check   (setzt einen laufenden `npm run dev` voraus)
 *
 * Die Prüflogik liegt in lib/smoke.mjs, gemeinsam mit check-web.mjs.
 */
import { starteBrowser, erwarteServer } from "./lib/chrome.mjs";
import { VIEWPORTS, pruefeSeite, melde } from "./lib/smoke.mjs";

const BASE = "http://localhost:5173";
const PAGES = ["/", "/leistungen/veneers.html", "/styleguide.html"];

await erwarteServer(BASE, "npm run dev");

const browser = await starteBrowser();
let problems = 0;

for (const vp of VIEWPORTS) {
  console.log(`\n── ${vp.name} (${vp.width}×${vp.height}) ──`);
  for (const path of PAGES) {
    problems += melde(path, await pruefeSeite(browser, BASE + path, vp));
  }
}

await browser.close();
console.log(problems ? `\n${problems} Befund(e).` : "\nAlles sauber.");
process.exit(problems ? 1 : 0);
