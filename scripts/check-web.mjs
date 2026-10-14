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
import {
  VIEWPORTS,
  beobachte,
  scrolleDurch,
  messe,
  befunde,
  pruefeSeite,
  melde,
} from "./lib/smoke.mjs";
import { pruefeSeite as wcagMessen, wcagBefunde } from "./lib/wcag.mjs";
import { checkImages, checkImageSources } from "./check-images.mjs";

/* Standardmäßig der Dev-Server, aber umstellbar:
 *
 *     MP_BASE=http://localhost:4322 node scripts/check-web.mjs
 *
 * Der Vorschau-Server liefert den fertigen Build. Das ist näher an dem, was
 * ausgeliefert wird — und deutlich sparsamer: Der Dev-Server hält jedes Modul
 * einzeln im Speicher, samt @vite/client. Auf einer Maschine mit knappem
 * Arbeitsspeicher stürzte der Renderer während des Durchlaufs reproduzierbar
 * ab („Execution context was destroyed"), jedes Mal auf einer anderen Seite.
 * Dieselbe Konvention wie in scripts/takt.mjs. */
const BASE = process.env.MP_BASE ?? "http://localhost:4321";

/* Über alle drei Breakpoints laufen nur die ersten beiden Seiten. Die
   Leistungsseiten teilen sich eine Route und damit ihren Aufbau — jede von
   ihnen dreimal abzufahren kostet Minuten und findet nichts Neues. Der Rest
   wird auf Desktop geprüft, damit kaputte Inhalte trotzdem auffallen. */
const VOLL = 2;

await erwarteServer(BASE, "npm run web");

/** Alle intern verlinkten Seiten ab „/" sammeln, eine Ebene tief. */
async function findPages(browser) {
  const page = await browser.newPage();

  const linksVon = async (path) => {
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    return page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')]
        .map((a) => new URL(a.getAttribute("href"), location.origin).pathname)
        .filter((p) => !/\.[a-z0-9]+$/i.test(p)),
    );
  };

  /* Zwei Ebenen, nicht eine.
     Eine Ebene reichte, solange jede Art von Seite von der Startseite aus
     verlinkt war — die Leistungstabelle zeigt auf `/leistungen/<slug>`, das
     Karussell auf `/magazin/<slug>`. Die Personenseiten hängen dagegen unter
     `/praxis`, und dorthin verweist nur die Praxisseite selbst. Der Kriecher
     fand sie deshalb nie, und die Routen-Deckung meldete `person` als „ohne
     Seite", obwohl beide Seiten gebaut wurden und antworteten.

     Zwei Ebenen genügen für dieses Seitenmodell: Tiefer als
     Startseite → Übersicht → Detail geht es nirgends. */
  const ersteEbene = await linksVon("/");
  const links = [...ersteEbene];

  for (const path of new Set(ersteEbene)) {
    if (path === "/") continue;
    links.push(...(await linksVon(path)));
  }

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
async function checkTransition(browser, target, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  const beobachtet = beobachte(page);

  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await scrolleDurch(page);

  const vorher = await page.evaluate(
    () => window.__st?.getAll?.().length ?? null,
  );

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
            (el) => parseFloat(getComputedStyle(el).opacity) > 0.05,
          ),
          splits: sichtbar(
            "[data-split], [data-hero-word]",
            (el) => getComputedStyle(el).visibility !== "hidden",
          ),
        };
      },
      { once: true },
    );
  });

  const gewechselt = await page.evaluate(async (target) => {
    const link = [...document.querySelectorAll("a[href]")].find(
      (a) => new URL(a.href).pathname === target,
    );
    if (!link) return false;
    link.click();
    // Auf das Router-Ereignis warten, nicht auf eine Frist — sonst messen
    // wir mitten im Austausch.
    await new Promise((r) => {
      document.addEventListener("astro:page-load", r, { once: true });
      setTimeout(r, 8000);
    });
    return location.pathname === target;
  }, target);

  const list = [];
  if (!gewechselt) {
    list.push(`Router-Wechsel nach ${target} hat nicht stattgefunden`);
  } else {
    const nachTausch = await page.evaluate(() => window.__nachTausch ?? null);
    if (nachTausch && !nachTausch.htmlKlassen.split(/\s+/).includes("js")) {
      list.push(
        `die Klasse „js" fehlt nach dem Austausch — keine Startregel greift`,
      );
    }
    if (nachTausch?.reveals) {
      list.push(
        `${nachTausch.reveals} Reveals stehen direkt nach dem Austausch schon sichtbar da`,
      );
    }
    if (nachTausch?.splits) {
      list.push(
        `${nachTausch.splits} Headlines stehen direkt nach dem Austausch schon sichtbar da`,
      );
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await scrolleDurch(page);
    list.push(...befunde(beobachtet, await messe(page)));

    const nachher = await page.evaluate(
      () => window.__st?.getAll?.().length ?? null,
    );
    // Die Trigger der alten Seite müssen weg sein. Grob doppelt so viele wie
    // vorher heißt: sie wurden nicht aufgeräumt und messen gegen Elemente,
    // die es nicht mehr gibt.
    if (vorher && nachher && nachher > vorher * 1.8) {
      list.push(
        `ScrollTrigger stapeln sich: ${vorher} vor dem Wechsel, ${nachher} danach`,
      );
    }
  }

  await page.close();
  return list;
}

