import { createClient, type SanityClient } from "@sanity/client";

/**
 * Die Vorschau: Entwürfe sehen, bevor sie veröffentlicht sind.
 *
 * Ein EIGENER Client, nicht der aus `sanity:client`. Drei Unterschiede, und
 * jeder einzelne darf nur hier gelten:
 *
 *   perspective: "drafts"  zeigt unveröffentlichte Änderungen
 *   token                  ohne ihn gibt die API keine Entwürfe heraus
 *   stega                  webt unsichtbare Markierungen in jeden Text,
 *                          aus denen das Studio das zugehörige Feld abliest
 *
 * Besonders die Markierungen gehören ausschließlich hierher. Sie stehen
 * mitten im Text; im ausgelieferten HTML landeten sie im Suchindex. Deshalb
 * steht in `astro.config.mjs` `stega.enabled: false` — der Wert gilt für den
 * gemeinsamen Client, und dieser hier setzt ihn allein für sich.
 */

const PROJEKT = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const DATENSATZ = import.meta.env.PUBLIC_SANITY_DATASET;
const STUDIO = import.meta.env.PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

/**
 * Der Token. **Ohne `PUBLIC_`** — sonst backte Astro ihn ins ausgelieferte
 * JavaScript, und ein Lesetoken für Entwürfe stünde im Quelltext jeder Seite.
 * Gemessen: Er steht im Funktionsbündel unter `.netlify/`, aber in keiner
 * einzigen Datei unter `dist/`. Kein Browser bekommt ihn zu sehen.
 *
 * **Erst die Laufzeit, dann der Build.** Astro ersetzt `import.meta.env.X`
 * beim Bauen durch den damaligen Wert — auch im Servercode. Stünde hier nur
 * das, wäre der Token fest im Bündel, und ein Tausch bei Netlify wirkte erst
 * nach einem neuen Deploy. Das ist genau der Fall, in dem man einen
 * kompromittierten Token für gewechselt hält, während der alte weiterläuft.
 *
 * `process.env` liest die Netlify-Funktion zur Laufzeit — dafür muss die
 * Variable dort den Scope „Functions" haben. Der Rückfall auf
 * `import.meta.env` trägt die lokale Entwicklung: Astro lädt `.env` dorthin,
 * nicht nach `process.env`.
 */
export function vorschauToken(): string | undefined {
  const laufzeit =
    typeof process !== "undefined" ? process.env?.SANITY_API_READ_TOKEN : undefined;
  return laufzeit || (import.meta.env.SANITY_API_READ_TOKEN as string | undefined);
}

/* Am Token gemerkt, nicht global: Wechselt er zur Laufzeit, entsteht ein
   neuer Client statt weiter mit dem alten zu arbeiten. */
let gemerkt: { token: string; client: SanityClient } | null = null;

/** `null`, wenn kein Token gesetzt ist — dann gibt es keine Vorschau. */
export function vorschauClient(): SanityClient | null {
  const token = vorschauToken();
  if (!token) return null;
  if (gemerkt?.token === token) return gemerkt.client;

  const client = createClient({
    projectId: PROJEKT,
    dataset: DATENSATZ,
    apiVersion: "2026-07-28",
    useCdn: false,
    token,
    perspective: "drafts",
    stega: { enabled: true, studioUrl: STUDIO },
  });

  gemerkt = { token, client };
  return client;
}

/** Name des Cookies, das die Vorschau freischaltet. */
export const VORSCHAU_COOKIE = "mp-vorschau";

/**
 * Welche Seite steckt hinter einem Pfad?
 *
 * Die Umkehrung von `pfadVon()` im Studio. Sie steht hier ausgeschrieben und
 * nicht als importierte Regel: Das Studio ist ein eigenes Paket, und ein
 * Import über die Ordnergrenze wäre der Rückschritt hinter Stufe A, den
 * `web/CLAUDE.md` verbietet. Läuft sie auseinander, zeigt die Vorschau auf
 * eine andere Seite als die Website — deshalb prüft `web:check` die
 * Routen-Deckung gegen dieselbe Quelle.
 */
export type Ziel =
  | { art: "startseite" }
  | { art: "leistung"; slug: string }
  | { art: "magazinIndex" }
  | { art: "beitrag"; slug: string }
  | { art: "karriere" }
  | { art: "rechtstext"; slug: string };

export function zielVon(pfad: string): Ziel | null {
  /* Führende und schließende Schrägstriche weg — Astro liefert den Rest-Pfad
     mal mit, mal ohne, je nachdem ob die URL auf / endet. */
  const teile = pfad.split("/").filter(Boolean);

  if (teile.length === 0) return { art: "startseite" };
  if (teile[0] === "karriere" && teile.length === 1) return { art: "karriere" };
  if (teile[0] === "magazin") {
    if (teile.length === 1) return { art: "magazinIndex" };
    if (teile.length === 2) return { art: "beitrag", slug: teile[1] };
  }
  if (teile[0] === "leistungen" && teile.length === 2) {
    return { art: "leistung", slug: teile[1] };
  }
  /* Zuletzt, nicht zuerst: Rechtstexte liegen auf der obersten Ebene, und
     `/karriere` läge dort auch. Erst die festen Pfade prüfen, dann den Rest
     als Slug lesen — sonst verdeckte ein Rechtstext namens „karriere" die
     Karriereseite. Im Studio verhindert `slugFrei()` genau diesen Fall, aber
     die Reihenfolge hier darf sich nicht darauf verlassen. */
  if (teile.length === 1) return { art: "rechtstext", slug: teile[0] };
  return null;
}
