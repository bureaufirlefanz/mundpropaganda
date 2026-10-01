/**
 * Erzeugt `web/BAUSTEINE.md` — das Verzeichnis aller Komponenten, Vorlagen
 * und Layouts, nach Aufgabe gruppiert.
 *
 * **Warum generiert und nicht von Hand gepflegt:** Eine Liste, die jemand
 * nachtragen muss, ist nach dem dritten Baustein falsch — und eine falsche
 * Liste ist schlimmer als keine, weil man ihr glaubt. Dieses Skript liest die
 * Dateien selbst.
 *
 *     npm run bausteine
 *
 * ── Was es je Baustein sammelt ───────────────────────────────────────────
 *
 *   - **Kurzbeschreibung** — der erste Satz des Kopfkommentars. Deshalb lohnt
 *     es sich, ihn zu schreiben.
 *   - **Angaben** (`interface Props`) — woran man erkennt, ob ein Baustein
 *     die eigene Aufgabe trägt.
 *   - **Verwendet in** — welche Vorlagen und Seiten ihn aufrufen. Die Spalte,
 *     die bei „gibt es das schon?" am schnellsten antwortet, und die zugleich
 *     zeigt, was verwaist ist.
 *   - **Katalog** — ob der Baustein auf `/design/komponenten` zu sehen ist.
 *
 * ── Die Gruppierung ──────────────────────────────────────────────────────
 *
 * `GROUPS` unten ist von Hand gepflegt, denn „ist das ein Kartenraster oder
 * eine Liste?" liest keine Maschine aus dem Dateinamen. Damit die Zuordnung
 * trotzdem nicht veraltet, landet alles Unbekannte sichtbar unter „Nicht
 * einsortiert" — und das Skript sagt es beim Lauf. Eine stille Lücke gibt es
 * dadurch nicht.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/* fileURLToPath, nicht `.pathname`: Der Projektpfad enthält Leerzeichen, und
   die kämen als %20 zurück. */
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const WEB = join(ROOT, "web/src");

/** Nach Aufgabe, nicht nach Ordner. Reihenfolge = Reihenfolge im Dokument. */
const GROUPS = [
  {
    title: "Seitenköpfe",
    hint: "Der erste Bildschirm eines Seitentyps. Sie unterscheiden sich im Bau, nicht nur im Inhalt.",
    members: ["Hero", "ServiceHero", "PillarHero", "CareersHero"],
  },
  {
    title: "Text und Einstieg",
    hint: "Fließtext und Überleitungen.",
    members: [
      "Intro",
      "Prose",
      "Statement",
      "Split",
      "TextHeading",
      "SectionHeading",
    ],
  },
  {
    title: "Verzeichnis und Sprungmarken",
    hint: "Orientierung auf langen Seiten. Alle drei arbeiten mit derselben `Heading[]`-Liste.",
    members: ["Contents", "SectionDock", "TableOfContents", "NavPromo"],
  },
  {
    title: "Daten und Vergleich",
    hint: "Zahlen, Preise, Gegenüberstellungen.",
    members: ["Compare", "Prices", "Facts", "QuickFacts"],
  },
  {
    title: "Abläufe",
    hint: "Schritt für Schritt, mit und ohne Zeitachse.",
    members: ["Steps", "Timeline", "Features"],
  },
  {
    title: "Karten und Listen",
    hint: "Wiederholte Einträge. Vor einem neuen Kartenraster hier zuerst nachsehen.",
    members: [
      "Services",
      "Magazine",
      "PostList",
      "PostCard",
      "Jobs",
      "Team",
      "Locations",
      "Perks",
      "Reasons",
      "Standards",
      "Benefits",
      "Values",
    ],
  },
  {
    title: "Stimmen und Geschichten",
    hint: "Patientinnen und Patienten, Mitarbeitende.",
    members: ["Stories", "Story", "Voices", "Experts"],
  },
  {
    title: "Medien",
    hint: "Bilder, Vergleiche, Video.",
    members: [
      "Gallery",
      "BeforeAfter",
      "VideoBlock",
      "CmsImage",
      "Picture",
      "PostImage",
      "ImageRing",
    ],
  },
  {
    title: "Handlung und Kontakt",
    hint: "Alles, was zu einem Termin führt.",
    members: [
      "CtaBand",
      "Contact",
      "Application",
      "Button",
      "Faq",
      "Accordion",
    ],
  },
  {
    title: "Hinweise und Belege",
    hint: "Abgesetzte Kästen, Autorenangaben.",
    members: ["SourceNote", "AuthorNote", "Reviews"],
  },
  {
    title: "Rahmen",
    hint: "Auf jeder Seite gleich.",
    members: ["Nav", "Footer", "Filter", "Panel", "Backdrop"],
  },
  {
    title: "Technik und Zierde",
    hint: "Kein eigener Inhalt — Sprites, Übergänge, Motive, Angaben für Suchmaschinen.",
    members: [
      "Icons",
      "Transition",
      "VisualEditing",
      "StructuredData",
      "Thread",
      "ToothLines",
      "ToothRings",
    ],
  },
];

