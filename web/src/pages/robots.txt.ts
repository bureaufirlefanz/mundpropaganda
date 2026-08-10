import type { APIRoute } from "astro";
import { loadSettings } from "../lib/settings";

/**
 * robots.txt aus dem CMS statt als feste Datei unter `public/`.
 *
 * Vorher stand hier `Disallow: /` in einer Datei mit dem Kommentar „vor dem
 * echten Livegang entfernen" — an zwei Stellen, denn `public/_headers` trug
 * dieselbe Sperre als Kopfzeile. Beides zu vergessen ist leicht und fällt
 * niemandem auf: Eine Seite, die nicht indexiert wird, sieht genauso aus wie
 * eine, die es wird. Sie taucht nur nie bei Google auf, und bis das jemand
 * bemerkt, vergehen Wochen.
 *
 * Jetzt entscheidet ein Schalter im Studio, und er schaltet alle drei Stellen
 * zugleich: diese Datei, die Kopfzeile (siehe die Integration in
 * `astro.config.mjs`) und das `noindex` in jeder Seite (`Base.astro`).
 *
 * Die Route ist vorgerendert wie alles andere — sie wird beim Build zu einer
 * fertigen Datei in `dist/`. Ein Wechsel des Schalters wirkt also erst nach
 * dem nächsten Build, genau wie jede andere Änderung am Inhalt.
 */
export const GET: APIRoute = async () => {
  const { website } = await loadSettings();

  /* `Allow: /` ist nicht dasselbe wie eine leere Datei, auch wenn beides
     erlaubt: Es sagt ausdrücklich, dass hier nichts vergessen wurde. */
  const body = website.searchEngines
    ? "User-agent: *\nAllow: /\n"
    : "User-agent: *\nDisallow: /\n";

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
