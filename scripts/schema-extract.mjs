/**
 * Schema aus dem Studio ziehen — und das ERGEBNIS prüfen, nicht den
 * Exit-Code.
 *
 * `sanity schema extract` schreibt schema.json zuverlässig und stürzt danach
 * beim Beenden ab, in etwa drei von vier Läufen: „Abort trap: 6", Exit 134,
 * nach der Zeile „✔ Extracted schema". Gemessen über vier Läufe hintereinander,
 * jedes Mal mit vollständig und korrekt geschriebener Datei.
 *
 * Das ist ein Absturz im Sanity-CLI, kein Befund über dieses Projekt — aber er
 * riss `web:check` mit sich, und ein Wächter, der zu drei Vierteln aus
 * fremdem Grund rot ist, wird nach dem zweiten Mal ignoriert.
 *
 * **Der Exit-Code wird deshalb nicht geschluckt, sondern ersetzt.** Statt zu
 * fragen „ist der Prozess sauber beendet?" fragt dieses Skript „liegt ein
 * frisches, vollständiges Schema da?". Das ist die Eigenschaft, auf die es
 * ankommt, und sie ist strenger als vorher: Ein Schema, das gar nicht
 * geschrieben wurde, fiel vorher nur über den Exit-Code auf — jetzt über die
 * Datei selbst.
 *
 * Sobald der Absturz im CLI behoben ist, kann dieses Skript wieder durch den
 * nackten Aufruf ersetzt werden. Die Prüfung schadet dann nicht, sie ist nur
 * überflüssig.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const ZIEL = "schema.json";
const BEGONNEN = Date.now();

const lauf = spawnSync(
  "npm",
  ["--prefix", "studio", "run", "schema:extract"],
  { stdio: "inherit" }
);

/* Erwartet werden mindestens die Dokumenttypen, die es sicher gibt. Eine reine
   Existenzprüfung reichte nicht: Eine leere oder halb geschriebene Datei
   bestünde sie. */
const PFLICHT = ["startseite", "leistung", "einstellungen", "navigation", "footer"];

let schema;
try {
  const stand = statSync(ZIEL);
  if (stand.mtimeMs < BEGONNEN - 1000) {
    throw new Error("schema.json ist älter als dieser Lauf — es wurde nicht neu geschrieben.");
  }
  schema = JSON.parse(readFileSync(ZIEL, "utf8"));
  if (!Array.isArray(schema) || schema.length === 0) {
    throw new Error("schema.json ist leer oder hat nicht die erwartete Form.");
  }
  const namen = new Set(schema.map((t) => t?.name));
  const fehlend = PFLICHT.filter((n) => !namen.has(n));
  if (fehlend.length) {
    throw new Error(`Im Schema fehlen: ${fehlend.join(", ")}`);
  }
} catch (fehler) {
  console.error(`\n✗ Schema-Export fehlgeschlagen: ${fehler.message}`);
  process.exit(1);
}

if (lauf.status !== 0) {
  console.error(
    `\n  (Das Sanity-CLI ist mit Code ${lauf.status} abgestürzt, nachdem es das Schema\n` +
      `   geschrieben hatte. ${schema.length} Typen liegen vollständig vor — weiter.)`
  );
}
