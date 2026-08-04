# Webflow-Rekonstruktion — Stand

Kein Auftrag, sondern ein Notizstand. Was hier steht, gälte, falls die Site
irgendwann doch in Webflow nachgebaut wird.

| | |
|---|---|
| **Webflow-Site** | `Mundpropaganda` |
| **site_id** | `6a70585b5d65de23c37135b7` |
| **Primäre Sprache** | `de` |
| **Framework** | Lumos v2.2.3 |
| **Aufgebaut** | nichts — Discovery gelaufen, keine Seite, keine Collection |

## Vorgesehene Collections

Magazin, Reviews, Team, Offene Stellen sowie die Hilfscollections Kategorie,
Tag, Abteilung, Standort und Leistung. Die Schemata liegen im Skill unter
`cms-collections.md`.

## Offene Entscheidungen

- **Slug-Sprache** — deutsch mit Transliteration, oder englisch?
- **Filterung** — nativ, oder Finsweet Attributes List Filter?
- **Spacing-Tokens** — hier px, Lumos verlangt rem. Beim Übertragen als
  `space/*` in rem anlegen und die Abweichung benennen.

## Dateien

- `astro-webflow-parity.md` — Abbildung der BEM-Klassen und Tokens auf Lumos
- `CLAUDE.md` — was für eine Sitzung in diesem Ordner gilt
