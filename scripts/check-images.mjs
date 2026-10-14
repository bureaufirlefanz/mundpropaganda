/**
 * Jede Bildadresse im gebauten HTML muss auf eine Datei zeigen.
 *
 * Der Fall, der das nötig gemacht hat: `Picture` bekam die Breiten als Text
 * mitgegeben, die Pipeline deckelt sie aber auf die Breite der Quelle.
 * `treatment-02` ist 1920px breit, das Markup forderte 2200 an. Auf breiten
 * Schirmen wählte der Browser genau diese Kandidatin, bekam 404 und zeigte
 * nichts — auf der Veneers-Seite die erste Bild-Text-Zeile. Kein Test schlug
 * an: Die Seite war gültig, das Bild fehlte nur.
 *
 * Der zweite Fall, und der schwerere: Von 660 Dateien unter `web/public/img`
 * waren 128 versioniert. Auf dem Rechner lagen alle, im Repository nicht — und
 * Netlify baut aus `main`. Der Build hier wäre grün gewesen und die
 * ausgelieferte Seite hätte 43 Bilder nicht gehabt, darunter die ersten
 * Bilder von `/praxis` und `/veneers-berlin`.
 *
 * **Deshalb steht diese Prüfung in einer eigenen Datei.** Sie braucht keinen
 * Browser und keinen laufenden Server, nur `web/dist` — und läuft damit in
 * der CI, wo `scripts/check-web.mjs` nicht laufen kann (Chrome unter festem
 * macOS-Pfad). Genau der Fall oben wäre dort aufgefallen: Der Runner klont
 * das Repository, und was nicht eingecheckt ist, gibt es dort nicht.
 *
 * Gelesen wird aus `dist/`, nicht über das Netz. Ein srcset hat bis zu fünf
 * Kandidatinnen, von denen der Browser genau eine holt — über HTTP fiele
 * immer nur die auf, die dieses Fenster gerade wählt.
 *
 * Aufruf:  node scripts/check-images.mjs
 * Oder aus `check-web.mjs` heraus als Funktion.
 */
import { readFile, readdir, access } from "node:fs/promises";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = "web/dist";

async function allHtml(dir) {
  const raus = [];
  for (const eintrag of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, eintrag.name);
    if (eintrag.isDirectory()) raus.push(...(await allHtml(path)));
    else if (eintrag.name.endsWith(".html")) raus.push(path);
  }
  return raus;
}

/** Zahl der fehlenden Dateien. 0 heißt sauber. */
export async function checkImages() {
  let dateien;
  try {
    dateien = await allHtml(ROOT);
  } catch {
    console.log("  (kein web/dist — übersprungen)");
    return 0;
  }

  /* Adresse -> Seiten, auf denen sie steht. So nennt die Meldung nicht nur
     die fehlende Datei, sondern auch, wo man sie sieht. */
  const referenzen = new Map();
  for (const file of dateien) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
      for (const teil of match[1].split(",")) {
        const url = teil.trim().split(/\s+/)[0];
        if (!url.startsWith("/") || url.startsWith("//")) continue;
        if (!/\.(avif|webp|png|jpe?g|gif|svg)$/i.test(url)) continue;
        if (!referenzen.has(url)) referenzen.set(url, new Set());
        referenzen
          .get(url)
          .add("/" + relative(ROOT, file).replace(/index\.html$/, ""));
      }
    }
  }

  const missing = [];
  for (const url of referenzen.keys()) {
    try {
      await access(join(ROOT, decodeURIComponent(url)));
    } catch {
      missing.push(url);
    }
  }

  if (!missing.length) {
    console.log(
      `  ✓ ${referenzen.size} Bildadressen zeigen auf vorhandene Dateien`,
    );
    return 0;
  }
  for (const url of missing.sort()) {
    const wo = [...referenzen.get(url)].sort();
    console.log(`  ✗ ${url}`);
    console.log(
      `      steht auf: ${wo.slice(0, 3).join(", ")}${wo.length > 3 ? ` und ${wo.length - 3} weiteren` : ""}`,
    );
  }
  return missing.length;
}

/**
 * Jedes Motiv unter `web/public/img` muss eine bekannte Herkunft haben.
 *
 * Der Fall: Der Fotograf (Franz Grünewald) hat am 2026-10-03 eine finale
 * Auswahl von 40 Bildern freigegeben. Alles andere aus seinem Shooting darf
 * nicht auf die Seite, auch nicht die 17 „Add Ons" der ersten Lieferung, aus
 * denen bis dahin die halbe Galerie bestand. Welches Foto wo herkommt, sah
 * man den Dateien nicht an: Sie hießen `blumen` oder `holzbank`, nicht
 * `260829_mundpropaganda_1075`.
 *
 * `web/src/lib/image-sources.json` hält deshalb für jedes Motiv fest, woher
 * es stammt: `franz` mit der Originaldatei, die in der freigegebenen Liste
 * stehen muss, oder `design` für Figma- und KI-Motive. Ein Motiv ohne
 * Eintrag ist ein Befund, ein Fotografenbild außerhalb der Freigabe auch.
 */
export async function checkImageSources() {
  const manifest = JSON.parse(
    await readFile("web/src/lib/image-sources.json", "utf8"),
  );
  const allowed = new Set(manifest.allowedPhotographerFiles);
  const motifs = new Set();
  for (const file of await readdir("web/public/img")) {
    const m = file.match(/^(.+)-\d+\.(avif|webp)$/);
    if (m) motifs.add(m[1]);
  }

  const befunde = [];
  for (const motif of [...motifs].sort()) {
    const entry = manifest.motifs[motif];
    if (!entry) {
      befunde.push(`${motif}: keine Herkunft in image-sources.json`);
    } else if (entry.source === "franz" && !allowed.has(entry.file)) {
      befunde.push(
        `${motif}: ${entry.file} ist nicht in der freigegebenen Auswahl`,
      );
    }
  }
  const stale = Object.keys(manifest.motifs).filter((m) => !motifs.has(m));
  const unclear = Object.entries(manifest.motifs)
    .filter(([m, e]) => e.source === "unclear" && motifs.has(m))
    .map(([m]) => m);

  if (!befunde.length) {
    console.log(`  ✓ ${motifs.size} Motive mit bekannter Herkunft`);
  }
  for (const b of befunde) console.log(`  ✗ ${b}`);
  if (unclear.length)
    console.log(`  (Herkunft noch zu klären: ${unclear.join(", ")})`);
  if (stale.length)
    console.log(
      `  (in image-sources.json, aber nicht mehr unter public/img: ${stale.join(", ")})`,
    );
  return befunde.length;
}

/* Direkt aufgerufen: selbst melden und mit passendem Code enden.
   Als Import: nur die Funktion, der Aufrufer zählt die Befunde.

   `pathToFileURL` statt `file://${process.argv[1]}`: Der Projektpfad enthält
   ein Leerzeichen („Bureau Firlefanz"), und `import.meta.url` kodiert es als
   %20. Der naive Vergleich war damit immer falsch — das Skript lief durch und
   gab nichts aus. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("── Bilddateien ──");
  const fehlend = await checkImages();
  console.log("── Bildherkunft ──");
  const fremd = await checkImageSources();
  if (fehlend) {
    console.log(
      `\n${fehlend} Bildadresse(n) ohne Datei. Fehlt sie auch im Repository, liefert` +
        ` der nächste Deploy sie als 404 aus.`,
    );
  }
  process.exit(fehlend || fremd ? 1 : 0);
}