/**
 * Gegenprobe zu den Startregeln: was bis zu seiner Animation verborgen wird
 * (`html.js …`), muss ohne Bewegung sofort sichtbar sein. Sonst bleibt für
 * jeden mit „Bewegung reduzieren" die halbe Seite leer — ein Fehler, den man
 * selbst nie sieht, solange die Einstellung aus ist.
 */
async function pruefeOhneBewegung(browser, path, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  const beobachtet = beobachte(page);

  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
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
          " [data-hero-foot], [data-hero-scroll], [data-hero-tooth], [data-nav] .c-nav__inner",
      ),
    ]
      .filter((el) => {
        const s = getComputedStyle(el);
        if (s.visibility === "hidden") return true;
        return (
          el.getBoundingClientRect().height > 0 && parseFloat(s.opacity) < 0.05
        );
      })
      .map(bezeichne);
  });

  const list = befunde(beobachtet, await messe(page));
  if (versteckt.length) {
    list.push(
      `${versteckt.length} Element(e) bleiben ohne Bewegung verborgen: ${versteckt[0]}`,
    );
  }
  await page.close();
  return list;
}

/**
 * WCAG 2.2 AA, soweit es sich messen lässt: Kontrast, zugängliche Namen,
 * Formularbeschriftungen, Überschriftenfolge.
 *
 * Mit abgeschalteter Bewegung, sonst stehen die Reveals noch auf Deckkraft 0
 * und jeder Text darin fiele als unsichtbar durch.
 */
async function pruefeBarrierefreiheit(browser, path, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));
  await scrolleDurch(page);

  const result = await page.evaluate(wcagMessen);
  await page.close();
  return { list: wcagBefunde(result), result };
}

/**
 * Für jeden Dokumenttyp, der laut Studio eine eigene Seite hat, muss es sie
 * auch geben.
 *
 * Das ist der Fall, der einem Kunden am schnellsten das Vertrauen kostet: Er
 * pflegt „Praxis & Team", drückt Publish — und findet nirgends etwas. Das
 * Studio hat ihm eine Seite versprochen, die die Website nicht hat.
 *
 * Gelesen wird aus `studio/lib/paths.ts`, der einzigen Stelle, an der URLs
 * entstehen. Eine zweite Liste hier würde genau den Zweck verfehlen.
 */
