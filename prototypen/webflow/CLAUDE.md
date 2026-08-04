# Webflow / Lumos — Prototyp

**Arbeit hier nur auf ausdrückliche Ansage.**

Astro + Sanity ist das Produkt (entschieden am 04.08.2026). Dieser Ordner
hält fest, was eine Rekonstruktion in Webflow bräuchte — er beschreibt keinen
Auftrag.

## Die Site

| | |
|---|---|
| **Name** | `Mundpropaganda` |
| **site_id** | `6a70585b5d65de23c37135b7` |
| **Primäre Sprache** | `de` |
| **Framework** | Lumos v2.2.3 |
| **Stand** | Discovery, nichts aufgebaut |

`site_id` nie annehmen, immer über `data_sites_tool` lesen. **Nie eine
`u-`-Klasse oder einen Variablennamen erfinden** — erst `get_styles` /
`get_variables` lesen und wiederverwenden, was existiert.

## Sessionstart, falls es doch losgeht

```
1. webflow_guide_tool
2. data_agent_instructions_tool > search_instructions   (Site-Rules haben Vorrang)
3. Discovery-Pass — Skill-Referenz: mcp-workflow.md §1
```

Das Skill liegt weiterhin unter `.agents/skills/webflow-lumos/`, nicht hier:
Skills gehören nicht in einen Inhaltsordner.

## Was hier liegt

`astro-webflow-parity.md` — die Abbildung der hiesigen BEM-Klassen und Tokens
auf Lumos. Sie stand bis A3 unter `.claude/rules/` und steuerte damit Arbeit,
die niemand beauftragt hatte.

## Grenzen des MCP

Nicht setzbar: Quelle, Filter und Sortierung einer Collection List;
IX3-Interaktionen; Conditional-Visibility-Bindings; Datums- und
Zahlenformatierung an Bindings; lokalisierte CMS-Items.

Empirisch (Stand 2026-08-03, MCP 2.0.1):

- **`custom_value` bei Variablen schlägt serverseitig fehl** — jeder Typ, jede
  Collection. Fluide `clamp()`-Werte nur im Designer. Für Transparenzfarben
  hilft Hex mit Alphakanal.
- **`create_style` mit `var()`-Werten** schlägt fehl; `update_style` setzt
  denselben Wert danach anstandslos.
- **Component-Instanzen in Slots verschachtelter Instanzen** sind headless
  nicht adressierbar.

## Nicht anfassen

- Variable `site/column-width`
- Variablen-Collections *Column Count*, *Gap*, *Trigger*, *State*,
  *Responsive* — Framework-Schaltmechanik, keine Design-Tokens
- `page_main` muss ein Page Slot bleiben
- Die `Global Styles`-Komponente
