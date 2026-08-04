# web/ — die Website

**Produkt.** Was hier geändert wird, geht live.

Astro 5, statisch. Kein Adapter, kein SSR: `output: "static"`, keine
`prerender`-Ausnahme, keine API-Route. Der Build wirft 15 fertige
HTML-Dateien aus, Netlify liefert sie als Dateien aus.

```bash
npm run dev      # Port 4321
npm run build
npm run check    # astro check
```

Vom Projektstamm aus: `npm run web`, `npm run web:build`, `npm run web:check`.

## In sich geschlossen

Seit A2 liegt das Fundament hier, nicht mehr im Prototyp:

```
src/styles/    tokens.css · base.css · shared.css
src/js/        init.js · lib/ · modules/
public/        echter Ordner, kein Symlink
```

**Nichts in `src/` importiert aus einem Ordner oberhalb von `web/`.** Wenn
doch einmal ein `../../../` auftaucht, ist das ein Rückschritt hinter A2 und
kein Detail: Genau diese Richtung hat dafür gesorgt, dass eine Änderung „im
Prototyp" die ausgelieferte Seite traf.

Umgekehrt ist es erlaubt und gewollt — `prototypen/vite/` borgt sich Tokens,
Basis-CSS und die Modulliste von hier.

## Der verbindliche Teil

`STRUKTUR.md` daneben ist nicht Beiwerk, sondern die Hausordnung: Stilebenen,
die beiden Fallen beim Abgrenzen (`:global()`, `html.js`), warum verborgene
Startzustände ins CSS gehören und nicht in GSAP, und in welcher der drei
Stufen ein neues Modul anläuft.

Die Kurzfassung, die am häufigsten gebraucht wird:

- **Seiten setzen zusammen, sie gestalten nicht.** Ein `<style>`-Block unter
  `pages/` heißt: ein Baustein fehlt.
- **Fremdes Markup braucht `:global()`.** Astro hängt sein Scope-Attribut an
  jeden Selektorteil; ein `<img>` aus `Picture.astro` trägt es nicht.
- **`html.js`, nie bloß `.js`.** Sonst wird daraus
  `.js[data-astro-cid-…]` und trifft das `<html>` nie.
- **Keine Farb- oder Abstandswerte in Komponenten.** Nur Tokens. Fehlt einer,
  gehört er nach `tokens.css`.

## Inhalte

Kommen zur Bauzeit aus Sanity (`src/lib/`). Eine Änderung im Studio erscheint
erst nach einem neuen Build — bis Aufgabe 14 aus `CMS-UMBAU.md` den Webhook
einrichtet, heißt das: `npm run web:deploy`.

Wie weit die Umstellung ist und was als Nächstes ansteht, steht in
`../CMS-UMBAU.md`. Wo `../SANITY.md` ihr widerspricht, sticht die Liste.
