/**
 * Rauchtest der Astro-App. Gleiche Befunde wie beim Prototyp (lib/smoke.mjs),
 * plus zwei Prüfungen, die es dort nicht braucht:
 *
 *  1. Die Seiten stehen nicht als Dateien fest, sondern entstehen aus den
 *     Daten. Deshalb werden sie ab „/" gecrawlt statt aufgelistet — eine neue
 *     Leistung im Studio wird damit automatisch mitgeprüft.
 *  2. Der Router tauscht nur den Inhalt aus, statt die Seite neu zu laden.
 *     Genau dabei können Module tot bleiben und ScrollTrigger sich stapeln.
 *     Beides wird nach einem echten Wechsel gemessen.
 *
 * Aufruf: npm run web:check   (setzt einen laufenden `npm run web` voraus)
 */
import { starteBrowser, erwarteServer } from "./lib/chrome.mjs";
import { VIEWPORTS, beobachte, scrolleDurch, messe, befunde, pruefeSeite, melde } from "./lib/smoke.mjs";
import { pruefeSeite as wcagMessen, wcagBefunde } from "./lib/wcag.mjs";

const BASE = "http://localhost:4321";

/* Über alle drei Breakpoints laufen nur die ersten beiden Seiten. Die
   Leistungsseiten teilen sich eine Route und damit ihren Aufbau — jede von
   ihnen dreimal abzufahren kostet Minuten und findet nichts Neues. Der Rest
   wird auf Desktop geprüft, damit kaputte Inhalte trotzdem auffallen. */
const VOLL = 2;

await erwarteServer(BASE, "npm run web");

/** Alle intern verlinkten Seiten ab „/" sammeln, eine Ebene tief. */
async function findeSeiten(browser) {
  const page = await browser.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/"]')]
      .map((a) => new URL(a.getAttribute("href"), location.origin).pathname)
      .filter((p) => !/\.[a-z0-9]+$/i.test(p))
  );
  await page.close();

  /* Die Design-Seiten sind absichtlich von nirgends verlinkt (interne
     Dokumentation, noindex) — der Kriecher fände sie also nie. Sie zeigen
     aber jeden Baustein der Seite und sind damit die eine Stelle, an der
     ein Kontrastfehler in ALLEN Komponenten zugleich auffällt. Deshalb
     hier fest dazu. */
  const DESIGN = ["/design/styleguide", "/design/komponenten"];

  // „/" zuerst, dann der Rest — die Startseite trägt die meisten Sections
  // und soll ganz oben im Protokoll stehen.
  return [...new Set(["/", ...links, ...DESIGN])];
}

/**
 * Ein echter Seitenwechsel über den Router. Geprüft wird, was danach kaputt
 * sein kann: Reveals, die nicht wieder anlaufen, und ScrollTrigger, die vom
 * alten Dokument übrig bleiben.
 */