const FOLDERS = ["components/sections", "components/ui"];

/**
 * Bausteine, die nicht in den Katalog gehören — und warum.
 *
 * Ohne diese Liste stünden 35 Namen unter „fehlt", von denen ein Drittel gar
 * nichts zu zeigen hat. Eine Mängelliste, die zu einem Drittel aus
 * Nicht-Mängeln besteht, liest nach zwei Wochen niemand mehr.
 */
/* The reasons were checked against the files on 2026-09-27. Two were wrong:
   Nav and Footer were "on every page, also this one", but the design pages
   use layouts/Design.astro, which includes neither; Backdrop was described
   as the dimming behind the menu, but it is the paper grain over the page.
   The four heroes left this list when the catalogue started showing them
   on stages of their own. */
const EXEMPT = {
  Icons: "SVG-Sprite, unsichtbar",
  PhotoGrade: "Test-Farbkorrektur über allen Fotos, kein eigener Baustein",
  Transition: "Seitenübergang, kein Markup",
  VisualEditing: "nur im Vorschaumodus",
  StructuredData: "JSON-LD im Kopf der Seite, unsichtbar",
  Backdrop:
    "Papierkörnung über der ganzen Seite, aus layouts/Base.astro; auf dem Styleguide unter Körnung",
  Nav: "fixierte Leiste aus layouts/Base.astro, läge über jedem Beispiel",
  Footer:
    "Seitenfuß aus layouts/Base.astro, schließt eine Seite ab; mitten im Katalog ergäbe er keinen Sinn",
  CmsImage: "Bildhülle ohne eigene Gestalt",
  Picture: "Bildhülle ohne eigene Gestalt",
  ToothLines: "Zierlinien im Hintergrund",
  ToothRings: "Zierringe im Hintergrund",
  Thread: "Verbindungslinie, gehört zu einem Abschnitt",
};

/** Alle Dateien, in denen ein Baustein aufgerufen werden könnte. */
function callers() {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(WEB, dir), { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(astro|ts)$/.test(entry.name)) {
        files.push({ path, text: readFileSync(join(WEB, path), "utf8") });
      }
    }
  };
  /* `layouts` belongs here: Nav, Footer, Backdrop, Icons, Transition and
     StructuredData are only called from layouts/Base.astro, and without it
     they were listed as used "nirgends". */
  for (const d of ["pages", "templates", "components", "layouts"]) walk(d);
  return files;
}

