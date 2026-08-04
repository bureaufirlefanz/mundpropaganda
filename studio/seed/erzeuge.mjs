/**
 * Erzeugt die Seed-Datei aus den Fallback-Daten der Website.
 *
 * Aufruf:  node studio/seed/erzeuge.mjs > studio/seed/inhalte.ndjson
 *
 * Warum erzeugt statt von Hand geschrieben: Die Beispieldaten in
 * web/src/lib sind die Wahrheit darüber, was die Seite heute zeigt. Ein
 * getippter Seed wäre am Tag seiner Entstehung korrekt und danach nie wieder.
 *
 * Die Leistungen bekommen eine feste ID `leistung-<slug>`. Sanity vergibt
 * sonst zufällige, und das hätte zwei Folgen, die beide schlecht sind:
 *
 *   1. Das bereits gepflegte Dokument `leistung-veneers` bekäme einen
 *      Zwilling, statt erkannt zu werden.
 *   2. Ein zweiter Import legte alles ein zweites Mal an.
 *
 * Mit fester ID und `--missing` beim Import ist der Vorgang wiederholbar:
 * Was da ist, bleibt unangetastet; was fehlt, entsteht.
 */
import { readFileSync } from "node:fs";

/* Die Listen liegen als TypeScript vor. Statt sie zu übersetzen, lesen wir
   die Werte aus dem Quelltext — das hält dieses Skript ohne Buildschritt
   lauffähig und bricht laut, wenn sich die Form ändert. */
const liste = readFileSync("web/src/lib/leistungsliste.ts", "utf8");
const eintraege = [...liste.matchAll(/\{ slug: "([^"]+)", name: "([^"]+)"(?:, titel: "([^"]+)")?, platzierung: "([^"]+)"(?:, gruppe: "([^"]+)")?(?:, tag: "([^"]+)")?/g)];

if (!eintraege.length) {
  console.error("Keine Leistungen gefunden - hat sich die Form von beispielListe geändert?");
  process.exit(1);
}

const zeilen = [];

eintraege.forEach(([, slug, name, titel, platzierung, gruppe, tag], i) => {
  zeilen.push({
    _id: `leistung-${slug}`,
    _type: "leistung",
    titel: titel || name,
    kurzname: titel ? name : undefined,
    slug: { _type: "slug", current: slug },
    topline: `${name} in Berlin`,
    platzierung,
    gruppe,
    tag,
    /* Die Reihenfolge der Liste ist die Relevanzordnung. orderRank hält sie
       im Studio, wo sie sich ziehen lässt. */
    orderRank: String(i).padStart(4, "0"),
  });
});

/* Die Startseite als Einzeldokument mit fester ID. Bewusst LEER bis auf die
   Kennung: Jedes Feld, das hier stünde, wäre eine Kopie des Textes in den
   Bausteinen — und die zweite Kopie ist die, die veraltet. Der Kunde füllt
   im Studio nur, was er ändern will. */
zeilen.push({ _id: "startseite", _type: "startseite" });

for (const z of zeilen) {
  console.log(JSON.stringify(z, (k, v) => (v === undefined ? undefined : v)));
}