async function checkRouteCoverage(browser, gefundeneSeiten) {
  const { FIXED_PATHS, DIRECTORIES, TOP_LEVEL } = await loadPathModel();
  const ausgeblendet = await loadHiddenTypes();

  /* Ein Typ, den das Studio gar nicht anbietet, kann auch niemanden
     enttäuschen. Geprüft wird, was der Kunde sieht — nicht, was das
     Pfadmodell für später vorsieht. */
  const zeigtStudio = (typ) => !ausgeblendet.includes(typ);

  const seite = await browser.newPage();
  const missing = [];
  let checked = 0;

  /* Einzeldokumente: ihr fester Pfad muss antworten. */
  for (const [typ, path] of Object.entries(FIXED_PATHS)) {
    if (!zeigtStudio(typ)) continue;
    checked++;
    const response = await seite.goto(BASE + path, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (!response || response.status() >= 400)
      missing.push({ typ, path, status: response?.status() ?? 0 });
  }
  await seite.close();

  /* Typen mit Slug: Es genügt, dass ES Seiten in ihrem Verzeichnis gibt —
     `/leistungen/veneers` beweist die Route, auch wenn `/leistungen` selbst
     keine Übersicht hat. Die Übersicht ist ein eigener Typ
     (`leistungenIndex`) und wird oben geprüft. Deshalb hier gegen die
     gecrawlte Liste statt gegen das nackte Verzeichnis: sonst meldete die
     Prüfung `leistung` als missing, obwohl es elf Seiten hat. */
  for (const [typ, dir] of Object.entries(DIRECTORIES)) {
    if (!zeigtStudio(typ)) continue;
    checked++;
    if (!gefundeneSeiten.some((p) => p.startsWith(`/${dir}/`))) {
      missing.push({ typ, path: `/${dir}/<slug>`, status: 0 });
    }
  }

  /* Die Typen der obersten Ebene haben keinen festen Pfad, den man aufrufen
     könnte — sie leben unter freien Slugs. Geprüft wird deshalb, ob es die
     Route überhaupt gibt: eine Datei, die `/[slug]` bedient. */
  const { existsSync } = await import("node:fs");
  for (const typ of TOP_LEVEL) {
    if (!zeigtStudio(typ)) continue;
    checked++;
    if (!existsSync("web/src/pages/[slug].astro")) {
      missing.push({ typ, path: "/<slug>", status: 0 });
    }
  }

  if (!missing.length) {
    console.log(`  ✓ ${checked} Dokumenttypen haben eine Seite`);
    return 0;
  }

  console.log(`  ✗ ${missing.length} Dokumenttyp(en) ohne Seite`);
  for (const { typ, path, status } of missing) {
    console.log(
      `      ${typ.padEnd(16)} ${path.padEnd(14)} ${status || "keine Route"}`,
    );
  }
  console.log(
    `      Entweder die Seite bauen oder den Typ aus studio/structure/index.ts nehmen.`,
  );
  return missing.length;
}

/**
 * `paths.ts` ist TypeScript und exportiert die drei Tabellen nicht. Statt
 * eine zweite Wahrheit anzulegen, werden sie hier aus der Quelle gelesen.
 * Bricht das Einlesen, ist das ein Befund und keine stille Null.
 */
/** Die Typen, die das Studio bewusst nicht anbietet (structure/index.ts). */
async function loadHiddenTypes() {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile("studio/structure/index.ts", "utf8");
  const match = source.match(/UNROUTED\s*=\s*\[([\s\S]*?)\]/);
  if (!match) throw new Error("In studio/structure/index.ts fehlt UNROUTED.");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

async function loadPathModel(datei = "studio/lib/paths.ts") {
  const { readFile } = await import("node:fs/promises");
  /* Kommentare weg, bevor gesucht wird.

     `paare()` unten liest mit einem Regex über den Rohtext. Eine
     auskommentierte Zeile wie `person: "praxis",` sieht darin genauso aus wie
     ein echter Eintrag — und wurde als solcher gezählt. Gemessen: Die
     Routen-Deckung meldete einen Typ als „ohne Seite", dessen Eintrag längst
     im Kommentar stand und der gar keine Seite mehr haben sollte. */
  const source = (await readFile(datei, "utf8"))
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  /* `as const satisfies …` darf hinter der Klammer stehen: Die Fassung unter
     `web/` braucht es, damit der Typ `Target` aus den Schlüsseln entsteht. */
  const block = (name) => {
    const match = source.match(
      new RegExp(
        `${name}[^=]*=\\s*([\\[{][\\s\\S]*?[\\]}])(?:\\s+as\\s+const)?(?:\\s+satisfies[^;]*)?\\s*;`,
      ),
    );
    if (!match)
      throw new Error(
        `In ${datei} fehlt ${name} — Routen-Deckung nicht prüfbar.`,
      );
    return match[1];
  };

  const paare = (roh) =>
    Object.fromEntries(
      [...roh.matchAll(/(\w+)\s*:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]),
    );

  return {
    FIXED_PATHS: paare(block("FIXED_PATHS")),
    DIRECTORIES: paare(block("DIRECTORIES")),
    TOP_LEVEL: [...block("TOP_LEVEL").matchAll(/"([^"]+)"/g)].map((m) => m[1]),
  };
}

/**
 * Die beiden Hälften des Pfadmodells müssen dasselbe sagen.
 *
 * `studio/lib/paths.ts` baut die Adresse eines Dokuments, `web/src/lib/paths.ts`
 * baut sie ebenso und liest sie zusätzlich zurück (`targetFor`, die Vorschau).
 * Sie können nicht importiert werden — das Studio ist ein eigenes Paket, und
 * ein Import über die Ordnergrenze wäre der Rückschritt hinter Stufe A.
 * Verglichen werden können sie schon.
 *
 * Der Fall, der das nötig gemacht hat: Nach der Sprachmigration prüfte
 * `targetFor` weiter auf `careers`, `magazine` und `services`, während die
 * Website `/karriere`, `/magazin` und `/leistungen` auslieferte. Aus dem
 * Studio ließ sich damit keine Seite in der Vorschau öffnen außer der
 * Startseite. Beide Hälften sahen für sich stimmig aus; nur nebeneinander
 * fiel es auf.
 *
 * Verglichen wird gegen das Studio OHNE die ausgeblendeten Typen: `pillar`,
 * `servicesIndex` und `contactPage` haben im Studio einen Pfad
 * für später, aber keine Seite — die Website kennt sie deshalb zu Recht nicht.
 */
async function checkPathModel() {
  const studio = await loadPathModel("studio/lib/paths.ts");
  const web = await loadPathModel("web/src/lib/paths.ts");
  const ausgeblendet = await loadHiddenTypes();

  const ohneVersteckte = (tabelle) =>
    Object.fromEntries(
      Object.entries(tabelle).filter(([typ]) => !ausgeblendet.includes(typ)),
    );

  const befunde = [];
  const vergleiche = (name, a, b) => {
    const typen = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const typ of [...typen].sort()) {
      if (a[typ] === b[typ]) continue;
      befunde.push(
        `${name}: ${typ} — Studio ${a[typ] ? `„${a[typ]}"` : "fehlt"}, Website ${b[typ] ? `„${b[typ]}"` : "fehlt"}`,
      );
    }
  };

  vergleiche(
    "FIXED_PATHS",
    ohneVersteckte(studio.FIXED_PATHS),
    web.FIXED_PATHS,
  );
  vergleiche(
    "DIRECTORIES",
    ohneVersteckte(studio.DIRECTORIES),
    web.DIRECTORIES,
  );

  const studioTop = studio.TOP_LEVEL.filter(
    (typ) => !ausgeblendet.includes(typ),
  );
  for (const typ of new Set([...studioTop, ...web.TOP_LEVEL])) {
    if (studioTop.includes(typ) === web.TOP_LEVEL.includes(typ)) continue;
    befunde.push(
      `TOP_LEVEL: ${typ} — nur ${studioTop.includes(typ) ? "im Studio" : "auf der Website"}`,
    );
  }

  const geprueft =
    Object.keys(web.FIXED_PATHS).length +
    Object.keys(web.DIRECTORIES).length +
    web.TOP_LEVEL.length;

  if (!befunde.length) {
    console.log(
      `  ✓ ${geprueft} Einträge stimmen zwischen Studio und Website überein`,
    );
    return 0;
  }

  console.log(`  ✗ ${befunde.length} Abweichung(en) im Pfadmodell`);
  for (const b of befunde) console.log(`      ${b}`);
  console.log(
    `      Beide Hälften: studio/lib/paths.ts und web/src/lib/paths.ts.`,
  );
  return befunde.length;
}

/**
 * Jeder Sprung auf `#etwas` muss auf derselben Seite ein `id="etwas"` finden.
 *
 * Der Fall, der das nötig gemacht hat: Bei der Umstellung auf englische
 * Bezeichner wurde aus `id="leistungen"` ein `id="services"` und aus
 * `id="standorte"` ein `id="locations"`. Die Links dorthin kommen aber aus
 * dem CMS und tragen den Anker als Text — dort stand weiterhin `leistungen`.
 * Ergebnis: Man klickt im Menü auf „Leistungen" und es passiert nichts. Kein
 * Fehler, keine Meldung, keine 404. Die Seite springt nur nicht.
 *
 * Anker sind Teil der Adresse und gehören damit zum Publikum, nicht zum Code:
 * `#standorte`, nicht `#locations`. Dieselbe Regel wie für die Pfade.
 */
/**
 * Die Farbtafel im Styleguide gegen `tokens.css`.
 *
 * `pages/design/styleguide.astro` hält die acht Grundfarben als ausgeschriebene
 * Hexwerte — nötig, weil die Seite Kanäle und Kontraste ausrechnet und Node
 * dafür keine `var()` und kein `color-mix()` auswerten kann. Der Kommentar
 * dort behauptete, das sei „über den Prüflauf abgesichert". War es nicht: Kein
 * Skript hat die beiden Listen je verglichen.
 *
 * Damit war der Styleguide die einzige Stelle, an der die Seite über sich
 * selbst falsche Auskunft geben konnte, ohne dass irgendetwas anschlägt — wer
 * einen Farbton in `tokens.css` ändert, ändert das ganze Erscheinungsbild, und
 * die Tafel, die ihn dokumentiert, zeigte weiter den alten. Genau die Sorte
 * lautloser Abweichung, gegen die es die anderen Prüfungen hier gibt.
 */
async function checkStyleguideColours() {
  const { readFile } = await import("node:fs/promises");

  const tokens = await readFile("web/src/styles/tokens.css", "utf8");
  const guide = await readFile("web/src/pages/design/styleguide.astro", "utf8");

  const block = guide.match(/const HEX = \{([^}]*)\}/s);
  if (!block) {
    console.log(
      "  ✗ Farbtafel im Styleguide nicht gefunden — Aufbau geändert?",
    );
    return 1;
  }

  const gefunden = [
    ...block[1].matchAll(/"?([a-z0-9-]+)"?:\s*"(#[0-9a-fA-F]{6})"/g),
  ];
  let schief = 0;

  for (const [, name, hex] of gefunden) {
    const token = tokens.match(new RegExp(`--c-${name}:\\s*(#[0-9a-fA-F]{6})`));
    if (!token) {
      console.log(
        `  ✗ --c-${name} steht im Styleguide, aber nicht in tokens.css`,
      );
      schief++;
    } else if (token[1].toLowerCase() !== hex.toLowerCase()) {
      console.log(
        `  ✗ --c-${name}: tokens.css sagt ${token[1]}, der Styleguide zeigt ${hex}`,
      );
      schief++;
    }
  }

  if (!schief)
    console.log(
      `  ✓ ${gefunden.length} Farben im Styleguide stimmen mit tokens.css überein`,
    );
  return schief;
}