/** Der erste Satz des Kopfkommentars — die Antwort auf „was ist das?". */
function summary(text) {
  const block = text.match(/^---\s*\n\/\*\*([\s\S]*?)\*\//);
  if (!block) return "";
  const lines = block[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean);
  const first = [];
  for (const l of lines) {
    if (l.startsWith("─") || l.startsWith("**")) break;
    first.push(l);
    if (/[.!?]$/.test(l)) break;
  }
  return first.join(" ").replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
}

/**
 * Die Angaben aus `interface Props` — mit Typ und mit dem JSDoc darüber.
 *
 * Vorher stand hier nur der Name. Das war zu wenig: `steps` sagt nicht, was
 * ein Schritt ist, und `images` nicht, ob eine Bildunterschrift dazugehört.
 * Beides steht in der Datei, direkt daneben, und wurde beim Erzeugen
 * weggeschnitten — die Liste war damit ärmer als ihre Quelle.
 *
 * Die Klammertiefe wird mitgezählt, damit ein Objekttyp über mehrere Zeilen
 * nicht als drei weitere Angaben durchgeht.
 *
 * `extends` gehört mit ins Muster. `Picture.astro` schreibt
 * `interface Props extends HTMLAttributes<"img"> {` — der frühere Ausdruck
 * verlangte die Klammer direkt hinter `Props` und fand deshalb nichts. Die
 * Zeile im Katalog trug für diesen Baustein „—" statt seiner sechs Angaben,
 * und zwar stillschweigend: Ein Baustein ohne Angaben ist ein gültiger Fall.
 */
function props(text) {
  const block = text.match(/interface Props[^{]*\{([\s\S]*?)\n\}/);
  if (!block) return [];

  const out = [];
  let doc = null;
  let inDoc = false;
  let depth = 0;

  for (const raw of block[1].split("\n")) {
    const line = raw.trim();

    /* JSDoc über der Angabe einsammeln — das ist der Hilfetext. */
    if (line.startsWith("/**")) {
      doc = line.replace(/^\/\*\*\s?/, "").replace(/\s*\*\/$/, "");
      inDoc = !line.endsWith("*/");
      continue;
    }
    if (inDoc) {
      if (line.endsWith("*/")) inDoc = false;
      const stueck = line.replace(/^\*\s?/, "").replace(/\s*\*\/$/, "");
      if (stueck) doc = doc ? `${doc} ${stueck}` : stueck;
      continue;
    }
    /* Einzeilige Kommentare tragen keinen Hilfetext, nur Randnotizen. */
    if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("*"))
      continue;

    if (depth === 0) {
      const m = line.match(/^([a-zA-Z_$][\w$]*)(\?)?\s*:\s*(.*)$/);
      if (m) {
        out.push({
          name: m[1],
          optional: Boolean(m[2]),
          type: m[3].replace(/;\s*$/, "").trim(),
          doc,
        });
        doc = null;
      }
    }

    depth += (line.match(/[{[(]/g) || []).length;
    depth -= (line.match(/[}\])]/g) || []).length;
    if (depth < 0) depth = 0;
  }

  /* Ein Typ, der über mehrere Zeilen läuft, kommt hier als angefangene Zeile
     an. Für die Tabelle reicht der Anfang; die Datei bleibt die Wahrheit. */
  for (const a of out) if (!a.type) a.type = "…";
  return out;
}

/** Kurzform für die Tabelle: `name?: Typ`, lange Typen abgeschnitten. */
function angabe({ name, optional, type }) {
  const kurz = type.length > 28 ? `${type.slice(0, 27)}…` : type;
  return `${name}${optional ? "?" : ""}: ${kurz}`;
}

/* --- Einlesen ----------------------------------------------------------- */

const all = callers();

/* Die Komponentenseite ist der lebende Katalog: Wer einen Baustein baut und
   ihn dort nicht zeigt, hat ihn für alle anderen unsichtbar gebaut. */
const gallery =
  all.find((f) => f.path === "pages/design/komponenten.astro")?.text ?? "";

const components = new Map();
for (const dir of FOLDERS) {
  for (const file of readdirSync(join(WEB, dir)).filter((f) =>
    f.endsWith(".astro"),
  )) {
    const name = file.replace(".astro", "");
    const full = join(dir, file);
    const text = readFileSync(join(WEB, full), "utf8");
    components.set(name, {
      name,
      kind: dir.endsWith("sections") ? "Abschnitt" : "UI",
      summary: summary(text) || "—",
      props: props(text),
      inGallery: new RegExp(`<${name}[\\s/>]`).test(gallery),
      used: all
        .filter(
          (f) => f.path !== full && new RegExp(`<${name}[\\s/>]`).test(f.text),
        )
        .map((f) =>
          f.path
            .replace(/\.astro$/, "")
            .replace(/^(pages|templates|components)\//, ""),
        )
        .sort(),
    });
  }
}

/* --- Schreiben ---------------------------------------------------------- */

const seen = new Set();
const HEAD =
  "| Baustein | Art | Was es ist | Angaben | Verwendet in | Katalog |\n|---|---|---|---|---|---|";

const rows = (names) =>
  names
    .filter((n) => components.has(n))
    .map((n) => {
      seen.add(n);
      const c = components.get(n);
      return `| \`${c.name}\` | ${c.kind} | ${c.summary.slice(0, 130)} | ${
        c.props.length ? c.props.map((p) => `\`${angabe(p)}\``).join(" ") : "—"
      } | ${c.used.length ? c.used.join(", ") : "**nirgends**"} | ${c.inGallery ? "✓" : "—"} |`;
    })
    .join("\n");

let out = `# Bausteine

**Erzeugt, nicht von Hand gepflegt.** Neu erzeugen mit \`npm run bausteine\`.

Diese Liste beantwortet eine Frage: **Gibt es das schon?** Bevor ein neuer
Baustein entsteht, gehört sie durchgesehen. Ein zweiter Baustein für dieselbe
Sache läuft beim nächsten Feinschliff auseinander, und die Seite sieht danach
an zwei Stellen verschieden aus.

Findet sich etwas Ähnliches, gibt es drei Wege:

1. **Anschließen** — der Baustein trägt die Aufgabe schon.
2. **Erweitern** — eine wahlfreie Angabe dazu, *additiv*: ohne sie muss
   dasselbe Markup wie zuvor entstehen. Mit \`npm run web:styles\` belegen,
   dass die bestehenden Seiten sich nicht verändert haben.
3. **Neu bauen** — nur, wenn der Bau grundlegend anders ist. Dann steht im
   Kopfkommentar, warum.

**Spalte „Verwendet in"** zeigt, was verwaist ist.
**Spalte „Katalog"** zeigt, ob der Baustein auf \`/design/komponenten\` steht.
`;

for (const group of GROUPS) {
  const body = rows(group.members);
  if (!body) continue;
  out += `\n## ${group.title}\n\n${group.hint}\n\n${HEAD}\n${body}\n`;
}

const orphans = [...components.keys()].filter((n) => !seen.has(n)).sort();
if (orphans.length) {
  out +=
    `\n## Nicht einsortiert\n\nDiese Bausteine stehen in keiner Gruppe. Wer einen davon anfasst, trägt ihn\n` +
    `in \`scripts/bausteine.mjs\` unter \`GROUPS\` ein.\n\n${HEAD}\n${rows(orphans)}\n`;
}

const notShown = [...components.values()]
  .filter((c) => !c.inGallery && !EXEMPT[c.name])
  .map((c) => c.name);
const exempt = [...components.values()].filter(
  (c) => !c.inGallery && EXEMPT[c.name],
);

out += `
## Deckung der Komponentenseite

${
  notShown.length
    ? `**${notShown.length} Bausteine fehlen und gehören ergänzt:**\n\n${notShown
        .map((n) => `\`${n}\``)
        .join(" · ")}`
    : "Es fehlt keiner."
}

Bewusst nicht im Katalog:

${exempt.map((c) => `- \`${c.name}\` — ${EXEMPT[c.name]}`).join("\n")}

