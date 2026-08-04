# Mundpropaganda

## Aufbau

| Ort | Was |
|---|---|
| `src/` | Vite + Handlebars — der ursprüngliche Prototyp (`npm run dev`, Port 5173) |
| `web/` | **Astro-App** — der aktuelle Stand (`npm run web`, Port 4321) |
| `studio/` | Sanity Studio (`npm run studio`, Port 3333) |
| `scripts/` | Bildoptimierung, Screenshots, Checks |

Weiterführend: `README.md` · `SANITY.md` · `web/STRUKTUR.md` (Aufbau der Astro-App, verbindlich)

## Grundregeln

- **Seiten setzen zusammen, sie gestalten nicht.** Ein `<style>`-Block unter `pages/` ist der
  Hinweis, dass ein Baustein fehlt. Siehe `web/STRUKTUR.md`.
- **Ein Baustein, eine Datei** — Markup und Regeln zusammen.
- `src/styles/tokens.css` ist die einzige Quelle für Werte. Keine Magic Numbers, keine Hex-Werte
  außerhalb davon.
- CSS-Konvention: `s-*` Abschnitt, `c-*` Komponente, `__element`, `--modifier`.
  Kein Tailwind, keine atomaren Utilities.

## Webflow + Lumos

Die Site soll perspektivisch als Webflow-Projekt auf **Lumos v2.2.3** rekonstruiert werden.
Verbunden über den Webflow-MCP-Server.

| | |
|---|---|
| **Webflow-Site** | `Mundpropaganda` |
| **site_id** | `6a70585b5d65de23c37135b7` |
| **Primäre Sprache** | `de` |

**Vor jeder Webflow-Arbeit das Skill `webflow-lumos` verwenden**
(`.agents/skills/webflow-lumos/`, verlinkt nach `.claude/skills/`). Es enthält Klassen- und
Variablen-Konventionen, MCP-Aufrufreihenfolge, CMS-Schemata und die QA-Checkliste.
Nicht aus dem Gedächtnis arbeiten.

Sessionstart für Webflow:

```
1. webflow_guide_tool
2. data_agent_instructions_tool > search_instructions   (Site-Rules haben Vorrang)
3. Discovery-Pass — Skill-Referenz: mcp-workflow.md §1
```

`site_id` nie annehmen. **Nie eine `u-`-Klasse oder einen Variablennamen erfinden** — erst
`get_styles` / `get_variables` lesen und wiederverwenden, was existiert.

Die Abbildung von hiesigen BEM-Klassen und Tokens auf Lumos steht in
`.claude/rules/astro-webflow-parity.md`.

### Grenze des MCP

MCP kann **Quelle, Filter und Sortierung einer Collection List nicht setzen** — das bleibt
Handarbeit im Designer. Hülle anlegen, dann übergeben. Bindings an Kindelemente funktionieren erst
danach. Eine Liste nie als fertig melden, wenn sie es nicht ist.

Ebenfalls nicht verfügbar: IX3-Interaktionen/Animationen, Conditional-Visibility-Bindings,
Datums-/Zahlenformatierung an Bindings, Anlegen lokalisierter CMS-Items.

Empirisch festgestellt (Stand 2026-08-03, MCP 2.0.1):

- **`custom_value` bei Variablen schlägt serverseitig fehl** (jeder Typ, jede Collection —
  „internal error"). Fluide `clamp()`-Werte lassen sich nur im Designer/Fluid Builder ändern.
  Workaround für Transparenzfarben: Hex mit Alphakanal (exakt äquivalent zu
  `color-mix(... transparent)`). `create_style` mit `var()`-Property-Werten schlägt ebenfalls
  fehl — derselbe Wert lässt sich aber per `update_style` nachträglich setzen.
- **Component-Instanzen in Slots verschachtelter Instanzen** (z. B. Footer Groups im
  Grid-Slot des Footers) sind headless nicht adressierbar — Props nur im Designer setzbar.

### Nicht anfassen

- Variable `site/column-width`
- Variablen-Collection *Column Count* (eine Collection *Alignment* existiert auf der Site
  nicht — nur die Klassen `u-alignment-*`)
- Variablen-Collections *Gap*, *Trigger*, *State*, *Responsive* — Framework-Schaltmechanik,
  keine Design-Tokens
- `page_main` muss ein Page Slot bleiben
- Die `Global Styles`-Komponente

## Sanity

Siehe `SANITY.md` und das Skill `sanity-best-practices` (`.agents/skills/`).
Abfragen liegen in `web/src/lib/`.

## Projektentscheidungen

<!-- Getroffene Entscheidungen hier festhalten, damit sie Sessions überdauern. -->

- **Webflow-Collections:** Magazin, Reviews, Team, Offene Stellen + Hilfscollections
  (Kategorie, Tag, Abteilung, Standort, Leistung) — Schemata im Skill unter `cms-collections.md`
- **Slug-Sprache:** `TODO — deutsch mit Transliteration, oder englisch?`
- **Filterung:** `TODO — nativ, oder Finsweet Attributes List Filter?`
- **Spacing-Tokens:** aktuell px; für Lumos in rem zu überführen — noch offen