async function checkAnchors() {
  const { readFile, readdir } = await import("node:fs/promises");
  const { join, relative } = await import("node:path");

  async function allHtml(dir) {
    const raus = [];
    for (const eintrag of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, eintrag.name);
      if (eintrag.isDirectory()) raus.push(...(await allHtml(path)));
      else if (eintrag.name.endsWith(".html")) raus.push(path);
    }
    return raus;
  }

  const wurzel = "web/dist";
  let dateien;
  try {
    dateien = await allHtml(wurzel);
  } catch {
    console.log("  (kein web/dist — übersprungen)");
    return 0;
  }

  const missing = [];
  let checked = 0;

  for (const file of dateien) {
    const html = await readFile(file, "utf8");
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    const seite = "/" + relative(wurzel, file).replace(/index\.html$/, "");

    /* Nur echte Links. `<use href="#i-arrow">` verweist auf ein SVG-Symbol
       im Sprite und hat mit Sprungmarken nichts zu tun. */
    for (const match of html.matchAll(/<a\s[^>]*href="#([^"]+)"/g)) {
      const anker = decodeURIComponent(match[1]);
      if (anker === "" || anker === "top") continue;
      checked++;
      if (!ids.has(anker)) missing.push({ seite, anker });
    }
  }

  if (!missing.length) {
    console.log(`  ✓ ${checked} Sprünge finden ihr Ziel`);
    return 0;
  }

  /* Nach Anker gebündelt: Ein fehlendes `id` auf 20 Seiten ist EIN Fehler,
     nicht zwanzig. */
  const je = new Map();
  for (const f of missing) {
    if (!je.has(f.anker)) je.set(f.anker, []);
    je.get(f.anker).push(f.seite);
  }
  for (const [anker, pages] of je) {
    console.log(`  ✗ #${anker} — kein Element mit dieser id`);
    console.log(
      `      verlinkt auf: ${pages.slice(0, 3).join(", ")}${pages.length > 3 ? ` und ${pages.length - 3} weiteren` : ""}`,
    );
  }
  return je.size;
}