## Angaben im Einzelnen

Nur die Angaben, über denen ein JSDoc steht. Er ist der Hilfetext: Was ein
Wert bedeutet, steht damit an genau einer Stelle — in der Datei — und wird
hier bloß eingesammelt. Wer eine Angabe hinzufügt und sie nicht erklärt,
taucht hier nicht auf; das ist der Zweck der Liste.

${[...components.values()]
  .filter((c) => c.props.some((a) => a.doc))
  .map(
    (c) =>
      `**\`${c.name}\`**\n\n${c.props
        .filter((a) => a.doc)
        .map(
          (a) =>
            `- \`${a.name}${a.optional ? "?" : ""}: ${a.type}\` — ${a.doc}`,
        )
        .join("\n")}`,
  )
  .join("\n\n")}

## Vorlagen und Layouts

Eine Vorlage ist der Zusammenbau eines Seitentyps. Sie lädt nichts, sie
bekommt alles als Angabe — dadurch rendert dieselbe Vorlage veröffentlichte
Inhalte und Entwürfe.

${["templates", "layouts"]
  .map((dir) => {
    const files = readdirSync(join(WEB, dir))
      .filter((f) => f.endsWith(".astro"))
      .sort();
    return `**${dir}/**\n\n${files
      .map((f) => {
        const text = readFileSync(join(WEB, dir, f), "utf8");
        return `- \`${f.replace(".astro", "")}\` — ${summary(text).slice(0, 120) || "—"}`;
      })
      .join("\n")}`;
  })
  .join("\n\n")}

## Module

JavaScript-Verhalten liegt in \`web/src/js/modules/\` und wird von \`init.js\`
gestartet. Ein Modul findet sein Markup über \`data-\`-Attribute und tut
nichts, wenn es keines gibt — deshalb schadet es nicht, dass jede Seite alle
Module lädt.

${readdirSync(join(WEB, "js/modules"))
  .filter((f) => f.endsWith(".js"))
  .sort()
  .map((f) => `\`${f.replace(".js", "")}\``)
  .join(" · ")}
`;

const target = join(ROOT, "web/BAUSTEINE.md");
writeFileSync(target, out);

console.log(
  `Geschrieben: ${relative(ROOT, target)}  (${components.size} Bausteine)`,
);

/* Die Abdeckung wird mitgemeldet, nicht nur erzeugt: Eine Zahl, die man beim
   Lauf sieht, bewegt sich; eine, die man suchen muss, nicht. */
const alleAngaben = [...components.values()].flatMap((c) => c.props);
const erklaert = alleAngaben.filter((a) => a.doc).length;
console.log(
  `Angaben: ${alleAngaben.length}, davon ${erklaert} mit JSDoc ` +
    `(${Math.round((100 * erklaert) / alleAngaben.length)} %)`,
);
if (orphans.length) console.log(`Nicht einsortiert: ${orphans.join(", ")}`);
if (notShown.length)
  console.log(`Fehlen im Katalog (${notShown.length}): ${notShown.join(", ")}`);
else console.log("Katalog vollständig.");
