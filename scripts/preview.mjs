/**
 * Liefert den Build aus `web/dist` aus. Ersatz für `astro preview`.
 *
 * **Warum nicht `astro preview`:** Seit der Netlify-Adapter im Spiel ist,
 * lehnt Astro den Befehl ab — „The @astrojs/netlify adapter does not support
 * the preview command". Das gilt, seit der Adapter dazukam; aufgefallen ist
 * es lange nicht, weil ein früher gestarteter Server weiterlief und die
 * folgenden Aufrufe still scheiterten. Erst als der alte Prozess endete,
 * standen `web:check` und `web:styles` ohne Server da.
 *
 * Ein statischer Server reicht: Der Build ist bis auf `/preview/*` statisch,
 * und diese eine Route prüft hier ohnehin niemand — sie braucht einen Token
 * und ein Cookie aus dem Studio.
 *
 * Ohne Abhängigkeit, weil eine Prüfkette nicht an einem Paket hängen sollte,
 * das man für sie allein installiert.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const WURZEL = "web/dist";
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4322);

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

/**
 * Astro legt jede Seite als `pfad/index.html` ab. Der Server muss deshalb
 * drei Dinge probieren, in dieser Reihenfolge: die Datei selbst, dieselbe mit
 * `.html`, und das `index.html` im Verzeichnis. Ohne den mittleren Schritt
 * fände `/karriere.html` nichts, ohne den letzten `/karriere`.
 */
async function finde(pfad) {
  const kandidaten = [pfad, `${pfad}.html`, join(pfad, "index.html")];
  for (const k of kandidaten) {
    try {
      const s = await stat(k);
      if (s.isFile()) return k;
    } catch {
      /* weiter */
    }
  }
  return null;
}

createServer(async (anfrage, antwort) => {
  const url = new URL(anfrage.url ?? "/", "http://localhost");
  /* `normalize` gegen `..` im Pfad. Ein Prüfserver ist zwar nur lokal
     erreichbar, aber ein Verzeichniswechsel nach oben ist nie beabsichtigt. */
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const datei = await finde(join(WURZEL, rel));

  if (!datei) {
    antwort.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    antwort.end("404");
    return;
  }

  antwort.writeHead(200, {
    "content-type": TYPEN[extname(datei)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  antwort.end(await readFile(datei));
}).listen(PORT, () => {
  console.log(`Build aus ${WURZEL} auf http://localhost:${PORT}`);
});