const browser = await starteBrowser();
const PAGES = await findPages(browser);
console.log(`Gefundene Seiten: ${PAGES.join(" · ")}`);

let problems = 0;

for (const [i, vp] of VIEWPORTS.entries()) {
  const pages = i === 0 ? PAGES : PAGES.slice(0, VOLL);
  console.log(`\n── ${vp.name} (${vp.width}×${vp.height}) ──`);
  if (i === 1)
    console.log(
      `  (nur die ersten ${VOLL} Seiten — die übrigen teilen sich deren Route)`,
    );
  for (const path of pages) {
    problems += melde(path, await pruefeSeite(browser, BASE + path, vp));
  }
}

console.log(`\n── Ohne Bewegung (prefers-reduced-motion) ──`);
for (const path of PAGES) {
  problems += melde(
    path,
    await pruefeOhneBewegung(browser, path, VIEWPORTS[0]),
  );
}

/* JEDE Seite, nicht mehr eine Auswahl.

   Hier standen fünf: Startseite, eine Leistungsseite, Karriere und die beiden
   Design-Seiten. Die Begründung war, dass auf den Design-Seiten jeder Baustein
   beisammensteht — ein Kontrastfehler in irgendeiner Komponente fällt dort
   also auf.

   Das stimmt für die Kontraste und für alles andere, was an einer Komponente
   hängt. Es stimmt NICHT für die Kriterien, die an der Seite hängen: der
   Sprung zum Inhalt, genau eine h1, die Überschriftenfolge über die ganze
   Seite, die Zielgrößen im tatsächlichen Layout, `autocomplete` an den
   Feldern, die auf DIESER Seite stehen. Ein Katalog beweist davon nichts.

   Gemessen war der Unterschied nicht theoretisch: Von 29 Seiten liefen 5
   durch die Prüfung, und die beiden Design-Seiten fielen als Einzige mit
   fehlendem Sprung zum Inhalt auf — ausgerechnet die zwei, die ein anderes
   Layout benutzen. Bei fünf von 29 ist so etwas Zufall, nicht Deckung.

   Der Preis ist Laufzeit. Der Durchgang ist der gründliche, nicht der
   schnelle: `scripts/check.mjs` ist der Rauchtest für zwischendurch. */
