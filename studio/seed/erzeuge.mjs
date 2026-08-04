/**
 * Der einmalige Umzug der Inhalte aus dem Code ins CMS — Aufgabe 4.
 *
 * ── ERLEDIGT. Dieses Skript läuft nicht mehr. ────────────────────────────
 *
 * Es hat die Vorgabewerte aus den Frontmatter-Blöcken der Bausteine gelesen
 * und daraus `leistungen.ndjson` und `seiten.ndjson` erzeugt. Genau diese
 * Vorgaben gibt es seit Aufgabe 4 nicht mehr: Die Bausteine bekommen ihren
 * Text von der Seite, die Seite aus dem CMS. Ein Aufruf endet deshalb mit
 * „Vorgabe nicht gefunden", und das ist richtig so.
 *
 * Es bleibt liegen, weil es belegt, WOHER der Startbestand stammt — nicht
 * abgetippt, sondern aus dem Stand gelesen, den die Seite an dem Tag zeigte.
 * Die beiden .ndjson-Dateien daneben sind das Ergebnis und ab jetzt die
 * Quelle; wer den Datensatz neu aufsetzen muss, spielt sie ein (siehe
 * README.md).
 *
 * Wer den Umzug nachvollziehen will, findet den lauffähigen Stand im Commit
 * „Aufgabe 4, erste Hälfte: der Inhalt liegt jetzt im CMS".
 */
import { readFileSync } from "node:fs";

const lies = (p) => readFileSync(p, "utf8");

/**
 * Holt einen Vorgabewert aus dem Frontmatter einer .astro-Datei.
 *
 * `name = <literal>` bis zum Komma auf gleicher Klammerebene. Ausgewertet
 * wird mit `eval`: Es sind reine Literale aus dem eigenen Quelltext, und ein
 * eigener Parser für JS-Objekte wäre hier die schlechtere Wette.
 */
function vorgabe(quelle, name) {
  const start = quelle.indexOf(`${name} =`);
  if (start < 0) throw new Error(`Vorgabe „${name}" nicht gefunden`);

  let i = quelle.indexOf("=", start) + 1;
  let tiefe = 0;
  let geoeffnet = false;
  let inText = null;
  const anfang = i;

  for (; i < quelle.length; i++) {
    const c = quelle[i];
    if (inText) {
      if (c === "\\") i++;
      else if (c === inText) inText = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inText = c;
      /* Eine Zeichenkette OHNE Klammern drumherum ist der ganze Wert —
         etwa `topline = "Guides",`. Sie endet am Komma auf Ebene 0. */
      continue;
    }
    if ("[{(".includes(c)) {
      tiefe++;
      geoeffnet = true;
    } else if ("]})".includes(c)) {
      /* Eine schließende Klammer, ohne dass dieser Wert eine geöffnet hätte,
         gehört schon zur umgebenden Destrukturierung — etwa das `}` in
         `const { titel = "Unsere Services" } = Astro.props;`. Der Wert endet
         davor. */
      if (!geoeffnet) break;
      tiefe--;
      /* Zurück auf Ebene 0 heißt: Der Wert ist vollständig. Ohne diese
         Abbruchbedingung lief der Zeiger über das Ende hinaus und `eval`
         bekam den Rest der Datei zu sehen. */
      if (tiefe === 0) {
        i++;
        break;
      }
    } else if (c === "," && tiefe === 0 && !geoeffnet) break;
    else if (c === ";" && tiefe === 0 && !geoeffnet) break;
  }

  return eval(`(${quelle.slice(anfang, i)})`);
}

const S = (p) => lies(`web/src/components/sections/${p}.astro`);

/* --- Die elf Leistungen ------------------------------------------------- */

