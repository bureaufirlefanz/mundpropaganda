/**
 * Verschiebt `seoDescription` einer Leistung nach `seo.description`.
 *
 * **Warum es das gibt.** Die Leistungsseiten hatten als einzige Seiten mit
 * eigener Adresse kein SEO-Objekt, sondern eine nackte `seoDescription`.
 * Kein eigener Seitentitel, kein Teilen-Bild, kein Ausschluss aus dem
 * Suchindex — und das ausgerechnet für `/leistungen/veneers`, die nach der
 * Startseite meistaufgerufene Seite. Seit dem Umbau tragen sie dasselbe
 * `seo`-Objekt wie alle anderen.
 *
 * Der alte Wert liegt weiterhin im Datensatz und würde von niemandem mehr
 * gelesen. Dieses Skript hängt ihn um und räumt ihn weg.
 *
 * **Aufruf** — braucht keinen selbst erzeugten Token, sondern die Anmeldung,
 * die die Sanity-CLI ohnehin hat:
 *
 *     cd studio && npx sanity exec scripts/service-seo.mjs --with-user-token
 *
 * Zweimal aufrufen ist harmlos: Beim zweiten Mal gibt es kein
 * `seoDescription` mehr, und das Skript meldet, dass nichts zu tun war.
 *
 * **Was es nicht anfasst:** Eine Leistung, die bereits `seo.description`
 * trägt. Der neue Wert gewinnt — sonst überschriebe ein alter Rest eine
 * Beschreibung, die jemand im Studio schon gepflegt hat.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-28" });

const services = await client.fetch(
  `*[_type == "service" && defined(seoDescription)]{ _id, "slug": slug.current, seoDescription, "vorhanden": seo.description }`,
);

if (!services.length) {
  console.log("Nichts zu tun: keine Leistung trägt noch seoDescription.");
  process.exit(0);
}

let verschoben = 0;
let uebersprungen = 0;
const tx = client.transaction();

for (const s of services) {
  if (s.vorhanden) {
    console.log(
      `  · ${s.slug}: seo.description ist schon gepflegt, alter Wert wird nur entfernt`,
    );
    uebersprungen++;
    tx.patch(s._id, (p) => p.unset(["seoDescription"]));
    continue;
  }
  console.log(`  → ${s.slug}: „${s.seoDescription.slice(0, 60)}…"`);
  verschoben++;
  tx.patch(s._id, (p) =>
    p.set({ "seo.description": s.seoDescription }).unset(["seoDescription"]),
  );
}

await tx.commit();
console.log(
  `\n${verschoben} Beschreibung(en) nach seo.description verschoben, ${uebersprungen} nur aufgeräumt.`,
);
