/**
 * Aufräumen nach dem QA-Durchgang zur Prototyp-Ablösung.
 *
 * Zwei Dinge, beide klein und beide gemessen statt vermutet:
 *
 * 1. **Verwaiste `marker` an den Etappen des Bewerbungsablaufs.** Das Feld
 *    ist mit den Zeitmarken aus dem Schema gefallen („Tag 0", „Woche 2–3");
 *    die Werte liegen aber noch im Dokument. Sie stören nicht — kein Code
 *    liest sie — aber sie sind genau die Sorte Rest, die beim nächsten
 *    Schema-Umbau als „was ist das?" wieder auftaucht.
 *
 * 2. **`siteName` in den Einstellungen.** Seit den Website-Einstellungen ein
 *    Pflichtfeld, aber im Dokument leer, weil `initialValue` nur bei neuen
 *    Dokumenten greift. Die Website fällt auf „Mundpropaganda" zurück, das
 *    Studio zeigt aber ein rotes Pflichtfeld — der Kunde sähe einen Fehler,
 *    den es nicht gibt.
 *
 * Aufruf:
 *     cd studio && DRY=1 npx sanity exec scripts/qa-cleanup.mjs --with-user-token
 *     cd studio && npx sanity exec scripts/qa-cleanup.mjs --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-28" });
const DRY = process.env.DRY === "1";

async function los() {
  const batch = client.transaction();
  const report = [];

  /* 1. Die verwaisten Marker. `unset` je Index — die Etappen selbst bleiben
     unangetastet. */
  const etappen = await client.fetch(
    `*[_id == "careers"][0].processStages[]{ marker }`,
  );
  const mitMarker = (etappen ?? [])
    .map((e, i) => ({ i, marker: e?.marker }))
    .filter((e) => e.marker != null);

  if (mitMarker.length) {
    batch.patch("careers", (p) =>
      p.unset(mitMarker.map((e) => `processStages[${e.i}].marker`)),
    );
    report.push(
      `careers: ${mitMarker.length} verwaiste marker entfernt (${mitMarker.map((e) => `„${e.marker}“`).join(", ")})`,
    );
  } else {
    report.push("careers: keine verwaisten marker");
  }

  /* 2. Der Websitename. Nur setzen, wenn er fehlt — ein gepflegter Wert
     gehört dem Kunden. */
  const name = await client.fetch(`*[_id == "settings"][0].siteName`);
  if (!name) {
    batch.patch("settings", (p) => p.set({ siteName: "Mundpropaganda" }));
    report.push("settings: siteName auf „Mundpropaganda“ gesetzt");
  } else {
    report.push(`settings: siteName ist bereits „${name}“`);
  }

  console.log(report.map((z) => "  " + z).join("\n"));

  if (DRY) {
    console.log("\nProbelauf. Nichts geschrieben.");
    return;
  }

  await batch.commit();
  console.log("\n✓ Geschrieben.");
}

los().catch((error) => {
  console.error("Fehlgeschlagen:", error.message);
  process.exit(1);
});