console.log(`\n── Barrierefreiheit (WCAG 2.2 AA) ──`);
let unpruefbar = 0;
const BARRIERE = PAGES;
for (const path of BARRIERE) {
  const { list, result } = await pruefeBarrierefreiheit(
    browser,
    path,
    VIEWPORTS[0],
  );
  unpruefbar += result.unpruefbar.length;
  problems += melde(path, list);
}
if (unpruefbar) {
  console.log(
    `  (${unpruefbar} Textstellen liegen auf Bildern oder Verläufen — Kontrast dort nicht rechenbar)`,
  );
}

// Der Wechsel einmal auf Desktop — er hängt nicht am Breakpoint, und drei
// Durchläufe kosten nur Zeit.
const target = PAGES.find((p) => p !== "/");
if (target) {
  console.log(`\n── Seitenwechsel (Router) ──`);
  problems += melde(
    `/ → ${target}`,
    await checkTransition(browser, target, VIEWPORTS[0]),
  );
}

console.log(`\n── Pfadmodell ──`);
problems += await checkPathModel();

console.log(`\n── Routen-Deckung ──`);
problems += await checkRouteCoverage(browser, PAGES);

console.log(`\n── Bilddateien ──`);
problems += await checkImages();

console.log("\n── Bildherkunft ──");
problems += await checkImageSources();

console.log(`\n── Sprungmarken ──`);
problems += await checkAnchors();

console.log(`\n── Farbtafel im Styleguide ──`);
problems += await checkStyleguideColours();

await browser.close();
console.log(problems ? `\n${problems} Befund(e).` : "\nAlles sauber.");
process.exit(problems ? 1 : 0);
