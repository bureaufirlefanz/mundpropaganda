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
let probleme = 0;

for (const vp of VIEWPORTS) {
  console.log(`\n── ${vp.name} (${vp.width}×${vp.height}) ──`);
  for (const pfad of PAGES) {
    probleme += melde(pfad, await pruefeSeite(browser, BASE + pfad, vp));
  }
}

await browser.close();
console.log(probleme ? `\n${probleme} Befund(e).` : "\nAlles sauber.");
process.exit(probleme ? 1 : 0);
