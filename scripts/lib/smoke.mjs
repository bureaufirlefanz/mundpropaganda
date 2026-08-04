/**
 * Der eigentliche Rauchtest, unabhängig davon, welcher Stand geprüft wird.
 * Prototyp und Astro-App reichen nur ihre Adressen herein — die Befunde und
 * ihre Schwellen sind für beide dieselben, sonst driften die Prüfungen
 * auseinander und ein Fehler gilt hier als Fund und dort nicht.
 */

export const VIEWPORTS = [
  { name: "Desktop", width: 1440, height: 900 },
  { name: "Tablet", width: 834, height: 1112 },
  { name: "Mobil", width: 390, height: 844 },
];

/* Meldungen, die nichts über die Seite sagen: Vite und der Astro-Router
   schreiben im Dev-Modus ins Log, ohne dass etwas kaputt ist. */
const RAUSCHEN = [
  /\[vite\]/i,
  /Download the React DevTools/i,
  /favicon/i,
];

const istRauschen = (text) => RAUSCHEN.some((r) => r.test(text));

/**
 * Sammelt Konsolenfehler und fehlgeschlagene Requests einer Seite.
 * Muss vor dem ersten goto angehängt werden, sonst entgehen uns die
 * Fehler des ersten Ladevorgangs.
 */
export function beobachte(page) {
  const fehler = [];
  const requests = [];

  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (!istRauschen(text)) fehler.push(text);
  });
  page.on("pageerror", (e) => fehler.push(e.message));
  page.on("requestfailed", (r) => {
    // Abgebrochene Requests sind kein Fund: der Router bricht Prefetches ab,
    // wenn er die Seite doch schon hat.
    if (r.failure()?.errorText === "net::ERR_ABORTED") return;
    if (!istRauschen(r.url())) requests.push(r.url());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !istRauschen(r.url())) {
      requests.push(`${r.status()} ${r.url()}`);
    }
  });

  return { fehler, requests };
}

/** Einmal durch die Seite scrollen, damit jeder ScrollTrigger auslöst. */
export async function scrolleDurch(page) {
  await page.evaluate(async () => {
    const schritt = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += schritt) {
      window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
}

/**
 * Was sich erst im gerenderten Dokument zeigt. Läuft im Seitenkontext,
 * gibt reine Daten zurück.
 */
export function messe(page) {
  return page.evaluate(() => {
    const bezeichne = (el) =>
      el.className && typeof el.className === "string"
        ? `${el.tagName.toLowerCase()}.${el.className.trim().split(/\s+/).join(".")}`
        : el.tagName.toLowerCase();

    // Reveals, die nach dem Durchscrollen unsichtbar geblieben sind: das
    // Element ist im Layout, aber durchsichtig — meist ein Modul, das nach
    // einem Seitenwechsel nicht wieder angelaufen ist.
    const toteReveals = [...document.querySelectorAll("[data-reveal], [data-split], [data-reveal-child]")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.height) return false;
        return parseFloat(getComputedStyle(el).opacity) < 0.05;
      })
      .map(bezeichne);

    // Der breiteste Übeltäter beim horizontalen Überlauf. Die reine
    // Pixelzahl sagt nicht, wo man suchen muss.
    const grenze = document.documentElement.clientWidth;
    const ueberlaeufer = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > grenze + 1 && getComputedStyle(el).position !== "fixed";
      })
      .map((el) => ({ el: bezeichne(el), rechts: Math.round(el.getBoundingClientRect().right) }))
      .sort((a, b) => b.rechts - a.rechts)
      .slice(0, 3);

    return {
      toteReveals,
      ueberlaufX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ueberlaeufer,
      kaputteBilder: [...document.querySelectorAll("img")]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
      // Leere Bildquellen fallen sonst durch: das Bild lädt nie, gilt damit
      // nicht als „complete" und bleibt unbemerkt.
      leereBilder: [...document.querySelectorAll("img")].filter((i) => !i.getAttribute("src")).length,
    };
  });
}

/** Aus Beobachtung und Messung eine Liste lesbarer Befunde bauen. */
export function befunde({ fehler, requests }, report) {
  const liste = [];
  if (fehler.length) liste.push(`${fehler.length} Konsolenfehler: ${fehler[0]}`);
  if (requests.length) liste.push(`${requests.length} fehlgeschlagene Requests: ${requests[0]}`);
  if (report.toteReveals.length)
    liste.push(`${report.toteReveals.length} unsichtbare Reveals: ${report.toteReveals[0]}`);
  if (report.ueberlaufX > 1) {
    const wer = report.ueberlaeufer.map((u) => `${u.el} bis ${u.rechts}px`).join(", ");
    liste.push(`horizontaler Überlauf: ${report.ueberlaufX}px${wer ? ` — ${wer}` : ""}`);
  }
  if (report.kaputteBilder.length)
    liste.push(`${report.kaputteBilder.length} kaputte Bilder: ${report.kaputteBilder[0]}`);
  if (report.leereBilder) liste.push(`${report.leereBilder} Bilder ohne src`);
  return liste;
}

/** Eine Seite in einem Viewport vollständig prüfen. */
export async function pruefeSeite(browser, url, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  const beobachtet = beobachte(page);

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await scrolleDurch(page);

  const liste = befunde(beobachtet, await messe(page));
  await page.close();
  return liste;
}

/** Ausgabe und Rückgabe der Gesamtzahl — für beide Prüfskripte gleich. */
export function melde(pfad, liste) {
  if (liste.length) {
    console.log(`  ✗ ${pfad}`);
    liste.forEach((i) => console.log(`      ${i}`));
  } else {
    console.log(`  ✓ ${pfad}`);
  }
  return liste.length;
}
