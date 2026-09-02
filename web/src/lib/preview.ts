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
const STUDIO =
  import.meta.env.PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

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
export function previewToken(): string | undefined {
  const laufzeit =
    typeof process !== "undefined"
      ? process.env?.SANITY_API_READ_TOKEN
      : undefined;
  return (
    laufzeit || (import.meta.env.SANITY_API_READ_TOKEN as string | undefined)
  );
}

/* Am Token gemerkt, nicht global: Wechselt er zur Laufzeit, entsteht ein
   neuer Client statt weiter mit dem alten zu arbeiten. */
let cached: { token: string; client: SanityClient } | null = null;

/** `null`, wenn kein Token gesetzt ist — dann gibt es keine Vorschau. */
export function previewClient(): SanityClient | null {
  const token = previewToken();
  if (!token) return null;
  if (cached?.token === token) return cached.client;

  const client = createClient({
    projectId: PROJEKT,
    dataset: DATENSATZ,
    apiVersion: "2026-07-28",
    useCdn: false,
    token,
    perspective: "drafts",
    stega: { enabled: true, studioUrl: STUDIO },
  });

  cached = { token, client };
  return client;
}

/** Name des Cookies, das die Vorschau freischaltet. */
export const PREVIEW_COOKIE = "mp-preview";
