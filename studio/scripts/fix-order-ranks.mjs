/**
 * Repariert die Sortierwerte der ziehbaren Listen im Studio.
 *
 * ── Was kaputt war ───────────────────────────────────────────────────────
 *
 * `@sanity/orderable-document-list` speichert die Reihenfolge in `orderRank`
 * und erwartet dort einen **Lexorank**: `bucket|wert:`, also etwa
 * `0|10000g:`. Der Startbestand trug stattdessen schlichte Zahlen — `0000`
 * bis `0010` bei den Leistungen, `0000` bis `0003` bei den Stellen. Sie
 * kamen aus den Seed-Dateien.
 *
 * Sortieren tut das trotzdem, weil GROQ die Zeichenketten einfach
 * lexikografisch vergleicht. Deshalb ist es nie aufgefallen: Die Liste sah
 * richtig aus. Nur ziehen ließ sich nichts.
 *
 * Beim Ziehen berechnet das Plugin einen Wert ZWISCHEN den beiden Nachbarn
 * und muss beide dafür parsen. `LexoRank.parse("0001")` wirft — die
 * Zeichenkette hat kein `|`. Das Plugin fängt den Fehler ab, die Karte
 * springt zurück, und es erscheint keine Meldung. Genau das, was man sieht,
 * wenn man Veneers nach oben ziehen will.
 *
 * Veneers war übrigens der einzige Eintrag mit einem gültigen Wert
 * (`0|100008:`) — dort hatte jemand einmal erfolgreich gezogen, bevor die
 * Nachbarn kaputt waren. Weil `'0'` vor `'|'` steht, sortierte es dadurch
 * hinter alle anderen und stand ganz unten.
 *
 * ── Was dieses Skript tut ────────────────────────────────────────────────
 *
 * Es liest jede ziehbare Liste in der Reihenfolge, die das Studio gerade
 * zeigt, und schreibt allen Einträgen frische, gleichmäßig verteilte
 * Lexoranks. Die sichtbare Reihenfolge bleibt dabei erhalten — mit einer
 * Ausnahme: Was in `NACH_OBEN` steht, wandert an den Anfang seiner Liste.
 *
 * Danach funktioniert das Ziehen im Studio wieder für alle Einträge.
 *
 * ── Aufruf ───────────────────────────────────────────────────────────────
 *
 *     cd studio && npx sanity exec scripts/fix-order-ranks.mjs --with-user-token
 *
 * Vorher ansehen, ohne etwas zu schreiben:
 *
 *     cd studio && DRY=1 npx sanity exec scripts/fix-order-ranks.mjs --with-user-token
 *
 * Mehrfaches Ausführen ist harmlos: Es schreibt jedes Mal denselben Satz
 * Werte in derselben Reihenfolge.
 */
import { getCliClient } from "sanity/cli";
import { LexoRank } from "lexorank";

/* Probelauf: alles rechnen und anzeigen, nichts absenden. */
const DRY = process.env.DRY === "1";

const client = getCliClient({ apiVersion: "2026-07-28" });

/** Die Typen, die im Studio als ziehbare Liste stehen. */
const LISTEN = ["service", "job"];

/** Was an den Anfang seiner Liste soll. Leeren, wenn nichts umsortiert wird. */
const NACH_OBEN = ["service-veneers"];

/** Erzeugt n gleichmäßig verteilte, gültige Lexoranks in aufsteigender Folge. */
function raenge(n) {
  let r = LexoRank.min();
  return Array.from({ length: n }, () => (r = r.genNext()).toString());
}

async function los() {
  const stapel = client.transaction();
  let geaendert = 0;

  for (const typ of LISTEN) {
    /* In genau der Reihenfolge lesen, die das Studio anzeigt. `order()` auf
       einer Mischung aus kaputten und gültigen Werten ist zwar willkürlich,
       aber es ist die Willkür, die der Kunde vor sich sieht — und die soll
       erhalten bleiben, bis auf das, was NACH_OBEN sagt. */
    const docs = await client.fetch(
      `*[_type == $typ] | order(orderRank) { _id, title, orderRank }`,
      { typ }
    );
    if (!docs.length) continue;

    const vorne = docs.filter((d) => NACH_OBEN.includes(d._id));
    const rest = docs.filter((d) => !NACH_OBEN.includes(d._id));
    const sortiert = [...vorne, ...rest];

    const neu = raenge(sortiert.length);

    console.log(`\n${typ} (${sortiert.length}):`);
    sortiert.forEach((d, i) => {
      const alt = d.orderRank ?? "—";
      const marke = alt === neu[i] ? " " : "→";
      console.log(`  ${marke} ${String(i + 1).padStart(2)}. ${neu[i]}  ${d.title ?? d._id}`);
      if (alt !== neu[i]) {
        stapel.patch(d._id, (p) => p.set({ orderRank: neu[i] }));
        geaendert++;
      }
    });
  }

  if (!geaendert) {
    console.log("\nNichts zu tun — alle Sortierwerte sind bereits gültig.");
    return;
  }

  if (DRY) {
    console.log(`\nProbelauf: ${geaendert} Werte WÜRDEN geändert. Nichts geschrieben.`);
    return;
  }

  await stapel.commit();
  console.log(`\n✓ ${geaendert} Sortierwerte repariert. Ziehen funktioniert wieder.`);
}

los().catch((fehler) => {
  console.error("Fehlgeschlagen:", fehler.message);
  process.exit(1);
});