const liste = lies("web/src/lib/leistungsliste.ts");
const eintraege = [...liste.matchAll(
  /\{ slug: "([^"]+)", name: "([^"]+)"(?:, titel: "([^"]+)")?, platzierung: "([^"]+)"(?:, gruppe: "([^"]+)")?(?:, tag: "([^"]+)")?/g
)];
if (!eintraege.length) throw new Error("Keine Leistungen gefunden — Form von beispielListe geändert?");

const zeilen = eintraege.map(([, slug, name, titel, platzierung, gruppe, tag], i) => ({
  _id: `leistung-${slug}`,
  _type: "leistung",
  titel: titel || name,
  kurzname: titel ? name : undefined,
  slug: { _type: "slug", current: slug },
  topline: `${name} in Berlin`,
  platzierung,
  gruppe,
  tag,
  /* Die Reihenfolge der Liste ist die Relevanzordnung. orderRank hält sie im
     Studio, wo sie sich ziehen lässt. */
  orderRank: String(i).padStart(4, "0"),
}));

/* --- Die Einstellungen -------------------------------------------------- */

const einst = vorgabe(lies("web/src/lib/einstellungen.ts"), "beispielEinstellungen: Einstellungen");
zeilen.push({
  _id: "einstellungen",
  _type: "einstellungen",
  ...einst,
  standorte: einst.standorte.map((o, i) => ({ _key: `standort-${i}`, ...o })),
});

/* --- Die Startseite ----------------------------------------------------- */

const hero = S("Hero");
const split = S("Split");
const services = S("Services");
const standards = S("Standards");
const gallery = S("Gallery");
const experts = S("Experts");
const stories = S("Stories");
const magazine = S("Magazine");
const index = lies("web/src/pages/index.astro");

const schluessel = (praefix) => (o, i) => ({ _key: `${praefix}-${i}`, ...o });

zeilen.push({
  _id: "startseite",
  _type: "startseite",

  heroZeilen: vorgabe(hero, "zeilen"),

  splitTopline: vorgabe(split, "topline"),
  splitTitel: vorgabe(split, "titel"),
  splitAbsaetze: vorgabe(split, "absaetze"),

  servicesTitel: vorgabe(services, "titel"),

  standardsTitel: vorgabe(standards, "titel"),
  standardsEintraege: vorgabe(standards, "eintraege").map(schluessel("standard")),

  standorteTitel: vorgabe(gallery, "titel"),

  expertenTitel: vorgabe(experts, "titel"),
  expertenNamen: vorgabe(experts, "namen"),
  expertenText: vorgabe(experts, "absaetze").join("\n\n"),

  /* Die Stories tragen im Markup Bildnamen aus der lokalen Pipeline. Ins CMS
     wandern Name und Zitat; das Bild pflegt der Kunde dort selbst, sonst
     zeigte das Studio einen Dateinamen, mit dem er nichts anfangen kann. */
  storiesEintraege: vorgabe(stories, "eintraege")
    .map(({ name, zitat }) => ({ name, zitat }))
    .map(schluessel("story")),

  magazinTopline: vorgabe(magazine, "topline"),
  /* Stand bis Aufgabe 4 fest im Markup, obwohl es das Feld gab — der Kunde
     konnte es füllen, ohne dass sich etwas änderte. */
  magazinTitel: "Magazin",
  magazinText: vorgabe(magazine, "text"),

  faqTitel: "Häufige Fragen",
  faqText: "Nichts dabei? Schreiben Sie uns - wir antworten in der Regel am selben Werktag.",
  faq: vorgabe(index, "FRAGEN").map(schluessel("frage")),
});

/* --- Zwei Dateien, weil zwei Importarten nötig sind ---------------------
 *
 * Die Leistungen tragen hier nur ihre Grunddaten — Titel, Slug, Platzierung.
 * `leistung-veneers` ist im Datensatz aber längst voll gepflegt. Mit
 * `--replace` wäre dieser Inhalt weg, und zwar ohne Rückfrage.
 *
 * Deshalb getrennt: Leistungen mit `--missing` (was da ist, bleibt), die
 * beiden Einzeldokumente mit `--replace` (sie sollen genau diesen Stand
 * bekommen).
 */
import { writeFileSync } from "node:fs";

const alsNdjson = (liste) =>
  liste.map((z) => JSON.stringify(z, (k, v) => (v === undefined ? undefined : v))).join("\n") + "\n";

const leistungen = zeilen.filter((z) => z._type === "leistung");
const seiten = zeilen.filter((z) => z._type !== "leistung");

writeFileSync("studio/seed/leistungen.ndjson", alsNdjson(leistungen));
writeFileSync("studio/seed/seiten.ndjson", alsNdjson(seiten));

console.error(
  `leistungen.ndjson  ${leistungen.length} Dokumente  (Import mit --missing)\n` +
    `seiten.ndjson      ${seiten.length} Dokumente  (Import mit --replace)`
);