async function pruefeWechsel(browser, ziel, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  const beobachtet = beobachte(page);

  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await scrolleDurch(page);

  const vorher = await page.evaluate(() => window.__st?.getAll?.().length ?? null);

  /* Den Moment direkt nach dem Austausch festhalten: der Router hat den neuen
     Inhalt eingesetzt, `init` läuft aber erst bei `astro:page-load`. Was hier
     schon sichtbar ist, blitzt in seiner Endlage auf und springt gleich darauf
     in den Startzustand — als „die Animation feuert nicht" wahrgenommen.
     Verborgen halten muss das CSS, nicht GSAP. */
  await page.evaluate(() => {
    document.addEventListener(
      "astro:after-swap",
      () => {
        const sichtbar = (sel, pruef) =>
          [...document.querySelectorAll(sel)].filter(pruef).length;
        window.__nachTausch = {
          htmlKlassen: document.documentElement.className,
          reveals: sichtbar(
            "[data-reveal], [data-reveal-child]",
            (el) => parseFloat(getComputedStyle(el).opacity) > 0.05
          ),
          splits: sichtbar(
            "[data-split], [data-hero-word]",
            (el) => getComputedStyle(el).visibility !== "hidden"
          ),
        };
      },
      { once: true }
    );
  });

  const gewechselt = await page.evaluate(async (ziel) => {
    const link = [...document.querySelectorAll("a[href]")].find(
      (a) => new URL(a.href).pathname === ziel
    );
    if (!link) return false;
    link.click();
    // Auf das Router-Ereignis warten, nicht auf eine Frist — sonst messen
    // wir mitten im Austausch.
    await new Promise((r) => {
      document.addEventListener("astro:page-load", r, { once: true });
      setTimeout(r, 8000);
    });
    return location.pathname === ziel;
  }, ziel);

  const liste = [];
  if (!gewechselt) {
    liste.push(`Router-Wechsel nach ${ziel} hat nicht stattgefunden`);
  } else {
    const nachTausch = await page.evaluate(() => window.__nachTausch ?? null);
    if (nachTausch && !nachTausch.htmlKlassen.split(/\s+/).includes("js")) {
      liste.push(`die Klasse „js" fehlt nach dem Austausch — keine Startregel greift`);
    }
    if (nachTausch?.reveals) {
      liste.push(`${nachTausch.reveals} Reveals stehen direkt nach dem Austausch schon sichtbar da`);
    }
    if (nachTausch?.splits) {
      liste.push(`${nachTausch.splits} Headlines stehen direkt nach dem Austausch schon sichtbar da`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await scrolleDurch(page);
    liste.push(...befunde(beobachtet, await messe(page)));

    const nachher = await page.evaluate(() => window.__st?.getAll?.().length ?? null);
    // Die Trigger der alten Seite müssen weg sein. Grob doppelt so viele wie
    // vorher heißt: sie wurden nicht aufgeräumt und messen gegen Elemente,
    // die es nicht mehr gibt.
    if (vorher && nachher && nachher > vorher * 1.8) {
      liste.push(`ScrollTrigger stapeln sich: ${vorher} vor dem Wechsel, ${nachher} danach`);
    }
  }

  await page.close();
  return liste;
}

/**
 * Gegenprobe zu den Startregeln: was bis zu seiner Animation verborgen wird
 * (`html.js …`), muss ohne Bewegung sofort sichtbar sein. Sonst bleibt für
 * jeden mit „Bewegung reduzieren" die halbe Seite leer — ein Fehler, den man
 * selbst nie sieht, solange die Einstellung aus ist.
 */
async function pruefeOhneBewegung(browser, pfad, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const beobachtet = beobachte(page);

  await page.goto(BASE + pfad, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));
  await scrolleDurch(page);

  const versteckt = await page.evaluate(() => {
    const bezeichne = (el) =>
      el.className && typeof el.className === "string"
        ? `${el.tagName.toLowerCase()}.${el.className.trim().split(/\s+/)[0]}`
        : el.tagName.toLowerCase();

    return [
      ...document.querySelectorAll(
        "[data-reveal], [data-reveal-child], [data-split], [data-hero-word]," +
          " [data-hero-foot], [data-hero-scroll], [data-hero-tooth], [data-nav] .c-nav__inner"
      ),
    ]
      .filter((el) => {
        const s = getComputedStyle(el);
        if (s.visibility === "hidden") return true;
        return el.getBoundingClientRect().height > 0 && parseFloat(s.opacity) < 0.05;
      })
      .map(bezeichne);
  });

  const liste = befunde(beobachtet, await messe(page));
  if (versteckt.length) {
    liste.push(`${versteckt.length} Element(e) bleiben ohne Bewegung verborgen: ${versteckt[0]}`);
  }
  await page.close();
  return liste;
}

/**
 * WCAG 2.1 AA, soweit es sich messen lässt: Kontrast, zugängliche Namen,
 * Formularbeschriftungen, Überschriftenfolge.
 *
 * Mit abgeschalteter Bewegung, sonst stehen die Reveals noch auf Deckkraft 0
 * und jeder Text darin fiele als unsichtbar durch.
 */
async function pruefeBarrierefreiheit(browser, pfad, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE + pfad, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));
  await scrolleDurch(page);

  const ergebnis = await page.evaluate(wcagMessen);
  await page.close();
  return { liste: wcagBefunde(ergebnis), ergebnis };
}

const browser = await starteBrowser();
const SEITEN = await findeSeiten(browser);
console.log(`Gefundene Seiten: ${SEITEN.join(" · ")}`);

let probleme = 0;

for (const [i, vp] of VIEWPORTS.entries()) {
  const seiten = i === 0 ? SEITEN : SEITEN.slice(0, VOLL);
  console.log(`\n── ${vp.name} (${vp.width}×${vp.height}) ──`);
  if (i === 1) console.log(`  (nur die ersten ${VOLL} Seiten — die übrigen teilen sich deren Route)`);
  for (const pfad of seiten) {
    probleme += melde(pfad, await pruefeSeite(browser, BASE + pfad, vp));
  }
}

console.log(`\n── Ohne Bewegung (prefers-reduced-motion) ──`);
for (const pfad of SEITEN) {
  probleme += melde(pfad, await pruefeOhneBewegung(browser, pfad, VIEWPORTS[0]));
}

/* Startseite, eine Leistungsseite, die Karriereseite — und die beiden
   Design-Seiten. Auf den Design-Seiten steht jeder Baustein beisammen, ein
   Kontrastfehler in irgendeiner Komponente fällt dort also auf, auch wenn
   die Seite, die sie einsetzt, gerade nicht im Durchlauf ist. Die
   Karriereseite steht dabei, weil sie als einzige Seite eine aufklappbare
   Stellenliste und die Zahlenleiste trägt. */
console.log(`\n── Barrierefreiheit (WCAG 2.1 AA) ──`);
let unpruefbar = 0;
const BARRIERE = [
  ...SEITEN.slice(0, VOLL),
  ...SEITEN.filter((p) => p === "/karriere" || p.startsWith("/design/")),
];
for (const pfad of BARRIERE) {
  const { liste, ergebnis } = await pruefeBarrierefreiheit(browser, pfad, VIEWPORTS[0]);
  unpruefbar += ergebnis.unpruefbar.length;
  probleme += melde(pfad, liste);
}
if (unpruefbar) {
  console.log(`  (${unpruefbar} Textstellen liegen auf Bildern oder Verläufen — Kontrast dort nicht rechenbar)`);
}

// Der Wechsel einmal auf Desktop — er hängt nicht am Breakpoint, und drei
// Durchläufe kosten nur Zeit.
const ziel = SEITEN.find((p) => p !== "/");
if (ziel) {
  console.log(`\n── Seitenwechsel (Router) ──`);
  probleme += melde(`/ → ${ziel}`, await pruefeWechsel(browser, ziel, VIEWPORTS[0]));
}

await browser.close();
console.log(probleme ? `\n${probleme} Befund(e).` : "\nAlles sauber.");
process.exit(probleme ? 1 : 0);
