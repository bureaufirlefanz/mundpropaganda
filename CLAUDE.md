# Mundpropaganda

## Was ist das Produkt

**Astro + Sanity.** Entschieden am 04.08.2026. Alles andere ist Prototyp.

| Ordner | Was | Status |
|---|---|---|
| `web/` | Astro — die Website | **Produkt** |
| `studio/` | Sanity — das CMS | **Produkt** |
| `prototypen/vite/` | Handlebars-Stand | Archiv, nicht ändern |
| `prototypen/webflow/` | Lumos-Rekonstruktion | Prototyp, nur auf Ansage |
| `scripts/` | Bildpipeline, Aufnahmen, Prüfungen | Werkzeug |

Wer hier landet, ohne den Aufbau zu kennen: Änderungen an der Website gehören
nach `web/` oder `studio/`. Ein Eingriff unter `prototypen/` ändert nichts an
dem, was ausgeliefert wird — und wird nicht erwartet.

Bis A2 war das umgekehrt: `web/` importierte Tokens, Basis-CSS und das gesamte
JavaScript aus dem Prototyp, und `web/public` war ein Symlink dorthin. Wer im
„Prototyp" arbeitete, änderte die Live-Website. Diese Falle ist zu.

```bash
npm run web         # Astro, Port 4321
npm run studio      # Sanity Studio, Port 3333
npm run web:check   # Typen, Rauchtest, Barrierefreiheit
npm run web:deploy  # bauen und auf Netlify veröffentlichen
```

Weiterführend: `README.md` · `SANITY.md` · `web/STRUKTUR.md` (Aufbau der
Astro-App, verbindlich) · `CMS-UMBAU.md` (die laufende Umbauliste) ·
`ANLEITUNG.md` (eine Seite für den Kunden)

Je eine `CLAUDE.md` liegt in `web/` und `studio/` mit dem, was dort gilt.

## Grundregeln

- **Seiten setzen zusammen, sie gestalten nicht.** Ein `<style>`-Block unter
  `pages/` ist der Hinweis, dass ein Baustein fehlt. Siehe `web/STRUKTUR.md`.
- **Ein Baustein, eine Datei** — Markup und Regeln zusammen.
- `web/src/styles/tokens.css` ist die einzige Quelle für Werte. Keine Magic
  Numbers, keine Hex-Werte außerhalb davon.
- CSS-Konvention: `s-*` Abschnitt, `c-*` Komponente, `__element`, `--modifier`.
  Kein Tailwind, keine atomaren Utilities.
- **Keine Gedankenstriche in Texten**, die auf der Seite erscheinen. Ein
  Bindestrich tut es; besser ist ein Satz, der ohne auskommt. Bereiche
  („Mo–Fr", „8–19 Uhr") und Preise („450,–") sind davon nicht betroffen.

## Sanity

Siehe `SANITY.md` und das Skill `sanity-best-practices` (`.agents/skills/`).
Abfragen liegen in `web/src/lib/`.

## Webflow + Lumos

**Ein Prototyp. Arbeit daran nur auf ausdrückliche Ansage.**

Die Site *sollte* einmal in Webflow rekonstruiert werden; diese Absicht steht
nicht mehr. Was für den Fall gälte, dass sie zurückkommt, liegt vollständig in
`prototypen/webflow/` — Site-ID, Lumos-Version, die Grenzen des MCP und die
Abbildung der BEM-Klassen auf Lumos.

Falls es doch losgeht: **erst das Skill `webflow-lumos` lesen**
(`.agents/skills/webflow-lumos/`, verlinkt nach `.claude/skills/`), nicht aus
dem Gedächtnis arbeiten. `site_id` nie annehmen, nie eine `u-`-Klasse oder
einen Variablennamen erfinden.

## Projektentscheidungen

<!-- Getroffene Entscheidungen hier festhalten, damit sie Sessions überdauern. -->

- **Astro + Sanity ist das Produkt** (04.08.2026). Webflow/Lumos und der
  Vite-Stand sind Prototypen.
- **Der CMS-Umbau läuft nach `CMS-UMBAU.md`.** Stufe A bis 3 sind durch:
  Ordnung, Absicherung, das Studio sagt die Wahrheit, Presentation Tool,
  Studio-Politur. Alle Inhalte lassen sich über das CMS pflegen — Startseite,
  Leistungen, Magazin, Karriere, Navigation und Fuß. Offen ist Stufe 4
  (Betrieb): der Webhook, die Rollen. Beides braucht Zugänge außerhalb des
  Repositorys, siehe „Betrieb" in `SANITY.md`.
- **Offene Webflow-Fragen** (Slug-Sprache, Filterung, Spacing in rem) stehen
  in `prototypen/webflow/README.md` und sind ruhend gestellt.
